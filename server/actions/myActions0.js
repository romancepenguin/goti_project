var FacilityPayment = require('../models/facility_payment');
var VerfiyActions = require('../auth/verifyActions');
var Facility = require('../models/facility');
var User = require('../models/user');

var funcions = {
    get_my_book : function (req,res) {
      checkToken.verify(req,res).then(
        object_id => {
          //let ObjectId = require('mongoose').Types.ObjectId;
          //console.log(object_id)
          FacilityPayment.find({"object_u_id": object_id})
          .exec(
            function (err, facility_payment) {
              if(err) res.status(403).json({success: false, msg: 'error server'});
              if(!facility_payment){
                  res.status(403).json({success: false, msg: 'cat\'t find facility_payment'});
              }
              else{
                //console.log(facility_payment)
                //console.log("");
                function get_fac_info(facility_payment){
                  let res_array = [];
                  return new Promise(function(resolve, reject){
                    for(i=0;i<facility_payment.length;i++){
                        for(j=0;j<facility_payment[i].buy_list.length;j++){
                          //let tmp = facility_payment[i].buy_list[j];
                          let check = false;
                          for(p=0;p<res_array.length;p++){
                            if(res_array[p] == facility_payment[i].buy_list[j].f_id){
                              check = true;
                              break;
                            }
                          }
                          if(check == false){
                            res_array.push(facility_payment[i].buy_list[j].f_id);
                          }
                        }
                    }
                    resolve(res_array);
                  });
                }
                get_fac_info(facility_payment)
                .then(fac=>{
                  Facility.find({"f_id":fac},{"f_id":true,"bname":true,"banner":true,"weekday":true,"weekend":true,"items":true})
                  .exec(function(err, facility){
                    let send_data = JSON.stringify(facility_payment);
                    send_data = JSON.parse(send_data);
                    send_data.push(facility);
                    console.log(send_data)
                    res.json(send_data);
                  });
                });
                //console.log(facility_payment[0].buy_list[0].bname)
              }
            }
          )
        }
        ,err => {
          res.status(403).json({success: false, msg: 'auth logic fail'}); //인증 로직 에러
        }
      );
    },
    get_my_profile : function (req,res) {
      let ObjectId = require('mongoose').Types.ObjectId;
      checkToken.verify(req,res).then(
        object_id=>{
          User.findOne(ObjectId(object_id),{"name":true,"pass":true,"photo":true})
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
  refresh_pass : function (req,res) {
    let ObjectId = require('mongoose').Types.ObjectId;
    checkToken.verify(req,res).then(
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
    checkToken.verify(req,res).then(
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
