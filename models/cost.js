var mongoose = require('mongoose');

var costSchema = mongoose.Schema({
      'id': {type: Number, default: 1},
      'gold_mine': {
         'cash': {type: Number, default: 3000},
         'oil': {type: Number, default: 900},
         'gas': {type: Number, default: 900},
         'metal': {type: Number, default: 900},
      },
      'metal_mine': {
         'cash': {type: Number, default: 600},
         'oil': {type: Number, default: 600},
         'gas': {type: Number, default: 600},
         'metal': {type: Number, default: 2700},
      },
      'oil_rig': {
         'cash': {type: Number, default: 1200},
         'oil': {type: Number, default: 3000},
         'gas': {type: Number, default: 1200},
         'metal': {type: Number, default: 1200},
      },
      'gas_rig': {
         'cash': {type: Number, default: 1200},
         'oil': {type: Number, default: 1200},
         'gas': {type: Number, default: 3000},
         'metal': {type: Number, default: 1200},
      }
});

module.exports = mongoose.model('Cost', costSchema);