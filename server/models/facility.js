var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facilitySchema = new Schema({
    bname : String, //시설 명
    banner : String, //배너사진
    context : String, //시설 설명
    weekday : {open:String, close:String}, //평일 오픈시간
    weekend : {open:String, close:String}, //주말 오픈시간
    picture : [String], //상세이미지
    adr : {
        si_do : String,
        si_gun_goo : String,
        town : String,
        numb : String
    },
    loc : { //위도, 경도
        lat : Number,
        lon : Number
    },
    phone : String,
    kind : [], //문화, 관광, 레져, 체험
    kind2 : [],
    score : Number,
    max_pass : Number,
    min_pass : Number,
    item_id_list : [{
      type: Schema.Types.ObjectId,
      ref:'Item'
    }]
});

module.exports = mongoose.model('Facility', facilitySchema); //콜렉션 명
