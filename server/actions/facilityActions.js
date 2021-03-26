var Facility = require('../models/facility');
var Item = require('../models/item');

var VerifyAction = require('../auth/verifyActions');
var ObjectId = require('mongoose').Types.ObjectId;
var AreaList = require('../filter/area');
var ActivityList = require("../filter/activity");
var errMsg = require("../config/errorMsg");

/*
추가적으로 토큰분리후 아이디 존재하는지 확인하는 인증 모듈 제작 할것
*/

var funcions = {
    SearchFacility : function (req,res) {
        let key_area="" //지역명
        let key_activity=[]; //종목 리스트
        let key_activity2=[]; //세부종목 리스트
        let key_title=[]; //필터후 남은 검색 키워드

        var word = (req.body.inquiry).split(" ") //공백을 기준으로 분리

        for(var i=0, keyword; keyword=word[i]; i++) { //지역명 일치하는것 검색
              if(AreaList.area.indexOf(keyword) != -1){
                key_area = keyword;
              }
        }
        for(var i=0, keyword; keyword=word[i]; i++) { //종목 일치하는 것 검색
              if(ActivityList.activity.indexOf(keyword) != -1){
                key_activity.push(keyword);
              }
        }
        for(var i=0, keyword; keyword=word[i]; i++) { //종목 일치하는 것 검색
              if(ActivityList.activity2.indexOf(keyword) != -1){
                key_activity2.push(keyword);
              }
        }
        key_title = word;

        /*
        for(let i=0;i<key_title.length;i++){
          if(key_title[i] == key_area){
            key_title.splice(i,1);
            continue;
          }
          for(let j=0 ;j<key_activity.length;j++){
            if(key_activity[j]==key_title[i]){
                key_title.splice(i,1);
            }
          }
        }*/ //탐색 제거
        //key_title = key_title.join([separator = ''])
        //필터 처리후 키워드 제거하는 것인데 검색 효율성 있는지 논의 필요


        if(key_activity.length==0){ //종목 키워드에 있는 유무에 따라 검색 실시
          Facility.find({
            $and:[
              {"adr.si_do":{$regex:key_area}},
              {"bname":{$regex:key_title}}
                      ]},{})
              //.where('kind').equals(kind)
              //.populate('item_id_list')
              .select({ picture: 0, phone:0, context:0 })
              .limit(8) //제한, 한번에 주는 데이터
              .skip(req.body.skip) //시작번호
              .exec(function (err, facility, count) {
                  if(err){console.log(err); res.status(403).json({success: false, status: errMsg.server});}
                  else if(!facility){
                      res.status(403).json({success: false, status: errMsg.facilityNotFound});
                  }
                  else{
                      //console.log(facility);
                      res.json(facility);
                  }
              })
        }
        else if(key_activity2.length == 0){
          Facility.find({
            $and:[
              {"kind":{$in:key_activity}},
              {"adr.si_do":{$regex:key_area}},
              {"bname":{$regex:key_title}}
                      ]},{})
              //.where('kind').equals(kind)
            //.populate('item_id_list')
            .select({ picture: 0, phone:0, context:0 })
            .limit(8) //제한, 한번에 주는 데이터
              .skip(req.body.skip) //시작번호
              .exec(function (err, facility, count) {
                  if(err) res.status(403).json({success: false, status: errMsg.server});
                  if(!facility){
                      res.status(403).json({success: false, status: errMsg.facilityNotFound});
                  }
                  else{

                      res.json(facility);
                  }
              })
        }
        else{
          Facility.find({
            $and:[
              {"kind":{$in:key_activity}},
              {"kind2":{$in:key_activity2}},
              {"adr.si_do":{$regex:key_area}},
              {"bname":{$regex:key_title}}
                      ]},{})
              //.where('kind').equals(kind)
            //.populate('item_id_list')
            .select({ picture: 0, phone:0, context:0 })
            .limit(8) //제한, 한번에 주는 데이터
              .skip(req.body.skip) //시작번호
              .exec(function (err, facility, count) {
                  if(err) res.status(403).json({success: false, status: errMsg.server});
                  if(!facility){
                      res.status(403).json({success: false, status: errMsg.facilityNotFound});
                  }
                  else{

                      res.json(facility);
                  }
              })
        }
    },

    detailEnter : function (req,res) {
        Facility.findOne({'_id':ObjectId(req.param("f_id"))})
        .populate({
          path:'item_id_list',
          match: { active : true}
        })
        .exec(function (err, facility) {
          if(err) res.status(403).json({success: false, status: errMsg.server});
          if(!facility){
              res.status(403).json({success: false, status: errMsg.facilityNotFound});
          }
          else{
              res.json(facility);
          }
        })
    },

    FacilityPin : function (req,res) {
        /*if(Verify.verify(req,res) != false){
          console.log("true");
        } else{
          console.log("false");
        }*/ //db.facility.find({bname:{$in:["시설명1","시설명2"]}},{"bname":true})
        console.log(req.body.lat);
        console.log(req.body.lon);
        if(req.body.lon == "NaN" || req.body.lat == "NaN" ){
          res.status(403).json({success: false, msg: 'not exist facility'});
        }else{
        Facility.find({},{picture: false, reply: false, context:false})
            .where('loc.lat').gt(req.body.lat-5).lt(req.body.lat+5) //범위지정
            .where('loc.lon').gt(req.body.lon-5).lt(req.body.lon+5)
            .exec(function (err, facility, count) {
                if(err) throw err;
                if(!facility){
                    res.status(403).json({success: false, msg: 'not exist facility'});
                }
                else{
                    console.log(facility)
                    res.json(facility);
                }
              })
            }
    }
}

module.exports = funcions;
