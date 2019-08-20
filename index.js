//error handling
const nodemailer = require('nodemailer');
const moment = require('moment');
const config = require('./env.config')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email_sender_username,
    pass: config.email_sender_password
  }
});
process.on('uncaughtException', function (err) {
  // handle the error safely
  console.log(400, ' Start Error Message: ', err)
  // send email
  const mailOptions = {
    from: config.email_sender_username,
    to: config.email_target,
    subject: `[Mutasi BRI App] Error on ${moment().format('HH:ss, DD/MM/YYYY')}`,
    text: err.message
  };
  config.email_sender_username && transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Error Email sent: ' + info.response);
    }
  })
})

//modul mongodb utk koneksi mongo db database
var url = 'mongodb://127.0.0.1:27017/q100';
var mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true });

const express = require('express');
const app = express();

var server = require('http').createServer(app);

const CekBRI = require('./CekBRI');

const schedule = require('node-schedule');

const setiap_5menit = '*/10 * * * *';

schedule.scheduleJob(setiap_5menit, () => {
    const cek_bri = new CekBRI(config, transporter);
})

const Mutasi = require('./model/mutasi.model')
app.get('/', (req, res) => {
    Mutasi.find({}, (err, resp)=>{
        let mutasi = '';
        resp.forEach((mts, i, arr)=>{
            mutasi += `${mts.nama_trx}: Rp${mts.nama_trx}</br>`
        })
        res.send(mutasi);
    })
})

server.listen(81, function () {
    console.log('Server listening on ' + (81));
});