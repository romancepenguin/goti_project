import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentList } from './payment-list';

@NgModule({
  declarations: [
    PaymentList,
  ],
  imports: [
    IonicPageModule.forChild(PaymentList),
  ],
  exports: [
    PaymentList
  ]
})
export class PaymentListModule {}
