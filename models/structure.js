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
      	'observatory': {type: Number, default: 1},
      	'laboratory': {type: Number, default: 1}
      },
      'defense':{
            'missile_shield': {type: Number, default: 0},
            'force_shield': {type: Number, default: 0},
            'weapon_laser': {type: Number, default: 0},
            'rockets': {type: Number, default: 0},
            'plasma': {type: Number, default: 0}


      }

});

module.exports = mongoose.model('Structure', structureSchema);