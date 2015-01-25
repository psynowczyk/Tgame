var mongoose = require('mongoose');

var structureSchema = mongoose.Schema({
      'owner': mongoose.Schema.Types.ObjectId,
      'income': {
      	'gold_mine': {type: Number, default: 1},
      	'oil_rig': {type: Number, default: 1},
      	'gas_rig': {type: Number, default: 1},
      	'metal_mine': {type: Number, default: 1}
      },
      'technology': {
      	'observatory': {type: Number, default: 0},
      	'laboratory': {type: Number, default: 0}
      }
});

module.exports = mongoose.model('Structure', structureSchema);