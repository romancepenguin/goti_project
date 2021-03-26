import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailPage } from './detail-page';
import { UserComment } from './user-comment/user-comment';
import { Ionic2RatingModule } from 'ionic2-rating';
import { IonPullupModule } from 'ionic-pullup';

@NgModule({
  declarations: [
    DetailPage,
    UserComment
  ],
  imports: [
    IonicPageModule.forChild(DetailPage),
    Ionic2RatingModule,
    IonPullupModule
  ],
  exports: [
    DetailPage
  ]
})
export class DetailPageModule {}
