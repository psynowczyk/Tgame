var mongoose = require('mongoose');

var notificationSchema = mongoose.Schema({
      'owner': mongoose.Schema.Types.ObjectId,
      'text': String
});

module.exports = mongoose.model('Notification', notificationSchema);