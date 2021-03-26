var Comment = require('../models/comment');
var time = require('date-utils');
var checkToken = require('../auth/verifyActions'); //토큰 검증용
var User = require('../models/user');
var Facility = require('../models/facility');
var errMsg = require("../config/errorMsg");

var funcions = {
    getMyObjectId : function (req, res){
      checkToken.verify(req,res).then(
        object_id =>{
          console.log(object_id)
          res.json({object_u_id:object_id});
        },
        err=>{
          res.json({success:false});
        })
    },
    addComment : function (req,res) {
      checkToken.verify(req,res).then(
        object_id =>{
          let ObjectId = require('mongoose').Types.ObjectId;
          Comment.findOne({f_id:ObjectId(req.body.f_id), object_u_id:ObjectId(object_id)})//이중 등록 방지
          .exec(function(err, comment){
            if(err){
              res.status(403).json({success: false, msg: errMsg.logic});
            }
            else if(comment){
              res.json({success: false, msg: errMsg.duplicateComment});
            }
            else{
              let date = new Date();
              let comment = new Comment();
              comment.title = req.body.title;
              comment.contents = req.body.comment;
              comment.f_id = ObjectId(req.body.f_id);
              comment.date = date.toFormat('YYYY-MM-DD');
              comment.time = date.toFormat('HH24:MI:SS');
              comment.good = 0;
              comment.bad = 0;
              comment.score = req.body.rate;
              comment.eval_user_list = [];
              comment.object_u_id = object_id;

              User.findOne(ObjectId(object_id),{"u_id":true})
              .exec(function(err, user){
                comment.u_id = user.u_id;
                comment.save(function(err){
                  if(err) res.json({success:false});
                  //평점 업데이트
                  Comment.find({},{"score":true})
                  .exec(function (err, com) {
                    let sum=0;
                    for(let i=0;i<com.length;i++){
                        sum+=com[i].score;
                    }
                    let avg = sum/com.length;
                    avg+=0;
                    Facility.update({"_id":ObjectId(req.body.f_id)},{$set:{"score":avg}})
                    .exec(function(err){
                      if(err) res.json({success:false});
                      res.json({success:true});
                    })
                  })
                });
              })
            }
          })
        },
        err =>{
          res.status(403).json({success: false, msg: errMsg.auth}); //인증 로직 에러
        })
    },
    getTopComment : function(req,res){
            console.log(req.body.f_id);
      let ObjectId = require('mongoose').Types.ObjectId;
      Comment.find({"f_id":ObjectId(req.body.f_id)})
      .sort({ good: -1 })
      .limit(req.body.cnt)
      .skip(req.body.skip)
      .exec(function (err, comments) {
        if(err || !comments){
          res.status(403).json({success: false, msg: 'db error'});
        }else{
          console.log(comments);
          res.json(comments);
        }
      })
    },
    goodbadComment : function(req,res){
      checkToken.verify(req,res).then(
        object_id =>{
          let ObjectId = require('mongoose').Types.ObjectId;
          Comment.findOne({$and:[
            {"_id":ObjectId(req.body.c_id)},
            {"eval_user_list":{ $elemMatch: { object_u_id : ObjectId(object_id) }}}
          ]}) //이미 등록했는지 확인
          .exec(function(err, com_user){
              if(com_user){
                console.log("등록 취소 or 이미등록");
                let index = com_user.eval_user_list.findIndex(x => x.object_u_id ==  object_id);
                if(req.body.goodORbad==1 && com_user.eval_user_list[index].goodbad == 1){
                  Comment.update({"_id":ObjectId(req.body.c_id)},
                  {$pull: { "eval_user_list": {object_u_id:ObjectId(object_id), goodbad:1} },$inc:{good:-1}},function(err){
                    console.log("ragrg");
                    if(err){
                      res.json({success:false, context: "inc good"});
                    }else{
                    res.json({success:true});
                    }
                  })
                }
                else if(req.body.goodORbad==0  && com_user.eval_user_list[index].goodbad == 0){
                  Comment.update({"_id":ObjectId(req.body.c_id)},
                  {$pull: { "eval_user_list": {object_u_id:ObjectId(object_id), goodbad:0} },$inc:{bad:-1}},function(err){
                    if(err){
                      res.json({success:false, context: ''});
                    }else{
                    res.json({success:true});
                    }
                  })
                }else{
                  res.json({success:false, stsaus: errMsg.evalDuplicate});
                }
              }else{
                console.log("등록시작");
                if(req.body.goodORbad==1){
                  Comment.update({"_id":ObjectId(req.body.c_id)},
                  {$push: { "eval_user_list": {object_u_id:ObjectId(object_id), goodbad:1} },$inc:{good:1}},function(err){
                    if(err){
                      res.json({success:false, context: "inc good"});
                    }else{
                    res.json({success:true});
                    }
                  })
                }
                else if(req.body.goodORbad==0){
                  Comment.update({"_id":ObjectId(req.body.c_id)},
                  {$push: { "eval_user_list": {object_u_id:ObjectId(object_id), goodbad:0} },$inc:{bad:1}},function(err){
                    if(err){
                      res.json({success:false, context: "inc bad"});
                    }else{
                    res.json({success:true});
                    }
                  })
                }
              }
            }
          )

        },
        err =>{
          res.status(403).json({success: false, msg: 'auth fail'}); //인증 로직 에러
        }
      )
    }
}

module.exports = funcions;
