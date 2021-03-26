import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyPage } from './my-page';
import { BookListModule } from './book-list/book-list.module';
import { UseListModule } from './use-list/use-list.module';
import { PaymentListModule } from './payment-list/payment-list.module';
import { ModifyInfoPageModule } from './modify-info/modify-info.module'
import { ConfigPageModule } from './config/config.module';

@NgModule({
  declarations: [
    MyPage
  ],
  imports: [
    IonicPageModule.forChild(MyPage),
    BookListModule,
    UseListModule,
    PaymentListModule,
    ModifyInfoPageModule,
    ConfigPageModule
  ],
  exports: [
    MyPage
  ]
})
export class MyPageModule {}
