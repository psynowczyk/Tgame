var mongoose = require('mongoose');

var walletSchema = mongoose.Schema({
      'owner': mongoose.Schema.Types.ObjectId,
      'cash': {type: Number, default: 100},
      'oil': {type: Number, default: 100},
      'gas': {type: Number, default: 100},
      'metal': {type: Number, default: 100}
});

module.exports = mongoose.model('Wallet', walletSchema);