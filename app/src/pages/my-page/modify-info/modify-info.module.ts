import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyInfoPage } from './modify-info';

@NgModule({
  declarations: [
    ModifyInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyInfoPage),
  ],
  exports: [
    ModifyInfoPage
  ]
})
export class ModifyInfoPageModule {}
