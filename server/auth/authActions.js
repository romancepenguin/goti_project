var User = require('../models/user');
var UserPushToken = require('../models/user_push');

var config = require('../config/database');
var errMsg = require('../config/errorMsg');
var jwt = require('jsonwebtoken');
var firebase = require("firebase"); //파이어 베이스 설치할 것
var auth = require('./verifyActions'); //토큰 체크후 분해 모듈
var time = require('date-utils');
var VerfiyActions = require('../auth/verifyActions');
var bcrypt = require('bcrypt');

var nodemailer = require('nodemailer');

var manager_email='romancepenguin@gmail.com';

var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: manager_email,
        clientId: 'xxx.apps.googleusercontent.com',
        clientSecret: 'xxx',
        refreshToken: '1/-ZcB7s7hMRE2bqH2d6IUWcP-t0Wd60erWO1aR0PSjN-33f6z0SWKjPqWkc_pIPgD',
        refreshToken: 'xxx',
        accessToken: 'xxx',
        expires: 3600
    }
});

firebase.initializeApp({
  apiKey: "xxx",
   authDomain: "xxx.firebaseapp.com",
   databaseURL: "https://xxx.firebaseio.com",
   projectId: "xxx",
   storageBucket: "xxx.appspot.com",
   messagingSenderId: "xxx"
});
/*구글에서 발급받은 firebase key*/

var timestamp = 60*60*24; //토큰 만료 기한
var initial_pass = 1000000; //초기 지급 패스

var functions = {
    registerToken:function(req, res){
      //console.log(req.body.token);
      VerfiyActions.verify(req,res).then(
        object_id=>{
          let date = new Date();
          let newUserPushToken = new UserPushToken({
            u_id:object_id,
            enrol_date:date.toFormat('YYYY-MM-DD'),
            token:req.body.token
          })
          newUserPushToken.save(function(err){
            if(err) res.status(403).send({success: false, msg: 'user false'});
            else{
              res.send(true);
            }
          })
        },
        err=>{
          res.status(403).send({success: false, msg: 'user false'});
        }
      )
    },
    findId: function(req, res){
      console.log(req.body)
      let mail = req.body.email+"@"+req.body.address;
      User.findOne({name:req.body.name, birthday:req.body.date, gender:req.body.gender, email:mail})
      .exec(function(err, user) {
        if(err||!user) res.status(403).send({success: false, msg: 'user false'});
        else{
          let send_id = user.u_id.substring(0,(user.u_id.length/2));
          for(let i=0;i<(user.u_id.length-(user.u_id.length/2));i++){
            send_id += '*';
          }
          console.log(send_id);
          //res.json(send_id);

          let mailOptions = {
              from: "고티비티"+"<"+manager_email+">",
              to: user.email,
              subject: '고티비티 아이디 찾기',
              html:'<h1><font>고티비티 아이디 찾기 입니다.</font></h1><p><font size="3">고객님의 아이디는'+send_id+'</font></p>'
          };
          smtpTransport.sendMail(mailOptions, function(error, response){
              if (error){
                  console.log(error);
                  res.status(403).send({success: false, msg: 'mail false'});
              } else {
                  console.log("Message sent : " + response.message);
                  res.json(true)
              }
              smtpTransport.close();
          });

        }
      })
    },
    findPassword: function(req, res){
      console.log(req.body)
      let mail = req.body.email+"@"+req.body.address;
      User.findOne({name:req.body.name, birthday:req.body.date, gender:req.body.gender, email:mail,u_id:req.body.id})
      .exec(function(err, user) {
        if(err||!user) res.status(403).send({success: false, msg: 'user false'});
        else{
          let ObjectId = require('mongoose').Types.ObjectId;
          let hashPassword = "";

          let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
          let string_length = 10;
          let newPassword = "";
          for (let i=0; i<string_length; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            newPassword += chars.substring(rnum,rnum+1);
          }
          console.log(newPassword);
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newPassword, salt, function (err, hash) {
                    hashPassword = hash;
                    User.update({_id:ObjectId(user._id)},{$set:{password:hashPassword}})
                    .exec(function(err){
                      let mailOptions = {
                          from: "고티비티"+"<"+manager_email+">",
                          to: user.email,
                          subject: '고티비티 비밀번호 찾기',
                          html:'<h1><font>고티비티 임시 비밀번호 입니다.</font></h1><p><font size="3">고객님의 임시 비밀번호는 ['+newPassword+'] </font></p>'
                      };
                      smtpTransport.sendMail(mailOptions, function(error, response){
                          if (error){
                              console.log(error);
                              res.status(403).send({success: false, msg: 'mail false'});
                          } else {
                              console.log("Message sent : " + response.message);
                              res.json(true)
                          }
                          smtpTransport.close();
                      });
                });
            });
          })
        }
      })
    },
    autoLogin: function(req, res){
      VerfiyActions.verify(req,res).then(
        object_id=>{
          let ObjectId = require('mongoose').Types.ObjectId;
          if(!object_id|| object_id == false){
            res.status(403).send({success: false, msg: '인증 에러'});
          }
          else{
            User.findOne({_id:ObjectId(object_id)})
            .exec(function(err,user){
              if(err||!user) res.status(403).send({success: false, msg: 'token false'});
              else res.send(true);
            })
          }
        },err=>{
          res.status(403).send({success: false, msg: 'token false'});
        }
      )
    },
    login: function(req, res) {
        User.findOne({
            u_id: req.body.u_id
        }, function(err, user){
            if (err) res.status(403).send({success: false , status: errMsg.server});
            if(!user) res.status(403).send({success: false, status: errMsg.id});
            else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.sign({object_id:user._id, u_id:user.u_id}, config.secret, { expiresIn: timestamp });
                        res.json({success: true, token: token});
                    } else {
                        return res.status(403).send({success: false, msg: errMsg.auth});
                    }
                })
            }

        })
    },

    addNew: function(req, res){
      console.log(req.body);
        if((!req.body.name)||
          (!req.body.password)||
          (!req.body.u_id)||
          (!req.body.birthday)||
          (!req.body.email)||
          (!req.body.gender)||
          (!req.body.phone)||
          (!req.body.address)){
            res.json({success: false, status: errMsg.sign});
            console.log("errr");
          }
        else {
            let date = new Date();
            var newUser = User({
                u_id: req.body.u_id,
                password: req.body.password,
                birthday: req.body.birthday,
                email: req.body.email+"@"+req.body.address,
                phone: req.body.phone,
                name: req.body.name,
                pass: initial_pass,
                sign_date : date.toFormat('YYYY-MM-DD HH24:MI:SS'),
                gender : req.body.gender,
                point : 10
            });
            newUser.save(function(err, newUser){
                if (err||!newUser){
                  console.log(err);
                    res.json({success:false, status:errMsg.logic})
                }
                else {
                  console.log(newUser)
                    res.json({success:true, status:'가입성공'});
                }
            })
        }
    },
    signFB: function(req, res){
      const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(req.body.token);
      firebase.auth().signInWithCredential(facebookCredential)
      .then((success) => {
          User.findOne({
              u_id: success.email
          }, function(err, user){
              if (err) throw err;
              if(!user) { //가입이 안되있으면 자동 가입
                console.log(success);
                var newUser = User({
                    u_id: success.email,
                    password: success.uid,
                    name: success.displayName,
                    email: success.providerId,
                    photo: success.photoURL,
                    phone: success.phoneNumber,
                    pass: initial_pass
                    //생일, 젠더
                });
                newUser.save(function(err, new_user){
                    if (err){
                        console.log("저장실패");
                        res.json({success:false, status: errMsg.logic})
                    }

                    else {
                        console.log("새로가입");
                        var token = jwt.sign({object_id:new_user._id, u_id:new_user.password},
                           config.secret, { expiresIn: timestamp });
                        res.json({success: true, token: token});
                    }
                })
              }
             else {
                  user.comparePassword(success.uid, function(err, isMatch){
                      if(isMatch && !err) {
                          console.log(user);
                          console.log("기존가입 되어있음 로그인수행");
                          var token = jwt.sign({object_id:new_user._id, u_id:new_user.password}, config.secret, { expiresIn: timestamp });
                          res.json({success: true, token: token});
                      } else {
                          console.log("인증실패");
                          return res.status(403).send({success: false, status:errMsg.password});
                      }
                  })
              }
          })
      })
      .catch((error) => {
          console.log("Firebase failure: " + JSON.stringify(error));
          //console.log("errrrrrr");
      });
    },

    signGG: function(req, res){
      //console.log(req.body.token);
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(req.body.token);
        //  console.log(googleCredential);
          firebase.auth().signInWithCredential(googleCredential)
          .then((success) => {
              User.findOne({
                  u_id: success.email
              }, function(err, user){
                  if (err) throw err;

                  if(!user) {
                    var newUser = User({
                      u_id: success.email,
                      password: success.uid,
                      name: success.displayName,
                      email: success.providerId,
                      photo: success.photoURL,
                      phone: success.phoneNumber,
                      pass: initial_pass
                    });
                    console.log(newUser);

                    newUser.save(function(err, newUser){
                        if (err){
                            console.log("저장실패");
                            res.json({success:false, msg:'Failed to save'})
                        }

                        else {
                            console.log("새로가입");
                            var token = jwt.sign({id:user.id, name:user.name}, config.secret, { expiresIn: timestamp });
                        }
                    })
                  }

                 else {
                      user.comparePassword(success.uid, function(err, isMatch){
                          if(isMatch && !err) {
                              console.log(user);
                              console.log("기존가입 되어있음 로그인수행");
                              var token = jwt.sign({id:user.id, name:user.name}, config.secret, { expiresIn: timestamp });
                              res.json({success: true, token: token});
                          } else {
                              console.log("인증실패");
                              return res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
                          }
                      })
                  }

              })
              //console.log("Firebase success: " + JSON.stringify(success));
              //console.log(success.uid);
          })
          .catch((error) => {
              console.log("Firebase failure: " + JSON.stringify(error));
              //console.log("errrrrrr");
          });
    },

    checkId: function(req, res) {
        User.findOne({
            u_id: req.body.id
        }, function(err, user){
            if (err) throw err;

            if(!user) {
                res.json({success:true, msg:'can regiser'});
            }

           else {
                res.json({success: false, msg: 'exist id'});
            }
          })
    },
}

module.exports = functions;
