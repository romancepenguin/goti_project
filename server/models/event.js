var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  banner:String,
  start_date:String,
  end_date:String,
  enrol_date:String,
  event_name:String,
  event_picture:String
});

module.exports = mongoose.model('Event', eventSchema);
