import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';

import { HttpModule } from '@angular/http';
import { Ionic2RatingModule } from 'ionic2-rating';

import { HomePage } from '../pages/home-page/home-page';
import { MyPage } from '../pages/my-page/my-page';
import { SearchPage } from '../pages/search-page/search-page';
import { HeartPage } from '../pages/heart-page/heart-page';
import { CashPage } from '../pages/cash-page/cash-page';
import { TabsPage } from '../pages/tabs/tabs';
import { Map } from '../pages/map/map';
import { DetailPage } from '../pages/detail-page/detail-page';

import { Sign } from '../pages/sign/sign';
import { LoginPageModule } from '../pages/login/login.module';
import { FindPage } from '../pages/login/find/find';

import { ListFacility } from  '../components/list-facility/list-facility';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook'
//import { GooglePlus } from '@ionic-native/google-plus';

import { IonPullupModule } from 'ionic-pullup';

/*모듈*/
import { MyPageModule } from '../pages/my-page/my-page.module';
import { DetailPageModule } from '../pages/detail-page/detail-page.module';
import { SearchPageModule } from '../pages/search-page/search-page.module';

import { SortFacility } from '../service/sort_facility';
import { IamportService } from 'iamport-ionic-kcp';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@NgModule({
  declarations: [
    MyApp,
    HeartPage,
    CashPage,
    HomePage,
    TabsPage,
    ListFacility,
    Map,
    Sign,
    SearchPage,
    SortFacility
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    Ionic2RatingModule,
    IonPullupModule,
    MyPageModule,
    DetailPageModule,
    LoginPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyPage,
    HeartPage,
    CashPage,
    HomePage,
    TabsPage,
    Map,
    Sign,
    DetailPage,
    SearchPage,
    FindPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeStorage,
    Facebook,
    //GooglePlus,
    IamportService,
    InAppBrowser ,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
