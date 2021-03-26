var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var point_get = new Schema({	//결제정보
  date:String,
  point:Number
});

module.exports = mongoose.model('point_get', point_get); //콜렉션 명
