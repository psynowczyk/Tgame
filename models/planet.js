var mongoose = require('mongoose');

var planetSchema = mongoose.Schema({
      'owner': mongoose.Schema.Types.ObjectId,
      'image': String,
      'coordinates': {
      	'x': Number,
      	'y': Number
      }
});

module.exports = mongoose.model('Planet', planetSchema);