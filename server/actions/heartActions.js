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
    getHeart : function (req,res){
      VerfiyActions.verify(req,res).then(
        object_id=>{
          let ObjectId = require('mongoose').Types.ObjectId;
          Facility.find({_id:{$in:req.body.list.map(function(o){ return mongoose.Types.ObjectId(o);})}})
          .exec(function(err, facility){
            res.json(facility);
          })
        },
        err=>{
          res.status(403).json({success: false, status: errMsg.logic});
        }
      )
    }
}

module.exports = funcions;
