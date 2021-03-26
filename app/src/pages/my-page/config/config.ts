import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { Login } from '../../login/login';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  private alert:any;
  private msg:any;
  private recommend:any;
  private mail:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private app:App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  logout(){
    window.localStorage.clear();
    this.app.getRootNav().setRoot(Login);
    /*서버에도 로그아웃 했다는걸 보내야함*/
  }
}
