var mongoose = require('mongoose');

var costSchema = mongoose.Schema({
      'id': {type: Number, default: 1},
      'gold_mine': {
         'cash': {type: Number, default: 30},
         'oil': {type: Number, default: 10},
         'gas': {type: Number, default: 10},
         'metal': {type: Number, default: 10}
      },
      'metal_mine': {
         'cash': {type: Number, default: 10},
         'oil': {type: Number, default: 10},
         'gas': {type: Number, default: 10},
         'metal': {type: Number, default: 30}
      },
      'oil_rig': {
         'cash': {type: Number, default: 10},
         'oil': {type: Number, default: 30},
         'gas': {type: Number, default: 10},
         'metal': {type: Number, default: 10}
      },
      'gas_rig': {
         'cash': {type: Number, default: 10},
         'oil': {type: Number, default: 10},
         'gas': {type: Number, default: 30},
         'metal': {type: Number, default: 10}
      },
      'observatory': {
         'cash': {type: Number, default: 50},
         'oil': {type: Number, default: 50},
         'gas': {type: Number, default: 50},
         'metal': {type: Number, default: 50}
      }
});

module.exports = mongoose.model('Cost', costSchema);