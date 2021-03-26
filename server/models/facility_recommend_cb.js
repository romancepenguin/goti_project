var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facility_recommend_cb = new Schema({	//결제정보
  object_u_id:String,
	recommendations:[]
},{ collection: 'facility_recommend_cb' });

module.exports = mongoose.model('facility_recommend_cb', facility_recommend_cb); //콜렉션 명
