var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var order_item = new Schema({	//결제정보
  item_id:Schema.Types.ObjectId,
  object_u_id:Schema.Types.ObjectId,
  f_id:Schema.Types.ObjectId,
  item_name:String,
  count:Number, //현재 보유 수량
  pass_payment:Number,
  use_count:Number, //사용 수량
  use:Boolean, //사용 가능 여부
  cancel_date:[{
    date:String,
    count:Number
  }],
  use_date:[{
    date:String,
    time:String,
    count:Number
  }]
});

module.exports = mongoose.model('order_item', order_item); //콜렉션 명
