import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../service/authService';

import { Sign } from '../../pages/sign/sign';
import { TabsPage } from '../../pages/tabs/tabs';
import { FindPage } from './find/find';

import { Facebook } from '@ionic-native/facebook';
//import { GooglePlus } from '@ionic-native/google-plus';
@Component({
  selector: 'login',
  templateUrl: 'login.html',
  providers : [AuthService]
})
export class Login {
  usercreds = {
              name: '',
              password: ''
          };


  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private authservice: AuthService,
              private facebook: Facebook,
              //private goolge: GooglePlus,
              private alertCtrl: AlertController
            ) {}
  findIdPassword(){
    this.navCtrl.push(FindPage)
  }
  login(user) {
      //this.fcm.subscribeToTopic('marketing');
      this.authservice.authenticate(user).then(data => {
            console.log("data::");
            console.log("data::"+data);
              if(data==true) {
                //로딩 화면 추가
                this.navCtrl.setRoot(TabsPage);
              }else{ //올바르지 않은 로그인
                let alert = this.alertCtrl.create({
                    title: '로그인 오류',
                    subTitle: '잘못된 아이디 혹은 비밀번호 입니다.',
                    buttons: ['확인']
                  });
                alert.present();
              }
      });

  }
  signup() {
          this.navCtrl.push(Sign);
  }
  facebookLogin(){
    alert('현재 지원하지 않는 기능입니다.');
    return;
      /*this.facebook.login(['email']).then( (response) => {
        this.authservice.FBsign(response.authResponse.accessToken).then(data => {
            if(data) {
              this.navCtrl.setRoot(TabsPage);
            }
          });
      },err=>{
        let alert = this.alertCtrl.create({
            title: '로그인 오류',
            subTitle: err,
            buttons: ['확인']
          });
        alert.present();
      }).catch((error) => {                 let alert = this.alertCtrl.create({
                          title: '로그인 오류2',
                          subTitle: error,
                          buttons: ['확인']
                        });
                      alert.present(); });*/
  }

  googleLogin(){
    alert('현재 지원하지 않는 기능입니다.');
    return
    /*
    this.goolge.login({
      'webClientId':'69159763488-hqv9locofg3oco3dujhtknd3or10sgvg.apps.googleusercontent.com'
    }).then(userData => {
      this.authservice.GGsign(userData.idToken).then(data => {
          if(data) {
            this.navCtrl.setRoot(TabsPage);
          }
        });
    },err=>{
      let alert = this.alertCtrl.create({
          title: '로그인 오류',
          subTitle: err,
          buttons: ['확인']
        });
      alert.present();
    }).catch((error) => {                 let alert = this.alertCtrl.create({
                        title: '로그인 오류2',
                        subTitle: error,
                        buttons: ['확인']
                      });
                    alert.present(); });*/
 }
}
