var FacilityPayment = require('../models/facility_payment');
var OrderItem = require('../models/order_item');
var User = require('../models/user');
var checkToken = require('../auth/verifyActions'); //토큰 검증용
var errMsg = require('../config/errorMsg');
var mongoose = require('mongoose');
var time = require('date-utils');

var funcions = {
    facility_payment_buy : function (req,res) { //시설 종목 구매
      checkToken.verify(req,res).then(
        object_id=>{
          let ObjectId = require('mongoose').Types.ObjectId;
          User.findOne(ObjectId(object_id))
          .exec(function(err, user){
            if(err||!user) res.status(403).json({success: false, status:errMsg.auth});
            let total_pass = 0;
            req.body.buy_list.forEach(function (item, index, array) { //가격 총합 계산
              total_pass += item.count * item.pass;
            });

            /*pass구매 가능 여부 체크*/
            if( user.pass < total_pass || user.pass == 0 ){
              res.status(403).json({success: false, msg: errMsg.passLeak});
            }

            /*사용자 패스 업데이트*/
            let update_pass = user.pass-total_pass;
            User.update({"_id":ObjectId(object_id)}, { $set: { "pass":  update_pass} })
            .exec(function(err){
              if(err) res.status(403).json({success: false, msg: errMsg.logic});

              /*시설 구매 기록 저장*/
              let date = new Date();
              let order_id_list = [];
              let order_item_list = [];
              let tmp_order_item;

              for(let i=0;i<req.body.buy_list.length;i++){
                /*order item 리스트 */
                tmp_order_item = {}
                tmp_order_item._id = new mongoose.Types.ObjectId;
                order_id_list.push(tmp_order_item._id); //facility_payment order_id_list에 들어 갈 속성
                tmp_order_item.item_id = req.body.buy_list[i].item_id
                tmp_order_item.item_name = req.body.buy_list[i].item_name
                tmp_order_item.object_u_id = ObjectId(object_id)
                tmp_order_item.f_id = req.body.f_id
                tmp_order_item.count = req.body.buy_list[i].count
                tmp_order_item.pass_payment = req.body.buy_list[i].count*req.body.buy_list[i].pass
                tmp_order_item.use_count = 0
                tmp_order_item.use = true
                tmp_order_item.cancel = false
                tmp_order_item.cancel_date = ""
                tmp_order_item.use_date = []

                order_item_list.push(tmp_order_item)
              }
              let facility_payment = new FacilityPayment({
                date:date.toFormat('YYYY-MM-DD'),
                time:date.toFormat('HH24:MI:SS'),
                object_u_id:ObjectId(object_id),
                f_id:ObjectId(req.body.f_id),
                order_id_list:order_id_list
              });
              console.log(facility_payment);
              facility_payment.save(function(err){
                if(err) res.status(403).json({success: false, msg: errMsg.logic});
                else{
                console.log(order_item_list);
                  OrderItem.create(order_item_list,function(err){
                    if (err)res.status(403).json({success: false, msg: errMsg.logic});
                    else{
                      res.json({success:true});
                    }
                  })
                }
              })
            })
          })
        },
        err=>{
          res.status(403).json({success: false, status:errMsg.auth});
        }
      )
    },

    cancel_item : function (req,res) {
      checkToken.verify(req).then(
        object_id=>{
          console.log(req.body);
          let ObjectId = require('mongoose').Types.ObjectId;
          OrderItem.findOne({_id:ObjectId(req.body.order_id)})
          .exec(function(err, order_item){
            let date = new Date();
            console.log(order_item)
            if(order_item.count < req.body.count){ //현재 보유수량보다 취소할려는 수량이 많으면
              res.status(403).json({success: false, status:errMsg.excessPass});
            }else if(order_item.count == req.body.count){
              OrderItem.findByIdAndUpdate(ObjectId(req.body.order_id),
              {$set:{count:0,use:false},$push:{cancel_date:{date:date.toFormat('YYYY-MM-DD'),
                count:req.body.count}}})
              .exec(function(err){
                if(err){
                  res.status(403).json({success: false, status:errMsg.server});
                }else{
                  res.json({success:true});
                }
              })
            }else{
              let count = order_item.count - req.body.count;
              OrderItem.findByIdAndUpdate(ObjectId(req.body.order_id),
              {$set:{count:count},$push:{cancel_date:{date:date.toFormat('YYYY-MM-DD'),
                count:req.body.count}}})
              .exec(function(err){
                if(err){
                  res.status(403).json({success: false, status:errMsg.server});
                }else{
                  res.json({success:true});
                }
              })
            }
          })
      },
      err=>{
        res.status(403).json({success: false, status:errMsg.auth});
      }
    )},
}

module.exports = funcions;
