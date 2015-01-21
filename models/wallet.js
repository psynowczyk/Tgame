var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var walletSchema = mongoose.Schema({
      'owner': String,
      'value': Number
});

module.exports = mongoose.model('Wallet', walletSchema);