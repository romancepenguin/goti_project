import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../service/httpService';
//import { IonicIamportInicis } from './cordova-iamport.js';
import { IamportService } from 'iamport-ionic-kcp';
//import { IonicIamportInicis } from 'iamport-ionic-inicis';
//import { IonicIamportInicis } '@IonicIamportInicis';
//declare var IonicIamportInicis;
//var IMP = window.IMP; // 생략가능
//IMP.init('iamport'); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용

@Component({
  selector: 'page-cash-page',
  templateUrl: 'cash-page.html',
  providers: [HttpService]
})
export class CashPage {

  private pass_package_list:any;
  private user:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private httpservice:HttpService,
              public iamport: IamportService) {

  }
//

  ionViewDidLoad() {
    this.httpservice.getCashPackage().subscribe(
      res=>{
        //console.log(res);
        this.pass_package_list=res;
      },err=>{
        console.log(err);
      }
    )
    this.httpservice.getMyProfile().subscribe(
      res=>{
        this.user = res;
      },
      err=>{
        console.log(err)
      }
    )
    console.log(window)
  }

  energy(pass_package) {
      alert('현재 지원하지 않는 기능입니다.');
      return;
      /*const param = {
        pay_method : 'card',
        merchant_uid : 'merchant_' + new Date().getTime(),
        name : pass_package.packge_name,
        amount : pass_package.price,
        buyer_email : this.user.email,
        buyer_name : this.user.name,
        buyer_tel : this.user.phone
      };
      let u_id;
      let m_id;
      let iamport = this.iamport;
      //let http = this.httpservice;
      // 아임포트 관리자 페이지 가입 후 발급된 가맹점 식별코드를 사용
      var _promise = ()=>{
        return new Promise(function (resolve, reject){

      iamport.payment('imp41408631', param )
        .then((response)=> {
          let rsp:any = response;
          //alert(rsp.success)
          //if ( rsp.success ) {
            var msg = '결제가 완료되었습니다.';
            msg += '고유ID : ' + rsp.imp_uid;
            msg += '상점 거래ID : ' + rsp.merchant_uid;
            u_id = rsp.imp_uid;
            m_id = rsp.merchant_uid;
            //alert(msg);
            resolve(true);
          //}
        })
        .catch((err)=> {
          alert(err)
          resolve(false);
        });

      });
      }

      _promise()
      .then(
        res=>{
          this.httpservice.postCashId(u_id, m_id).subscribe(
            re=>{
              console.log(re);
              alert("충전완료");
            }
          )
        }
      )*/
    }

/*
  energy(pass_package,payment,user){
    let u_id;
    let m_id;
    var _promise = ()=>{
      return new Promise(function (resolve, reject){
        payment('imp41408631', {
            pay_method : 'card',
            merchant_uid : 'merchant_' + new Date().getTime(),
            name : pass_package.packge_name,
            amount : pass_package.price,
            buyer_email : user.email,
            buyer_name : user.name,
            buyer_tel : user.phone
        }, function(rsp) {
            if ( rsp.success ) {
                var msg = '결제가 완료되었습니다.';
                msg += '고유ID : ' + rsp.imp_uid;
                msg += '상점 거래ID : ' + rsp.merchant_uid;
                u_id = rsp.imp_uid;
                m_id = rsp.merchant_uid;
            } else {
                var msg = '결제에 실패하였습니다.';
                msg += '에러내용 : ' + rsp.error_msg;
            }
            alert(msg);
            resolve(true);
        });
      })
    }

    _promise()
    .then(
      res=>{
        this.httpservice.postCashId(u_id, m_id).subscribe(
          re=>{
            console.log(re);
          }
        )
      }
    )
  }

  parseQuery(query) {
    var obj = {},
    arr = query.split('&');
    for (var i = 0; i < arr.length; i++) {
      var pair = arr[i].split('=');

      obj[ decodeURIComponent(pair[0]) ] = decodeURIComponent(pair[1]);
    }

    return obj;
  }

  payment__(user_code, param, callback) {
    var IMP = window.IMP;
    if( InAppBrowser ) {
      var payment_url = 'iamport-checkout.html?user-code=' + user_code,
      m_redirect_url = 'http://localhost/iamport';
      param.m_redirect_url = m_redirect_url;//강제로 변환
      let iab = new InAppBrowser();
      console.log(payment_url)
      var inAppBrowserRef = iab.create(payment_url, '_blank', 'location=no'),
      paymentProgress = false;

      var startCallback = function(event) {
        if( (event.url).indexOf(m_redirect_url) === 0 ) { //결제 끝.
          var query = (event.url).substring( m_redirect_url.length + 1 ) // m_redirect_url+? 뒤부터 자름
          var data = this.parseQuery(query); //query data

          if ( typeof callback == 'function' ) {
            var rsp = {
              success : data.imp_success === 'true',
              imp_uid : data.imp_uid,
              merchant_uid : data.merchant_uid,
              error_msg : data.error_msg
            };

            callback.call(cordova, rsp);
          }

          finish();
        }
      };

      var stopCallback = function(event) {
        if ( !paymentProgress && (event.url).indexOf(payment_url) > -1 ) {
          paymentProgress = true;

          var inlineCallback = "function(rsp) {if(rsp.success) {location.href = '" + m_redirect_url + "?imp_success=true&imp_uid='+rsp.imp_uid+'&merchant_uid='+rsp.merchant_uid;} else {location.href = '" + m_redirect_url + "?imp_success=false&imp_uid='+rsp.imp_uid+'&merchant_uid='+rsp.merchant_uid+'&error_msg='+rsp.error_msg;}}",
            iamport_script = "IMP.request_pay(" + JSON.stringify(param) + "," + inlineCallback + ")";

          inAppBrowserRef.executeScript({
            code : iamport_script
          });
        }
      };

      var exitCallback = function(event) {
        if ( typeof callback == 'function' ) {
          var rsp = {
            success : false,
            imp_uid : null,
            merchant_uid : param.merchant_uid,
            error_code : 'CANCEL',
            error_msg : '사용자가 결제를 취소하였습니다.'
          };

          callback.call(cordova, rsp);
        }
      };

      var finish = function() {
        inAppBrowserRef.removeEventListener('loadstart', startCallback);
        inAppBrowserRef.removeEventListener('loadstop', stopCallback);
        inAppBrowserRef.removeEventListener('exit', exitCallback);
        setTimeout(function() {
          inAppBrowserRef.close();
        }, 10);
      };

      inAppBrowserRef.on('loadstart', startCallback);
      inAppBrowserRef.on('loadstop', stopCallback);
      inAppBrowserRef.on('exit', exitCallback);

      //for KakaoPay
      if ( param.app_scheme ) {
        var oldHandleOpenUrl = window.handleOpenURL;

        window.handleOpenURL = function(url) {
          if ( url == (param.app_scheme+'://process') ) {
            inAppBrowserRef.executeScript({
              code : "IMP.communicate({result:'process'})"
            });
          } else if ( url == (param.app_scheme+'://cancel') ) {
            inAppBrowserRef.executeScript({
              code : "IMP.communicate({result:'cancel'})"
            });
          } else {
            oldHandleOpenUrl(url);
          }
        }
      }

      inAppBrowserRef.show();
    } else {
      IMP.init(user_code);
      IMP.request_pay(param, callback);
    }
  }*/

  /*energy(p){
    const browser = this.iab.create('https://naver.com/');
  }*/
/*
  energy(pass_package){

    var IMP = window.IMP;
    IMP.init('imp41408631'); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
    IMP.request_pay({
    pg : 'inicis', // version 1.1.0부터 지원.
    pay_method : 'card',
    merchant_uid : 'merchant_' + new Date().getTime(),
    name : '주문명:결제테스트',
    amount : 14000,
    buyer_email : 'iamport@siot.do',
    buyer_name : '구매자이름',
    buyer_tel : '010-1234-5678',
    buyer_addr : '서울특별시 강남구 삼성동',
    buyer_postcode : '123-456',
    m_redirect_url : 'http://localhost/iamport',
    app_scheme : 'ioniciamport'
  }, function(rsp) {
    if ( rsp.success ) {
        var msg = '결제가 완료되었습니다.';
        msg += '고유ID : ' + rsp.imp_uid;
        msg += '상점 거래ID : ' + rsp.merchant_uid;
        msg += '결제 금액 : ' + rsp.paid_amount;
        msg += '카드 승인번호 : ' + rsp.apply_num;
    } else {
        var msg = '결제에 실패하였습니다.';
        msg += '에러내용 : ' + rsp.error_msg;
    }
    alert(msg);
    });

  }*/


}
