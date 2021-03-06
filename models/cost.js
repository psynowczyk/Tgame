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
      },
      'missile': {
         'cash': {type: Number, default: 100},
         'oil': {type: Number, default: 100},
         'gas': {type: Number, default: 100},
         'metal': {type: Number, default: 100}
      },
       'heavy_missile': {
         'cash': {type: Number, default: 1000},
         'oil': {type: Number, default: 1000},
         'gas': {type: Number, default: 1000},
         'metal': {type: Number, default: 1000}
      },
       'antimatter': {
         'cash': {type: Number, default: 30000},
         'oil': {type: Number, default: 30000},
         'gas': {type: Number, default: 30000},
         'metal': {type: Number, default: 30000}
      },
      'missile_shield': {
         'cash': {type: Number, default: 150},
         'oil': {type: Number, default: 10},
         'gas': {type: Number, default: 10},
         'metal': {type: Number, default: 500}
      },
      'force_shield': {
         'cash': {type: Number, default: 1000},
         'oil': {type: Number, default: 10},
         'gas': {type: Number, default: 100},
         'metal': {type: Number, default: 500}
      },
      'weapon_laser': {
         'cash': {type: Number, default: 1500},
         'oil': {type: Number, default: 1000},
         'gas': {type: Number, default: 1000},
         'metal': {type: Number, default: 2000}
      },
      'rockets': {
         'cash': {type: Number, default: 1500},
         'oil': {type: Number, default: 100},
         'gas': {type: Number, default: 100},
         'metal': {type: Number, default: 5000}
      },
      'plasma': {
         'cash': {type: Number, default: 2000},
         'oil': {type: Number, default: 1000},
         'gas': {type: Number, default: 1000},
         'metal': {type: Number, default: 1000}
      },
      'laboratory': {
         'cash': {type: Number, default: 20000},
         'oil': {type: Number, default: 10000},
         'gas': {type: Number, default: 5000},
         'metal': {type: Number, default: 10000}
      }
});

module.exports = mongoose.model('Cost', costSchema);