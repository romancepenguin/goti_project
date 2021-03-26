import { Component, Input } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpService } from '../../../service/httpService';

@Component({
  selector: 'page-modify-info',
  templateUrl: 'modify-info.html',
  providers : [HttpService],
})
export class ModifyInfoPage {

  private user:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private httpservice: HttpService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModifyInfoPage');
  }

  ngOnInit(){
    this.user = this.navParams.get('user');
    console.log(this.user);
  }

  changePassword(){
    let alert = this.alertCtrl.create({
      title: '비밀번호 변경',
      inputs: [
        {
          placeholder: '현재 패스워드',
          name: 'current_password',
          type: 'password'
        },
        {
          placeholder: '변경할 패스워드',
          name: 'change_password',
          type: 'password'
        },
        {
          placeholder: '한번 더 입력',
          name: 'change_password_check',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: '취소'
        },
        {
          text: '변경',
          handler: data => {
            if(data.change_password != data.change_password_check){
              let alert = this.alertCtrl.create({
                title: '입력한 패스워드가 다릅니다.',
                buttons: ['확인']
              });
              alert.present();
            }else{
              this.httpservice.changePassword(data.current_password, data.change_password).subscribe(
                res=>{
                  console.log(res)
                  if(res.success){
                    let alert = this.alertCtrl.create({
                      title: '변경 완료.',
                      buttons: ['확인']
                    });
                    alert.present();
                  }else{
                    let alert = this.alertCtrl.create({
                      title: '현재 패스워드가 옳지 않습니다.',
                      buttons: ['확인']
                    });
                    alert.present();
                  }
                },
                err=>{
                  let alert = this.alertCtrl.create({
                    title: '인증 오류. 로그아웃후 다시 시도하세요',
                    buttons: ['확인']
                  });
                  alert.present();
                }
              )
            }
          }
        }
      ]
    });
    alert.present();
  }
  changeId(){

  }
}
