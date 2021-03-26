import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { PayService } from '../../../../../service/payService'

@Component({
  selector: 'page-cancel',
  templateUrl: 'cancel.html',
  providers: [PayService]
})
export class CancelPage {

  private count:number = 1;
  private item_count:number;
  private item_name:string;
  private order_id:number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private pay:PayService,
              private alertCtrl: AlertController) {
            this.item_count = navParams.get('order_count');
            this.item_name = navParams.get('item_name');
            this.order_id = navParams.get('order_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelPage');
  }

  cancel(){
    console.log(this.count)
    console.log(this.order_id)
    this.pay.cancelItem(this.order_id,this.count).subscribe(
      res=>{
        //성공 메세지 출력
        let alert = this.alertCtrl.create({
          title: '취소완료',
          subTitle: '취소가 완료 되었습니다.',
          buttons: ['확인']
        });
        alert.present();
        this.dismiss()
      },
      err=>{
        //에러 메세지 출력
        console.log(err);
        this.dismiss()
      }
    )
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
