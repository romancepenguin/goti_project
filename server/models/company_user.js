var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var CompanyUserSchema = new Schema({	//결제정보
  c_u_id:String,
  password:String,
  name:String,
  email:String,
  phone:String,
  sign_date:String,
  f_id_list:[{
    type:Schema.Types.ObjectId,
    ref:'Facility'
  }] // 업체 대표가 관리하는 시설
});
CompanyUserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

CompanyUserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
module.exports = mongoose.model('company_user', CompanyUserSchema); //콜렉션 명
