var userActions = require('../actions/userActions');
var facilityActions = require('../actions/facilityActions');
var myActions = require('../actions/myActions');
var commentActions = require('../actions/commentActions');
var homeActions = require('../actions/homeActions');
var heartActions = require('../actions/heartActions');

var passPayActions = require('../payActions/passPayActions');
var cashActions = require('../payActions/cashActions');

var authActions = require('../auth/authActions');


module.exports = function (app) {

    /*찜 페이지*/
    app.post('/heart', heartActions.getHeart);

    /*푸쉬*/
    app.post('/register_token', authActions.registerToken);

    /*가입,로그인*/
    app.get('/auto_login', authActions.autoLogin);
    app.post('/authenticate', authActions.login);
    app.post('/fb', authActions.signFB);
    app.post('/gg', authActions.signGG);
    app.post('/validId', authActions.checkId);
    app.post('/adduser', authActions.addNew);
    app.post('/find_id', authActions.findId);
    app.post('/find_password', authActions.findPassword);

    /*메인 페이지*/
    app.get('/get_event', homeActions.getEvent) //이벤트 페이지
    app.get('/get_fp', homeActions.getFp) //연관분석
    app.get('/get_cb', homeActions.getCb) //협업필터링

    app.get('/detail',facilityActions.detailEnter);
    app.post('/facilites',facilityActions.SearchFacility);
    app.post('/pinpoint', facilityActions.FacilityPin);
    //app.get('', );

    app.post('/buy',userActions.purchase);

    /*마이페이지*/
    app.get('/my_book', myActions.get_my_book); //내예약 내역 조회
    app.get('/get_my_profile', myActions.get_my_profile);
    app.get('/refresh_pass', myActions.refresh_pass);
    app.get('/my_use', myActions.my_use);
    app.post('/profile_image', myActions.enrolProfileImage);
    app.get('/my_payment', myActions.get_my_payment);
    app.post('/change_password', myActions.changePassword);

    /*패스 결제 부분*/
    app.post('/facility_payment_buy', passPayActions.facility_payment_buy); //시설 지불
    app.post('/cancel_item', passPayActions.cancel_item);

    /*댓글 관리 부분*/
    app.post('/enrol_comment', commentActions.addComment);
    app.post('/get_top_comment', commentActions.getTopComment);
    app.post('/good_bad_comment', commentActions.goodbadComment);
    app.get('/get_my_object_id', commentActions.getMyObjectId);

    /*캐쉬 페이지*/
    app.post('/cash_id', cashActions.cashEnergy); //결제한 아이디로 체크
    app.get('/packge_info', cashActions.packageInfo);

}
