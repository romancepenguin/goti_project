var User = require('../models/user');
var Verify = require('../auth/verifyActions');

var funcions = {
    purchase : function (req,res) {
      let id_=""
      if((id_ = Verify.verify(req,res)) != false){
        console.log("로그인 유효성검증 완료");
      } else{
        console.log("false");
      }

      let ObjectId = require('mongoose').Types.ObjectId;
      User.findByIdAndUpdate(
        ObjectId(_id),
        {$push: {"blist": { "bname": req.body.bname,
                            "list": req.body.blist,
                            "day": "2013-01-13"
                          }}},
        {safe: true, upsert: true, new : true},
        function(err, user) {
          if(err){
            res.json({success:true, context: "insert heart"});
          } else {
            res.json({success:false, context: "error heart"});
          }
        });
    }

}

module.exports = funcions;
