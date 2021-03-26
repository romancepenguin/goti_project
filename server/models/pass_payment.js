var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pass_payment = new Schema({	//결제정보
	object_u_id:Schema.Types.ObjectId,
	pass_package_id:{
		type:Schema.Types.ObjectId,
		ref:'pass_package'
	},
	date:String,
	time:String,
	cancel:Boolean,
	cancel_date:String,
	apply_num:Number
},{ collection: 'pass_payment' });

module.exports = mongoose.model('pass_payment', pass_payment); //콜렉션 명
/*
{ "_id" : ObjectId("59f75b34a5ab0aa431c134bf") }
{ "_id" : ObjectId("59f75b34a5ab0aa431c134c0") }
{ "_id" : ObjectId("59f75b34a5ab0aa431c134c1") }
{ "_id" : ObjectId("59f75b34a5ab0aa431c134c2") }
{ "_id" : ObjectId("59f75b35a5ab0aa431c134c3") }
*/

/*
db.pass_payment.insert({apply_num:"10054",cancel:false,time:"10:10",date:"2017-05-05",object_u_id:ObjectId("59f62d64461ef26217a3be88"),pass_package_id:ObjectId("59f75b34a5ab0aa431c134bf")})
db.pass_payment.insert({apply_num:"10054",cancel:false,time:"12:10",date:"2017-05-05",object_u_id:ObjectId("59f62d64461ef26217a3be88"),pass_package_id:ObjectId("59f75b34a5ab0aa431c134bf")})
db.pass_payment.insert({apply_num:"10054",cancel:false,time:"10:10",date:"2017-05-07",object_u_id:ObjectId("59f62d64461ef26217a3be88"),pass_package_id:ObjectId("59f75b35a5ab0aa431c134c3")})
*/
