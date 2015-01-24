var mongoose = require('mongoose');

var planetSchema = mongoose.Schema({
      'owner': mongoose.Schema.Types.ObjectId,
      'image': String,
      'coordinates': [Number]
});

module.exports = mongoose.model('Planet', planetSchema);