var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var point_use = new Schema({	//결제정보
  date:String,
  point:Number,
  pass:Number //교환한 pass 개수
});

module.exports = mongoose.model('point_use', point_use); //콜렉션 명
