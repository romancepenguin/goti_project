var FacilityPayment = require('../models/facility_payment');
var Facility = require('../models/facility');
var User = require('../models/user');
var OrderItem = require('../models/order_item');
var FacilityRecommendCb = require('../models/facility_recommend_cb');
var FacilityRecommendFp = require('../models/facility_recommend_fp');
var Event_ = require('../models/event');

var mongoose = require('mongoose');
var VerfiyActions = require('../auth/verifyActions');
var errMsg = require('../config/errorMsg');

var funcions = {
    getEvent : function (req,res){
      VerfiyActions.verify(req,res).then(
       object_id=>{
         console.log(object_id)
         Event_.find()
         .exec(function(err, event_){
           if(err||!event_) res.status(403).json({success: false, status: errMsg.logic});
           else{
             res.json(event_);
           }
         })
       },err=>{
         res.status(403).json({success: false, status: errMsg.logic});
       }
      )
    },
    getFp : function (req,res){
      VerfiyActions.verify(req,res).then(
       object_id=>{
         	//console.log(object_id)
         	//let ObjectId = require('mongoose').Types.ObjectId;
		 const cursor = FacilityPayment.aggregate([{$group:{_id:"$f_id",count:{$sum:1}}}])
                 .limit(6)
                 .sort({ count: -1 })
	         .cursor({batchSize:1000})
	         .exec()
	       let f_list = []
	         const f_l = cursor.eachAsync(async (data,index) => {
			 f_list.push(data._id);
		 })
	       f_l.then((data)=>{

		   Facility.find({_id:{$in:f_list.map(function(o){ return mongoose.Types.ObjectId(o);})}})
		   .exec(function(err, facility){
		     if(err||!facility) res.status(403).json({success: false, status: errMsg.logic});
		     else{
		       res.json(facility);
		     }
		   })
	       });
       })
    },
    getCb : function (req,res){
      VerfiyActions.verify(req,res).then(
       object_id=>{
         const cursor = FacilityRecommendCb.findOne({object_u_id:object_id.toString()})
         .limit(6)
	         .exec()
             console.log("******");
	cursor.then((data)=>{
		console.log(data);
             let query=[];
             for(let i=0;i<r_list.length;i++){
               query.push(r_list[i].slice(1,25));
             }
             Facility.find({_id:{$in:query.map(function(o){ return mongoose.Types.ObjectId(o);})}})
             .exec(function(err, facility){
               if(err||!facility) res.status(403).json({success: false, status: errMsg.logic});
               else{
                 res.json(facility);
               }
             })
       	})
       },err=>{
        res.status(403).json({success: false, status: errMsg.logic});
       }
      )
    },
}

module.exports = funcions;
