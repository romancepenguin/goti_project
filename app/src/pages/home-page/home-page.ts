import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../service/httpService';
//import { FCM } from '@ionic-native/fcm';
import { AuthService } from '../../service/authService';
import { DetailPage } from '../../pages/detail-page/detail-page';

@Component({
  selector: 'page-home-page',
  templateUrl: 'home-page.html',
  providers: [HttpService,AuthService]
})
export class HomePage {

  private event_list:any = [];
  private fp_list:any = [];
  private cb_list:any = [];
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private httpservice: HttpService,
              private authservice: AuthService,
              //private fcm: FCM
              ) {
/*
                this.fcm.getToken().then(
                  token=>{
                    this.authservice.registerToken(token).then() //푸쉬용 토큰 보내기, 만료일 갱신
                  },err=>{
                    console.log(err);
                  }
                )
*/
                //this.fcm.onNotification().subscribe(data=>{})


                this.httpservice.getEvent().subscribe(
                  res=>{
                    if(res.ok){
                      this.event_list = res;
                    }
                  },err=>{
                    console.log(err)
                  }
                )
                this.httpservice.getFp().subscribe( //핫플레이스 or 패턴분석 데이터가 없으면 가장 많이 팔린거
                  res=>{
                    this.fp_list = res;
                  },err=>{
                    console.log(err)
                  }
                )
                this.httpservice.getCb().subscribe( //유저 맟춤
                  res=>{
                    if(res.ok){
                      this.cb_list = res;
                    }
                  },err=>{
                    console.log(err)
                  }
                )
              }
    detail_Page(f_id){
      this.navCtrl.push(DetailPage,{
        id:f_id
      })
    }

}
