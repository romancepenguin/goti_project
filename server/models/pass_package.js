var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pass_package = new Schema({	//결제정보
	pass_value:Number,
	enrol_date:String,
	package_name:String,
	price:Number
},{ collection: 'pass_package' });

module.exports = mongoose.model('pass_package', pass_package); //콜렉션 명

/*
pg : 'inicis', // version 1.1.0부터 지원.
pay_method : 'card',
merchant_uid : 'merchant_' + new Date().getTime(),
name : '주문명:결제테스트',
amount : 10000000,
buyer_email : 'iamport@siot.do',
buyer_name : '구매자이름',
buyer_tel : '010-1234-5678',
buyer_addr : '서울특별시 강남구 삼성동',
buyer_postcode : '123-456',
*/
/*
db.pass_package.insert({pass_value:10,enrol_date:"2017-05-05",package_name:"10패키지",price:9800})
db.pass_package.insert({pass_value:22,enrol_date:"2017-05-05",package_name:"22패키지",price:19800})
db.pass_package.insert({pass_value:33,enrol_date:"2017-05-05",package_name:"33패키지",price:29800})
db.pass_package.insert({pass_value:55,enrol_date:"2017-05-05",package_name:"55패키지",price:49800})
db.pass_package.insert({pass_value:133,enrol_date:"2017-05-05",package_name:"133패키지",price:89800})
*/
