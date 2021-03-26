var FacilityPayment = require('../models/facility_payment');
var Facility = require('../models/facility');
var User = require('../models/user');
var OrderItem = require('../models/order_item');
var mongoose = require('mongoose');
var VerfiyActions = require('../auth/verifyActions');
var errMsg = require('../config/errorMsg');
var PassPackage = require('../models/pass_package');
var PassPayment = require('../models/pass_payment');
var bcrypt = require('bcrypt');

var funcions = {
    changePassword:function(req,res){
      VerfiyActions.verify(req,res).then(
        object_id=>{

          let modify_password = req.body.modify_password;

          let num = modify_password.search(/[0-9]/g);
          let eng = modify_password.search(/[a-z]/ig);
          let spe = modify_password.search(/['~!@@#$%^&*|\\\'\'';:\/?`]/gi);
          if(modify_password.length<8 || modify_password.length>20){
            //this.sCheckPwd = "패스워드를 8~20자 이내로 입력하세요.";
            res.status(403).send({success: false, msg: errMsg.auth});
          }
          else if(modify_password.search(/\s/) != -1){
            //this.sCheckPwd = "패스워드는 공뱁없이 입력하세요";
            res.status(403).send({success: false, msg: errMsg.auth});
          }
          else if(num < 0 || eng<0 || spe <0){
            //this.sCheckPwd = "패스워드는 영문,숫자,특수문자 혼합으로 이루어져야 합니다.";
            res.status(403).send({success: false, msg: errMsg.auth});
          }
          else{
            //this.sCheckPwd = "사용가능한 패스워드 입니다.";
            console.log(req.body);
            let ObjectId = require('mongoose').Types.ObjectId;
            User.findOne({_id:ObjectId(object_id)})
            .exec(function(err,user){
              console.log(user);
              user.comparePassword(req.body.current_password, function(err, isMatch){
                  if(isMatch && !err) {
                    console.log("match");
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(req.body.modify_password, salt, function (err, hash) {
                            User.update({_id:ObjectId(object_id)},{$set:{password:hash}})
                            .exec(function(err){
                              if(err) res.status(403).send({success: false, msg: errMsg.auth});
                              else{
                                res.json({success: true});
                              }
                            })
                        })
                    })
                  } else {
                      console.log("no_match");
                      res.status(403).send({success: false, msg: errMsg.auth});
                  }
              })
            })
          }
        }
      )
    },
    get_my_payment:function(req,res){
      VerfiyActions.verify(req,res).then(
        object_id=>{
          let ObjectId = require('mongoose').Types.ObjectId;
          PassPayment.find({object_u_id:ObjectId(object_id)})
          .populate('pass_package_id')
          .exec(function(err, pass_payment){
            if(err) res.status(403).json({success: false, status: errMsg.logic});
            else{
              res.json(pass_payment);
            }
          })
        }
      )
    },
    enrolProfileImage:function(req,res){
      VerfiyActions.verify(req,res).then(
        object_id=>{
          console.log("hi");
          let ObjectId = require('mongoose').Types.ObjectId;
          User.update({_id:ObjectId(object_id)},{$set:{photo:req.body.image}})
          .exec(function(err){
              if(err) res.status(403).json({success: false, status: errMsg.logic});
              else{
                res.json({success: true});
              }
          })
        }
      )
    },

    my_use : function (req,res){
      VerfiyActions.verify(req,res).then(
        object_id=>{
          let ObjectId = require('mongoose').Types.ObjectId;
          FacilityPayment.find({object_u_id:ObjectId(object_id)})
          .populate({
             path:'order_id_list',
             match: { use_count:{ $gt: 0}}
           })
          .populate('f_id','bname')
          .exec(function(err, order_item){
            console.log(order_item);
            res.json(order_item);
          })
      })
    },
    get_my_book : function (req,res) {
      VerfiyActions.verify(req,res).then(
        object_id => {
          let ObjectId = require('mongoose').Types.ObjectId;
          FacilityPayment.find({"object_u_id": ObjectId(object_id)})
          .sort({date:-1})
          .exec(function (err, facility_payment) {
            let order_id_list = [];
            let fac_id_list = [];
            for(let i=0;i<facility_payment.length;i++){
              order_id_list = order_id_list.concat(facility_payment[i].order_id_list);
              fac_id_list.push(facility_payment[i].f_id);
            }
            console.log(order_id_list);
            OrderItem.find({_id:{$in:order_id_list.map(function(o){ return mongoose.Types.ObjectId(o);})},count:{$gte:1}})
            .exec(function(err, order_item){
              if(err||!order_item) res.status(403).json({success: false, status: errMsg.logic});
              else{
                Facility.find({_id:{$in:fac_id_list.map(function(o){ return mongoose.Types.ObjectId(o);})}},{picture: false, item_id_list:false, context:false})
                .exec(function(err, facility){
                  if(err||!facility) res.status(403).json({success: false, status: errMsg.logic});
                  else{
                    facility_payment.push(order_item);
                    facility_payment.push(facility);
                    res.json(facility_payment);
                  }
                });
              }
            });
          });
        }
        ,err => {
          res.status(403).json({success: false, msg: 'auth logic fail'}); //인증 로직 에러
        }
      );
    },
    get_my_profile : function (req,res) {
      let ObjectId = require('mongoose').Types.ObjectId;
      VerfiyActions.verify(req,res).then(
        object_id=>{
          User.findOne(ObjectId(object_id),{password:false})
          .exec(function (err, user) {
            //console.log(user)
            if(err || !user){
              res.status(403).json({success: false, msg: 'auth logic fail'}); //인증 로직 에러
            }else{
              res.json(user);
            }
          })
        },
        err=>{
          console.log("err");
          res.status(403).json({success: false, msg: 'auth logic fail'}); //인증 로직 에러
        }
      ).catch(function(err){
        console.log("err"+err)
        res.status(403).json({success: false, msg: 'auth logic fail'});
    })
  },
  refresh_pass : function (req,res) {
    let ObjectId = require('mongoose').Types.ObjectId;
    VerfiyActions.verify(req,res).then(
      object_id=>{
        User.findOne(ObjectId(object_id),{"pass":true})
        .exec(function (err, user) {
          //console.log(user)
          if(err || !user){
            res.status(403).json({success: false, msg: 'auth logic fail'}); //인증 로직 에러
          }
          res.json(user);
        })
      },
      err=>{
        console.log("err");
        res.status(403).json({success: false, msg: 'auth logic fail'}); //인증 로직 에러
      }
    ).catch(function(err){
      console.log("err"+err)
      res.status(403).json({success: false, msg: 'auth logic fail'});
    })
  },

  get_my_use_history : function (req,res) {
    let ObjectId = require('mongoose').Types.ObjectId;
    VerfiyActions.verify(req,res).then(
      object_id=>{
        UseFacilityHistory.find({"object_u_id":ObjectId(object_id)})
        .exec(function(err, userFacHis){
          Facility.find({"f_id":userFacHis.f_id},{"banme":true})
          .exec(function(err, fac){
            let send_data = JSON.stringify(userFacHis);
            send_data = JSON.parse(send_data);
            send_data.push(fac);
            res.json(send_data);
          })
        })
      }
    ).catch(function(err){
      console.log("err"+err)
      res.status(403).json({success: false, msg: 'auth logic fail'});
    })
  }

}

module.exports = funcions;
