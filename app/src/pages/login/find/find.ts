import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../../service/authService';

@Component({
  selector: 'page-find',
  templateUrl: 'find.html',
  providers : [AuthService]
})
export class FindPage {

  private findid_name:any;
  private findid_date:any;
  private id_gender:any;
  private findid_email:any;
  private findid_address:any;

  private findpwd_id:any;
  private findpwd_name:any;
  private findpwd_mail:any;
  private findpwd_date:any;//
  private pwd_gender:any;
  private findpwd_email:any;
  private findpwd_address:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authservice: AuthService,
              private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindPage');
  }

  successAlert(){
    let alert = this.alertCtrl.create({
        title: '전송 성공',
        subTitle: '메일을 확인하세요.',
        buttons: ['확인']
      });
    alert.present();
  }

  failAlert(){
    let alert = this.alertCtrl.create({
        title: '인증 실패',
        subTitle: '사용자 정보 오류 입니다.',
        buttons: ['확인']
      });
    alert.present();
  }

  findId(){
    console.log(this.id_gender)
    this.authservice.findId(this.findid_name, this.findid_date, this.id_gender, this.findid_email,this.findid_address).subscribe(
      res=>{
        if(res==true){
          this.successAlert();
        }else{
          this.failAlert();
        }
      },
      err=>{
        this.failAlert();
      }
    )
  }

  findPassword(){
    this.authservice.findPassword(this.findpwd_id, this.findpwd_name, this.findpwd_mail, this.findpwd_date,this.pwd_gender, this.findpwd_email,this.findpwd_address).subscribe(
      res=>{
        if(res==true){
          this.successAlert();
        }else{
          this.failAlert();
        }
      },
      err=>{
        this.failAlert();
      }
    )
  }
}
