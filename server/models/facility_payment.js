var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facility_payment = new Schema({	//결제정보
	date:String,
	time:String,
	object_u_id:{
		type: Schema.Types.ObjectId,
		ref:'User'
	},
	f_id:{
		type: Schema.Types.ObjectId,
		ref:'Facility'
	},
	order_id_list:[{
		type:Schema.Types.ObjectId,
		ref:'order_item'
	}]
},{ collection: 'facility_payment' });

module.exports = mongoose.model('facility_payment', facility_payment); //콜렉션 명
