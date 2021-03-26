import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UseList } from './use-list';

@NgModule({
  declarations: [
    UseList,
  ],
  imports: [
    IonicPageModule.forChild(UseList),
  ],
  exports: [
    UseList
  ]
})
export class UseListModule {}
