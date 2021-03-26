/*
빌드 가이드
ionic platform add ios
ionic platform add android

ionic build ios && android
ionic run android
*/
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Login } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { DetailPage } from '../pages/detail-page/detail-page';
import { SearchPage } from '../pages/search-page/search-page';

import { AuthService } from '../service/authService';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  templateUrl: 'app.html',
  providers : [AuthService,AndroidPermissions]
})
export class MyApp {
  rootPage:any = Login;

  constructor(platform: Platform,
      statusBar: StatusBar,
      splashScreen: SplashScreen,
      private authservice: AuthService,
      private androidPermissions: AndroidPermissions) {
    platform.ready().then(() => {

      /*자동 로그인*/

      let token = window.localStorage.getItem('myToken');
      if(token){
        this.authservice.autoLogin(token).then(
          res=>{
            if(res==true){
              this.rootPage = TabsPage;
            }else{
              this.rootPage = Login;
            }
          },err=>{
              this.rootPage = Login;
          }
        )
      }else{
        this.rootPage = Login;
      }

      statusBar.styleDefault();
      splashScreen.hide();
    });

    let listHeart = JSON.parse(window.localStorage.getItem('myHeart'));
    if(listHeart ==null){
        window.localStorage.setItem('myHeart', JSON.stringify([])); //빈 배열로 저장
    }
  }


}
