var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MutasiSchema = new Schema({
    "tgl": Date,
    "nama_trx": String,
    "trf_masuk": Number,
    "trf_keluar": Number,
    "saldo_saat_ini": Number

}, { collection: 'mutasi' });

module.exports = mongoose.model('Mutasi', MutasiSchema);