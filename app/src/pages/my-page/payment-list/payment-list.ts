import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'payment-list',
  templateUrl: 'payment-list.html',
})
export class PaymentList {

  @Input() payment:any; //이용 기록

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    //console.log(this.payment);
  }

}
