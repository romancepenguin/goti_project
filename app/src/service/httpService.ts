import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {

  //private serverUrl:string = "http://114.200.200.151:3000/";
  private serverUrl:string = "http://13.209.98.30:3000/";
  private FacilityUrl:string = this.serverUrl+"facilites";
  private DetailUrl:string = this.serverUrl+"detail";
  private HeartUrl:string= this.serverUrl+"heart";
  private MapUrl:string=this.serverUrl+"pinpoint"; // 자신 기반위치로 url 가져올때
  private BuyUrl:string=this.serverUrl+"buy";
  private MyBookUrl:string=this.serverUrl+"my_book"; // 내 예약현황
  private EnrolCommentUrl:string=this.serverUrl+"enrol_comment"; //댓글 등록
  private GetTopCommentUrl:string=this.serverUrl+"get_top_comment";
  private GoodBadUrl:string=this.serverUrl+"good_bad_comment";
  private MyProfileUrl:string=this.serverUrl+"get_my_profile";
  private RefreshPassUrl:string=this.serverUrl+"refresh_pass";
  private MyUseUrl:string = this.serverUrl+"my_use";
  private getPaymentListUrl:string = this.serverUrl+"my_payment";
  private getMyObjectIdUrl:string = this.serverUrl+"get_my_object_id";

  private getEventUrl:string = this.serverUrl+"get_event";
  private getFpUrl:string = this.serverUrl+"get_fp";
  private getCbUrl:string = this.serverUrl+"get_cb";

  private getCashPackageUrl:string = this.serverUrl+"packge_info";

  private sendProfileImageUrl:string = this.serverUrl+"profile_image";
  private postCashUrl:string = this.serverUrl+"cash_id";

  private changePasswordUrl:string = this.serverUrl+"change_password";

  constructor(public http: Http) {

  }

  authHeader(){
    var token = window.localStorage.getItem('myToken');
    var headers = new Headers();
    //this.loadUserCredentials();
    headers.append('Authorization', 'Bearer ' +token);
    let options = new RequestOptions({ headers: headers });
    return options;
  }

  changePassword(c_pwd, m_pwd){
    let body = {
      current_password:c_pwd,
      modify_password:m_pwd
    }
    return this.http.post(this.changePasswordUrl,body,this.authHeader()).map(res =>
      res.json());
  }

  getPaymentList(){
    return this.http.get(this.getPaymentListUrl,this.authHeader()).map(res =>
      res.json());
  }

  postCashId(u_id, m_id){
    let body = {
      u_id:u_id,
      m_id:m_id
    }
    return this.http.post(this.postCashUrl,body,this.authHeader()).map(res =>
      res.json());
  }

  sendProfileImage(image){
    let body = {
      image:image
    }
    return this.http.post(this.sendProfileImageUrl,body,this.authHeader()).map(res =>
      res.json());
  }

  getCashPackage(){
    return this.http.get(this.getCashPackageUrl,this.authHeader()).map(res =>
      res.json());
  }

  getEvent(){
    return this.http.get(this.getEventUrl,this.authHeader()).map(res =>
      res.json());
  }
  getFp(){
    return this.http.get(this.getFpUrl,this.authHeader()).map(res =>
      res.json());
  }
  getCb(){
    return this.http.get(this.getCbUrl,this.authHeader()).map(res =>
      res.json());
  }

  getMyObjectId(){
    return this.http.get(this.getMyObjectIdUrl,this.authHeader()).map(res =>
      res.json());
  }

  getMyUse(){ //이용내역
    return this.http.get(this.MyUseUrl,this.authHeader()).map(res =>
      res.json());
  }

  refreshPass(){
    return this.http.get(this.RefreshPassUrl,this.authHeader()).map(res =>
      res.json());
  }

  getMyProfile(){
    return this.http.get(this.MyProfileUrl,this.authHeader()).map(res =>
      res.json());
  }

  GoodBadComment(c_id, goodOrbad){
    let body = {
      c_id:c_id,
      goodORbad:goodOrbad
    }
    return this.http.post(this.GoodBadUrl,body,this.authHeader()).map(res =>
      res.json());
  }


  getTopComment(f_id, cnt, skip){
    let body = {
      f_id:f_id,
      cnt: cnt,
      skip: skip
    }
    return this.http.post(this.GetTopCommentUrl,body,this.authHeader()).map(res =>
      res.json());
  }

  enrolComment(title,comment,rate,f_id){
    let body = {
      rate:rate,
      comment:comment,
      title:title,
      f_id:f_id
    }
    console.log(body)
    return this.http.post(this.EnrolCommentUrl,body,this.authHeader()).map(res =>
      res.json());
  }

  getMyBook(){
    return this.http.get(this.MyBookUrl,this.authHeader()).map(res =>
      res.json());
  }

  purchaseProduct(blist:any, id){
    let body = {
      id: id,
      blist: blist
    }

    return this.http.post(this.BuyUrl, body, this.authHeader()).map(res =>
      res.json());
  }

  getPinPoint(lon,lat){
    let body = {
      lon:lon,
      lat:lat
    }

    /*return this.http.post(this.url, body, this.authHeader()).map(res =>
      res.json());*/
    return this.http.post(this.MapUrl, body).map(res =>
      res.json());
  }

  getCompanyData2(){
    return this.http.get(this.FacilityUrl).map(res =>
      res.json());
  }

  getDetailData(id:string){
    return this.http.get(this.DetailUrl +"?f_id="+ id).map(res =>
      res.json());
  }

  getHeart(listHeart){
    let body = {
      list:listHeart
    }
    console.log(body);
    return this.http.post(this.HeartUrl, body, this.authHeader()).map(res =>
      res.json());
  }

  getFacility(inquiry:string, skip){
    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });
    let body = {
      skip:skip,
      inquiry:inquiry
    }

    return this.http.post(this.FacilityUrl, body, this.authHeader()).map(res =>
      res.json());
  }
  //get -> map -> subscribe
}
