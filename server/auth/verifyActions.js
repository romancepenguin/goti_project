var jwt = require('jsonwebtoken');
var config = require('../config/database');

var functions = {
  verify: function(req){
    return new Promise(resolve => {
      if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, config.secret, function(err, decoded) {
            if(err){
              resolve(false)
            } else {
              resolve(decoded.object_id);
            }
        });
      }
      else {
          resolve(false);
      }
    })
  }
}

module.exports = functions;
