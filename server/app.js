var express = require('express');
var logger = require('morgan');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cors = require('cors');
var config = require('./config/database');
var passport = require('passport');
var app = express();

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect(config.database); //디비명

app.use(bodyParser.json());
app.use(logger('dev')); //로그
app.set('jwt-secret', 'Bearer'); //jwt 시크릿 세팅
app.use(passport.initialize()); //passport 초기화
app.use(cors()); //웹브라우저 크로스 도메인 해결을 위한 모듈
require('./config/passport')(passport);

var port = process.env.PORT || 3000; //포트 조정
var router = require('./routes/route')(app);

var server = app.listen(port, function () {
    console.log("express server has started on port" + port)
})
