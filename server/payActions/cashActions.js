var FacilityPayment = require('../models/facility_payment');
var User = require('../models/user');
var PassPackage = require('../models/pass_package');
var PassPayment = require('../models/pass_payment');

var checkToken = require('../auth/verifyActions'); //토큰 검증용
var errMsg = require('../config/errorMsg');
var mongoose = require('mongoose');
var time = require('date-utils');

var Iamport = require('iamport');
var iamport = new Iamport({
  impKey: 'xxx',
  impSecret: 'xxx'
});

var funcions = {
    cashEnergy: function (req,res) {
      checkToken.verify(req,res).then(
      object_id=>{
        let ObjectId = require('mongoose').Types.ObjectId;
        console.log(req.body.u_id);
        iamport.payment.getByImpUid({
          imp_uid: req.body.u_id
        }).then(result=>{
          if(result.status != "paid") res.status(403).json({success: false, status:errMsg.logic});
          PassPayment.findOne({apply_num:result.apply_num}) //재전송 방지
          .exec(function(err, check){
            if(err||check) res.status(403).json({success: false, status:errMsg.logic});
            else{
              PassPackage.findOne({price:result.amount})
              .exec(function(err, package_){
                let date = new Date();
                let newPayment = new PassPayment({
                  object_u_id: object_id,
                  pass_package_id: package_._id,
                  date: date.toFormat('YYYY-MM-DD'),
                  time: date.toFormat('HH24:MI:SS'),
                  cancel: false,
                  apply_num: result.apply_num
                })
                newPayment.save(function(err){
                  if(err) res.status(403).json({success: false, status:errMsg.logic});
                  else{
                    User.update({_id:ObjectId(object_id)},{$inc:{pass:package_.pass_value}})
                    .exec(function(err){
                      if(err) res.status(403).json({success: false, status:errMsg.logic});
                      else{
                        res.json({success:true});
                      }
                    })
                  }
                })
              })
            }
          })
        }).catch(err=>{
          console.log(err);
          res.status(403).json({success: false, status:errMsg.logic});
        });
      })
    },
    packageInfo: function (req,res){
      checkToken.verify(req,res).then(
        object_id=>{
          PassPackage.find()
          .exec(function(err,pass_package){
            if(err) res.status(403).json({success: false, status:errMsg.logic});
            else res.json(pass_package);
          })
        },
        err=>{
          console.log(err);
          res.status(403).json({success: false, status:errMsg.auth});
        }
      )
    }
}

module.exports = funcions;
