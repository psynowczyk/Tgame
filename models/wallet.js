var mongoose = require('mongoose');

var walletSchema = mongoose.Schema({
      'owner': mongoose.Schema.Types.ObjectId,
      'cash': {type: Number, default: 10000000},
      'oil': {type: Number, default: 10000000},
      'gas': {type: Number, default: 10000000},
      'metal': {type: Number, default: 10000000}
});

module.exports = mongoose.model('Wallet', walletSchema);