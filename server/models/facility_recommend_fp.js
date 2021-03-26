var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facility_recommend_fp = new Schema({	//결제정보
	antecedent:String,
  consequent:[]
},{ collection: 'facility_recommend_fp' });

module.exports = mongoose.model('facility_recommend_fp', facility_recommend_fp); //콜렉션 명
