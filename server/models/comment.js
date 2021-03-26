var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    title: String,
    contents: String,
    date: String,
    time: String,
    good: Number,
    bad: Number,
    score: Number,
    f_id: Schema.Types.ObjectId, //외부 참조
    u_id: String, //외부 참조
    object_u_id: Schema.Types.ObjectId,
    eval_user_list:[] //object_u_id 리스ㅌ,
});

module.exports = mongoose.model('Comment', commentSchema);
