const cheerio = require('cheerio');

let str = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<html xmlns="http://www.w3.org/1999/xhtml" lang="id"><head>
<title>Mutasi Rekening</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Pragma" CONTENT="no-cache">
<meta http-equiv="Expires" CONTENT="-1">
<meta name="Keywords" content="keyword">
<meta name="Description" content="description">
<script type="text/javascript" src="js/css-filter.js"></script>
<script type="text/javascript" src="js/split-deskripsi.js"></script>
<script type="text/javascript" src="js/ki.js"></script>
<script type="text/javascript" src="js/css.js"></script>
<script type="text/javascript" src="js/ajax.js"></script>
<script language="JavaScript" src="js/input-validation.js"></script>

        <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
        <META HTTP-EQUIV="Expires" CONTENT="-1">
        <link href = css/bank_print.css rel="stylesheet" type="text/css" media="print">
        <script src = "js/jquery-1.js" type="text/javascript"></script>
        <script src = "js/jquery.js" type="text/javascript"></script>

<script language="JavaScript">
<!--
if ( navigator.appName == "Netscape" )
{
      document.captureEvents(Event.MOUSEUP)
      document.captureEvents(Event.KEYPRESS)
}

document.onmouseup = reset;
document.onkeypress = reset;

function reset ( e )
{
   parent.reset( e );
}
//-->
</script>
<script language="JavaScript">
<!--
if (self.location==top.location)
   window.location = 'login/logout';

var submitting = false;
function checkForm(form)
{
        if (form.ACCOUNT_NO.value == "") {
                alert ("REKENING ASAL harus diisi");
                form.ACCOUNT_NO.focus();
                return false;
        }

        var start_day = form.DDAY1.options[form.DDAY1.selectedIndex].value;
        var start_mon = form.DMON1.options[form.DMON1.selectedIndex].value;
        var start_year = form.DYEAR1.options[form.DYEAR1.selectedIndex].value;

        var end_day = form.DDAY2.options[form.DDAY2.selectedIndex].value;
        var end_mon = form.DMON2.options[form.DMON2.selectedIndex].value;
        var end_year = form.DYEAR2.options[form.DYEAR2.selectedIndex].value;

        var select_month = form.MONTH.options[form.MONTH.selectedIndex].value;
        var select_year = form.YEAR.options[form.YEAR.selectedIndex].value;

        var limit_day = 07;
        var limit_mon = 02;
        var limit_year = 2019;

        var current_date = new Date();
        var start_date = new Date(start_year,(start_mon - 1),start_day);
        var end_date = new Date(end_year,(end_mon - 1),end_day);
        var limit_date =  new Date(limit_year, (limit_mon - 1), limit_day);
        var diff = (end_date-start_date)/60/60/24/1000;

        if (form.VIEW_TYPE[0].checked) {
                if (!checkday(parseInt(start_year,10), parseInt(start_mon,10), parseInt(start_day, 10))) {
                        alert("TANGGAL DARI tidak valid");
                        return false;
                }
                if (!checkday(parseInt(end_year,10), parseInt(end_mon,10), parseInt(end_day, 10))) {
                        alert("TANGGAL KE tidak valid");
                        return false;
                }
                if (end_date < start_date) {
                        alert("Tanggal AWAL tidak boleh melebihi Tanggal AKHIR.");
                        return false;
                }
                if (end_date > current_date) {
                        alert("Tanggal AKHIR tidak boleh melebihi tanggal hari ini.");
                        return false;
                }

                if(start_mon != end_mon){
                        alert("BULAN AWAL dan BULAN AKHIR harus sama.");
                        return false;
                }else{
                        if(start_year != end_year){
                                alert("TAHUN AWAL dan TAHUN AKHIR harus sama.");
                                return false;
                        }
                }

                if (diff > 30) {
                        alert("Selisih Tanggal AWAL dan Tanggal AKHIR tidak boleh melebihi 1 bulan");
                        return false;
                }
        } else{
                if((select_month >  '0808' && select_year == '2019') ||  select_year > '2019'){
                        alert("Periode Bulan Tidak Valid");
                        return false;
                }
        }

        form.FROM_DATE.value = start_year+"-"+start_mon+"-"+start_day;
        form.TO_DATE.value = end_year+"-"+end_mon+"-"+end_day;

        return true;
}

function submitForm()
{
        if(submitting) {
                alert('Transaksi sedang diproses.\nHarap tunggu.');
                document.getElementById('frm1').submitButton.disabled = true;
                return false;
        } else if(checkForm(document.getElementById('frm1'))) {
                submitting = true;
        showLoading();
                document.getElementById('download').value = "";
                document.getElementById('frm1').submit();
                return true;
        } else {
                return false;
        }
}

function download2()
{
        if(submitting) {
                alert('Transaksi sedang diproses.\nHarap tunggu.');
                document.getElementById('frm1').submitButton.disabled = true;
                return false;
        } else if(checkForm(document.getElementById('frm1'))) {
                document.getElementById('download').value = "download";
                document.getElementById('frm1').submit();
                return true;
        } else {
                return false;
        }
}



function getScreenWidthSaldo(){
    var width = window.parent.innerWidth || parent.document.documentElement.clientWidth || parent.document.body.clientWidth;
    if (width <= 500){
        window.parent.scroll(0,parent.document.body.scrollHeight);
        showLoading();
        changeDescription();
        removeLoading();
    }
}
//-->
</script>

<script language="JavaScript">
<!--
$(function() {
        $("#buttonPrint").click( function() {
                $('#divToPrint').jqprint({ operaSupport: true });
                return false;
        });
 });
 -->
</script>
</head>
<body onload="getScreenWidthSaldo();">
        <div class="form-wrap" id="form-wrap" >
                <form action="https://ib.bri.co.id/ib-bri/Br11600d.html" method="post" accept-charset="utf-8" name="AccountStatement" id="frm1" class="form" target="content"><div style="display:none">
<input type="hidden" name="csrf_token_newib" value="2cfc50c008853152096d2fb98339437e" />
</div>

                        <div class="breadcrumbz"><b>Rekening >> Informasi Saldo &amp; Mutasi >> </b>Mutasi Rekening</div>
                        <h2>Mutasi Rekening</h2>
                        <div class="flatwrap">
                                <div class="flatwrap-head" style="margin-bottom: 1px;">
                                        <div class="icon-pagelines">
                                        </div>
                                        <h4>
                                                Form Pencarian Mutasi Rekening
                                        </h4>
                                        <div class="flatwrap-control">
                                                <div class="pointerDown"></div>
                                        </div>
                                </div>
                                <div style="display:none;" id="frm1hidden">
                                        <input name="FROM_DATE" id="FROM_DATE" value="" type="hidden">
                                        <input name="TO_DATE" id="TO_DATE" value="" type="hidden">
                                        <input name="download" id="download" value="" type="hidden">
                    <input name="data-lenght" id="data-lenght" value=4 >
                                </div>

                                <div class="leftform" style="width:99%;border-right: none; margin-top: 0px; margin-bottom: 0px; padding-bottom: 0px;">
                                        <hr class="faded" style="margin-top:10px"/>
                                        <table cellpadding="2" style="width: 98%; margin-top: 0px; margin-bottom :10px;">
                                                <tr>
                                                        <td class="label">Dari Rekening</td>
                                                        <td class="label" colspan="3">
                                                                <select name="ACCOUNT_NO" id="ACCOUNT_NO" class="selection-box">
                                                                        <option value="">- Pilih Salah Satu -</option><option value="125701004085509">125701004085509  ( BritAma / IDR )</option><option selected='selected' value="021601049220501">021601049220501  ( Britama / IDR )</option>                                                              </select>
                                                        </td>
                                                </tr>

                                                <tr>
                                                        <td class="label">
                                                                <input name="VIEW_TYPE" id="VIEW_TYPE2" value="2" class="radio" type="radio" checked="checked" ><span class="radio-label">Periode Transaksi dari</span>
                                                        </td>
                                                        <td class="label">
                                                                <select name="DDAY1" class="selection-box" size="1" onfocus="document.getElementById('frm1').VIEW_TYPE[0].checked=true">
                                                                        <option value="01" >01</option><option value="02" >02</option><option value="03" >03</option><option value="04" >04</option><option value="05" >05</option><option value="06" >06</option><option value="07" selected="selected">07</option><option value="08" >08</option><option value="09" >09</option><option value="10" >10</option><option value="11" >11</option><option value="12" >12</option><option value="13" >13</option><option value="14" >14</option><option value="15" >15</option><option value="16" >16</option><option value="17" >17</option><option value="18" >18</option><option value="19" >19</option><option value="20" >20</option><option value="21" >21</option><option value="22" >22</option><option value="23" >23</option><option value="24" >24</option><option value="25" >25</option><option value="26" >26</option><option value="27" >27</option><option value="28" >28</option><option value="29" >29</option><option value="30" >30</option><option value="31" >31</option>
                                </select>
                                                                <select name="DMON1" class="selection-box" size="1" onfocus="document.getElementById('frm1').VIEW_TYPE[0].checked=true">
                                                                        <option value="01" >01</option><option value="02" >02</option><option value="03" >03</option><option value="04" >04</option><option value="05" >05</option><option value="06" >06</option><option value="07" >07</option><option value="08" selected="selected">08</option><option value="09" >09</option><option value="10" >10</option><option value="11" >11</option><option value="12" >12</option>                                                              </select>
                                                                <select name="DYEAR1" class="selection-box" size="1" onfocus="document.getElementById('frm1').VIEW_TYPE[0].checked=true">
                                                                        <option value="2019" selected="selected">2019</option><option value="2018" >2018</option><option value="2017" >2017</option><option value="2016" >2016</option><option value="2015" >2015</option><option value="2014" >2014</option><option value="2013" >2013</option><option value="2012" >2012</option><option value="2011" >2011</option><option value="2010" >2010</option><option value="2009" >2009</option>                                                         </select>
                                                        </td>
                                                        <td class="label">
                                                                Ke
                                                        </td>
                                                        <td class="label">
                                                                <select name="DDAY2" class="selection-box" size="1" onfocus="document.getElementById('frm1').VIEW_TYPE[0].checked=true">
                                                                        <option value="01" >01</option><option value="02" >02</option><option value="03" >03</option><option value="04" >04</option><option value="05" >05</option><option value="06" >06</option><option value="07" selected="selected">07</option><option value="08" >08</option><option value="09" >09</option><option value="10" >10</option><option value="11" >11</option><option value="12" >12</option><option value="13" >13</option><option value="14" >14</option><option value="15" >15</option><option value="16" >16</option><option value="17" >17</option><option value="18" >18</option><option value="19" >19</option><option value="20" >20</option><option value="21" >21</option><option value="22" >22</option><option value="23" >23</option><option value="24" >24</option><option value="25" >25</option><option value="26" >26</option><option value="27" >27</option><option value="28" >28</option><option value="29" >29</option><option value="30" >30</option><option value="31" >31</option>
                                </select>
                                                                <select name="DMON2" class="selection-box" size="1" onfocus="document.getElementById('frm1').VIEW_TYPE[0].checked=true">
                                                                        <option value="01" >01</option><option value="02" >02</option><option value="03" >03</option><option value="04" >04</option><option value="05" >05</option><option value="06" >06</option><option value="07" >07</option><option value="08" selected="selected">08</option><option value="09" >09</option><option value="10" >10</option><option value="11" >11</option><option value="12" >12</option>                                                              </select>
                                                                <select name="DYEAR2" class="selection-box" size="1" onfocus="document.getElementById('frm1').VIEW_TYPE[0].checked=true">
                                                                        <option value="2019" selected="selected">2019</option><option value="2018" >2018</option><option value="2017" >2017</option><option value="2016" >2016</option><option value="2015" >2015</option><option value="2014" >2014</option><option value="2013" >2013</option><option value="2012" >2012</option><option value="2011" >2011</option><option value="2010" >2010</option><option value="2009" >2009</option>                                                         </select>
                                                        </td>
                                                </tr>

                                                <tr>
                                                        <td class="label"><input name="VIEW_TYPE" id="VIEW_TYPE0" value="1" class="radio"  type="radio"><span class="radio-label">Periode Bulan</span></td>
                                                        <td class="label" colspan="3">
                                                        <select name="MONTH" id="month" class="selection-box" onfocus="document.getElementById('frm1').VIEW_TYPE[1].checked=true">
<option value="01">Jan</option>
<option value="02">Feb</option>
<option value="03">Mar</option>
<option value="04">Apr</option>
<option value="05">May</option>
<option value="06">Jun</option>
<option value="07">Jul</option>
<option value="08" selected="selected">Aug</option>
<option value="09">Sep</option>
<option value="10">Oct</option>
<option value="11">Nov</option>
<option value="12">Dec</option>
</select> - <select name="YEAR" id="year" class="selection-box" onfocus="document.getElementById('frm1').VIEW_TYPE[1].checked=true">
<option value="2019" selected="selected">2019</option>
<option value="2018">2018</option>
<option value="2017">2017</option>
<option value="2016">2016</option>
<option value="2015">2015</option>
<option value="2014">2014</option>
<option value="2013">2013</option>
<option value="2012">2012</option>
<option value="2011">2011</option>
<option value="2010">2010</option>
<option value="2009">2009</option>
</select>                                                       </td>
                                                </tr>

                                        </table>
                                </div>
                                <!--<div class="rightform">
                                        <h3>Helpful Information</h3>
                                        <p>Transfers made after 7 pm ET will be processed the next business day</p>
                                        <p>Transaction limit : <br /> Daily Limit Remaining : <br /> Monthly Limit Remaining : <br /> <a href="#">Learn More About Limits</a></p>

                                </div> -->
                                <div class="form-footer">
                                        <div style="margin: 0 auto; height: 25px; width: 83%; margin-top: 13px;">
                                                <input value="Tampilkan" name="submitButton" onclick="return submitForm()" type="submit">
                                                <input value="Reset" name="resetButton" type="reset" class="reset">
                                                <!-- <input value="Download" class="button" name="submitDownload" onclick="download2()" type="button"> -->
                                        </div>
                                </div>
                        </div>




                        <div id="divToPrint">
                                <div class="flatwrap">
                                        <div class="flatwrap-head" style="margin-bottom: 1px;">
                                                <div class="icon-pagelines">
                                                </div>
                                                <h4 style="margin-top: 7px">
                                                        Rincian Rekening Koran
                                                </h4>
                                                <div class="flatwrap-control">
                                                        <div class="pointerDown"></div>
                                                </div>
                                        </div>
                                                <table class="info1 rekkor" style="margin: 0 auto; margin-bottom: 5px; padding-left: 0px;">
                                                        <tr>
                                                                <td>Yth. Bapak/Ibu</td>
                                                                <td>MUH.SHAMAD</td>
                                                        </tr>
                                                        <tr>
                                                                <td>No. Rekening</td>
                                                                <td>&nbsp;021601049220501</td>
                                                        </tr>
                                                        <tr>
                                                                <td>Mata Uang</td>
                                                                <td>IDR</td>
                                                        </tr>
                                                        <tr>
                                                                <td>Periode</td>
                                                                <td>
                                                                        07-Aug-2019 s.d 07-Aug-2019
                        </td>
                                                        </tr>
                                                        <tr>
                                                                <td>Tertanggal</td>
                                                                <td>07/08/2019</td>
                                                        </tr>
                                                </table>
                                                <hr class="faded"/>

                    <div onload="removeLoading();" class="rekkor-box">
                                                <table id="tabel-saldo" class="box" style="width: 97%; margin: 0 auto;">
                                                        <thead style="background-color: #f9f0c7">
                                                                <tr>
                                                                        <th style="text-align: left;">tanggal</th>
                                                                        <th style="text-align: left;">transaksi</th>
                                                                        <th style="text-align: right;">debet</th>
                                                                        <th style="text-align: right;">kredit</th>
                                                                        <th style="text-align: right;">Saldo</th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                <tr>
                                                                        <td>&nbsp;</td>
                                                                        <td class="fieldText">Saldo Awal</td>
                                                                        <td>&nbsp;</td>
                                                                        <td>&nbsp;</td>
                                                                        <td class="fieldValue" align="right">73.769,00</td>
                                                                </tr>


                                                                <tr>
                                                                        <td style="text-align: left;">07/08/19</td>
                                                                        <td id=desc-1 style="text-align: left;"> 082311897547|6SMS|30/07/2019-01/08/2019</br></td>

                <td style="text-align: right;">3.000,00</td>

                                                                                        <td style="text-align: right"></td>

                <td style="text-align: right;">70.769,00</td>

                                                                </tr>



                                                                <tr>
                                                                        <td style="text-align: left;">07/08/19</td>
                                                                        <td id=desc-2 style="text-align: left;"> SPAN:        :191561301003586000014</br></td>

                <td></td>

                                                                                        <td style="text-align: right;">3.818.639,00</td>

                <td style="text-align: right;">3.889.408,00</td>

                                                                </tr>


                                                                <tr>
                                                                        <td>&nbsp;</td>
                                                                        <td class="fieldText">Total Mutasi</td>
                                                                        <td class="fieldValue" align="right" valign="top">&nbsp;&nbsp;
                                                                                3.000,00
                        </td>
                                                                        <td class="fieldValue" align="right" valign="top">&nbsp;&nbsp;
                                                                                3.818.639,00
                        </td>
                                                                        <td class="fieldValue" align="right">&nbsp;</td>
                                                                </tr>

                                                                <tr>
                                                                        <td>&nbsp;</td>
                                                                        <td class="fieldText" valign="top">Saldo Akhir</td>
                                                                        <td>&nbsp;</td>
                                                                        <td>&nbsp;</td>
                                                                        <td class="fieldValue" align="right" valign="top">&nbsp;&nbsp;
                                                                                3.889.408,00
                        </td>
                                                                </tr>
                                                                <!-- <tr>
                                                                        <td colspan="5" style="text-align: center; font-size: 11px; color: gray;">
                                                                                LOAD MORE +
                                                                        </td>
                                                                </tr> -->

                                                        </tbody>
                                                </table>
                                                <p>
                                                        <b>&nbsp;&nbsp; Catatan :</b>
                                                </p>
                                                <ul>
                                                        <li>Data mutasi rekening ini adalah posisi data ER</li>

                                                </ul>
                    </div>

                                        <div class="form-footer">
                                                <div class="buttons">
                                                        <input name="Back" value="Kembali" onclick="history.back()" class="reset" type="button">
                                                        <input name="Close" value="Tutup" onclick="document.location='defaultpg/default_page'" class="reset" type="button">
                                                        <input class="button" name="Print" value="Cetak" id="buttonPrint" type="button">
                                                </div>
                                        </div>
                                </div>
                        </div>
                </form>
        </div>
</body>
</html>`

const $ = cheerio.load(this._loginDom);

console.log($('#tabel-saldo').html());