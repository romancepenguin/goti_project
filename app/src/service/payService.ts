import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PayService {
  //private serverUrl:string = "http://114.200.200.151:3000/";
  private serverUrl:string = "http://13.209.98.30:3000/";
  private buyFacilityUrl:string = this.serverUrl+"facility_payment_buy";
  private cancelItemUrl:string = this.serverUrl+"cancel_item";
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

  facility_payment_buy(facility_payment, f_id){
    let body = {
      f_id: f_id,
      buy_list: facility_payment
    }
    //console.log(body);
    return this.http.post(this.buyFacilityUrl, body, this.authHeader()).map(res =>
      res.json());
  }

  cancelItem(order_id,count){
    let body = {
      order_id:order_id,
      count:count
    }
    return this.http.post(this.cancelItemUrl, body, this.authHeader()).map(res =>
      res.json());
  }
}
