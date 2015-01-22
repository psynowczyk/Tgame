var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var walletSchema = mongoose.Schema({
      'owner': mongoose.Schema.Types.ObjectId,
      'value': {type: Number, default: 10000}
});

module.exports = mongoose.model('Wallet', walletSchema);