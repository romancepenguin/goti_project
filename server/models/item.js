var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  _id: Schema.Types.ObjectId,
  item_name:String,
  pass:Number,
  enrol_date:String,
  enrol_time:String,
  active:Boolean,
  f_id:Schema.Types.ObjectId
});

module.exports = mongoose.model('Item', itemSchema);
