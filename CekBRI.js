const moment = require('moment');
const cheerio = require('cheerio');
const async = require('async');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const Mutasi = require('./model/mutasi.model')

const { Curl, CurlFeature } = require('node-libcurl');
Curl.defaultUserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36";

module.exports = class CekBRI {

    constructor(config, transporter) {
        //target link
        this._urlPrepareLogin = 'https://ib.bri.co.id/ib-bri/Login.html';
        this._urlCaptcha = 'https://ib.bri.co.id/ib-bri/login/captcha';
        this._urlPrepareMutasi = 'https://ib.bri.co.id/ib-bri/AccountStatement.html';
        this._urlLogout = 'https://ib.bri.co.id/ib-bri/Logout.html';
        this._transporter = transporter;
        //cookie path
        this._cookiePath = path.join(__dirname, 'cookiejar.txt');
        if (!fs.existsSync(this._cookiePath)) {
            fs.writeFileSync(this._cookiePath)
        }
        //vars
        this._loginRawHTML = '';
        this._prepareMutasiDom = '';
        this._mutasiDom = '';
        this._step;
        this.VIEW_TYPE = 1;

        this._mutasiRawHTML = '';
        this._status = 'GAGAL';
        this._config = config;

        //new agent
        this.curl = new Curl();
        //set default options
        this.curl.setOpt(Curl.option.COOKIEJAR, this._cookiePath);
        this.curl.setOpt(Curl.option.COOKIEFILE, this._cookiePath);
        this.curl.setOpt(Curl.option.SSL_VERIFYHOST, 0);
        this.curl.setOpt(Curl.option.SSL_VERIFYPEER, 0);
        this.curl.setOpt(Curl.option.FOLLOWLOCATION, 1);
        //error handler
        this.curl.on('error', (err) => {
            console.log(err);
        })

        this.run();
    }

    run() {
        async.auto({
            prepareLogin: (cb) => {
                this._step = 1;
                this.prepareLogin(cb)
            },
            getCaptcha: ['prepareLogin', (prev, cb) => {
                this._step = 2;
                this.getCaptcha(cb)
            }
            ],
            // loginPersiapan: ['getCaptcha', (prev, cb) => {
            //     this._step = 3;
            //     this.loginPersiapan(cb)
            // }
            // ],
            login: ['getCaptcha', (prev, cb) => {
                this._step = 3;
                this.login(cb)
            }
            ],
            prepareMutasi: ['login', (prev, cb) => {
                this._step = 4;
                this.prepareMutasi(cb)
            }
            ],
            getMutasi: ['prepareMutasi', (prev, cb) => {
                this._step = 5;
                this.getMutasi(cb)
            }
            ],
            logout: ['getMutasi', (prev, cb) => {
                this._step = 6;
                this.logout(cb)
            }
            ]
        }, (err, finish_result) => {
            if (err) {
                this._step = 6;
                this.logout(() => {
                    this.curl.close();
                })
            } else {
                console.log('Done.');
                this.curl.close();
                this.getAllMutasi().forEach((mutasi, i, arr) => {
                    const new_mutasi = { tgl: mutasi.tgl, trf_masuk: mutasi.kredit, saldo_saat_ini: mutasi.saldo }
                    Mutasi.findOneAndUpdate(
                        new_mutasi, 
                        new_mutasi, 
                        { upsert: true, new: true, setDefaultsOnInsert: true }, function (error, result) {
                        if (error) return;
                    });
                })
                (this.getAllMutasi().length)&&this._transporter.sendMail({
                    from: this._config.email_sender_username,
                    to: this._config.email_target,
                    subject: `[Mutasi BRI App] Check on ${moment().format('HH:ss, DD/MM/YYYY')}`,
                    text: JSON.stringify(this.getAllMutasi())
                }, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                })
            }
        })
    }

    prepareLogin(cb) {
        //set url login
        this.curl.setOpt(Curl.option.URL, this._urlPrepareLogin);
        let loginRawHTML = '';
        this.curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
            loginRawHTML += buff.toString();
            return buff.length;
        })
        this.curl.on('end', () => {
            if (this._step === 1) {
                this._loginRawHTML = loginRawHTML;
                cb(null, 'prepareLogin ok')
            }
        })
        //perform request
        console.log('1. Opening login page...');
        this.curl.perform();
    }

    getCaptcha(cb) {
        //set url captcha
        this.curl.setOpt(Curl.option.URL, this._urlCaptcha);
        //path gambar captcha
        const fileOutPath = path.join(process.cwd(), 'bri.captcha.png')
        const fileOut = fs.openSync(fileOutPath, 'w+')
        this.curl.enable(CurlFeature.Raw | CurlFeature.NoStorage)
        //fungsi simpan gambar
        this.curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
            let written = 0
            written = fs.writeSync(fileOut, buff, 0, nmemb * size)
            return written
        })
        this.curl.on('end', () => {
            if (this._step === 2) {
                fs.closeSync(fileOut)
                cb(null, 'get captcha ok')
            }
        })
        console.log('2. Get Captcha...');
        this.curl.perform();
    }

    login(cb) {
        //init afterLoginRawHTML
        let afterLoginRawHTML = '';
        this.curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
            afterLoginRawHTML += buff.toString();

            return buff.length;
        })
        //get csrf token
        const $ = cheerio.load(this._loginRawHTML);
        const _token = $('input[name=csrf_token_newib]').val();
        //solve captcha
        console.log('3. Solving captcha...');
        this.solveCaptcha((_tokenCode) => {
            //post data
            let postData = {
                'csrf_token_newib': _token,
                'j_password': this._config['api']['password'],
                'j_username': this._config['api']['username'],
                'j_plain_username': this._config['api']['username'],
                'preventAutoPass': '',
                'j_plain_password': '',
                'j_code': _tokenCode,
                'j_language': 'in_ID'
            };
            this.curl.setOpt(Curl.option.POSTFIELDS, querystring.stringify(postData))
            this.curl.setOpt(Curl.option.VERBOSE, false)
            this.curl.setOpt(Curl.option.POST, 1)
            this.curl.setOpt(Curl.option.URL, $('#loginForm').attr('action'));
            this.curl.on('end', (code, body, headers) => {
                if (this._step === 3) {
                    if (afterLoginRawHTML.includes('BBR00C2')) {
                        console.log('>> Captcha salah.');
                        cb('SALAH CAPTCHA', null)
                    } else if (afterLoginRawHTML.includes('BBR00P7')) {
                        console.log('>> Sedang login di tempat lain.');
                        cb('SEDANG LOGIN', null)
                    } else if (afterLoginRawHTML.includes('BBR00P2')) {
                        console.log('>> Login salah.');
                        this.login(cb)
                        cb('LOGIN SALAH', null)
                    } else {
                        console.log('>> Login sukses!');
                        this._status = 'BERHASIL';
                        cb(null, 'login ok')
                    }
                }
            })
            console.log('4. Submit login...');
            this.curl.perform();
        });
    }

    solveCaptcha(cb) {
        exec("magick bri.captcha.png -flatten -fuzz 20% -trim +repage -white-threshold 5000 -type bilevel bri.captcha.png", (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                cb('1234');
            }
            const hasil_ocr = path.join(__dirname, 'bri.hasil');
            exec('tesseract "' + path.join(__dirname, 'bri.captcha.png') + '" "' + hasil_ocr + '" -psm 7 -c "tessedit_char_whitelist=01234567890"', (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    cb('1234');
                }
                const captcha = fs.readFileSync(hasil_ocr + '.txt').toString('utf8').replace(/\D/g, '');
                console.log('>> Captcha: ', captcha);
                cb(captcha);
            });
        });
    }

    prepareMutasi(cb) {
        //set url & opt
        this.curl.setOpt(Curl.option.URL, this._urlPrepareMutasi);
        this.curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
            this._prepareMutasiDom += buff.toString();
            return buff.length
        })
        this.curl.on('end', () => {
            if (this._step === 4) {
                cb(null, 'prepareMutasi ok')
            }
        })
        console.log('5. Opening mutasi page...');
        this.curl.perform();
    }

    getMutasi(cb) {
        //init mutasi raw html
        this.curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
            this._mutasiRawHTML += buff.toString();
            return buff.length;
        })
        const $ = cheerio.load(this._prepareMutasiDom);
        const _token = $('input[name=csrf_token_newib]').val();
        let postData = {
            'csrf_token_newib': _token,
            'FROM_DATE': moment().format('YYYY-MM-DD'),
            'TO_DATE': moment().format('YYYY-MM-DD'),
            'download': '',
            'data-lenght': '2',
            'ACCOUNT_NO': this._config['nomor_rekening'],
            'DDAY1': moment().format('DD'),
            'DMON1': moment().format('MM'),
            'DYEAR1': moment().format('YYYY'),
            'DDAY2': moment().format('DD'),
            'DMON2': moment().format('MM'),
            'DYEAR2': moment().format('YYYY'),
            'VIEW_TYPE': this.VIEW_TYPE,
            'MONTH': moment().format('MM'),
            'YEAR': moment().format('YYYY'),
            'submitButton': 'Tampilkan'
        };
        this.curl.setOpt(Curl.option.POSTFIELDS, querystring.stringify(postData))
        this.curl.setOpt(Curl.option.VERBOSE, false)
        this.curl.setOpt(Curl.option.POST, 1)
        this.curl.setOpt(Curl.option.URL, $('#frm1').attr('action') || `https://ib.bri.co.id/ib-bri/Br11600d.html` );
        this.curl.on('end', (code, body, headers) => {
            if (this._step === 5) {
                if (this._mutasiRawHTML.includes('ISO0003')) {
                    console.log('>> Time out...');
                    this._status = 'GAGAL';
                    //ganti view type mutasi ke hari ini
                    this.VIEW_TYPE = 2;
                    cb('Time out', null)
                } else {
                    console.log('>> Ambil mutasi Sukses!');
                    this._mutasiDom = cheerio.load(this._mutasiRawHTML);
                    cb(null, 'getMutasi ok')
                }
            }
        })
        console.log('6. Submit mutasi request...');
        this.curl.perform();
    }

    logout(cb) {
        this.curl.setOpt(Curl.option.URL, this._urlLogout);
        this.curl.on('end', () => {
            if (this._step === 6) {
                cb(null, 'logout ok')
            }
        })
        console.log('7. Log out...');
        this.curl.perform();
    }

    get status() {
        return this._status;
    }

    getAllMutasi() {
        if (!this._mutasiRawHTML.includes('ISO0003')) {
            let tableMutasi = this._mutasiDom('#tabel-saldo');
            let rows = tableMutasi.find('tbody').find('tr');
            let transaksi = [];
            rows.each((i, tr) => {
                let data = this._mutasiDom(tr).find('td');
                if ((this._mutasiDom(data[0]).text()).match(/\d/)) {
                    transaksi.push({
                        tgl: this._mutasiDom(data[0]).text(),
                        transaksi: this._mutasiDom(data[1]).text(),
                        debet: this._mutasiDom(data[2]).text().replace(/\t|\s|\.|\,00/g, ''),
                        kredit: this._mutasiDom(data[3]).text().replace(/\t|\s|\.|\,00/g, ''),
                        saldo: this._mutasiDom(data[4]).text().replace(/\t|\s|\.|\,00/g, ''),
                    });
                }
            })
            return transaksi;
        } else {
            return [];
        }
    }
}