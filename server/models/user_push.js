var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userPushTokenSchema = new Schema({
  u_id:{
		type: Schema.Types.ObjectId,
		ref:'User'
	},
  enrol_date:String,
  token:String //토큰은 최대 한개 푸쉬는 한곳에만 감
});

module.exports = mongoose.model('UserPushToken', userPushTokenSchema);

//eP1Z9uBxQ9s:APA91bHKBwp-p_eqSxEwRH9hKGnAW3uPjz0S7G_syrpER4e-GdmXgwBIQ1VyidtxjIiqdJnqHKc0M2hAhqi9rilLQXfcqaTU_GLWB8DnZ6aZMY266XjjvaeBjmB1ePgYgvOmiCE5qa5Y
