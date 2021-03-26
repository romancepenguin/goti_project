import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Login } from './login';
import { FindPage } from './find/find';

@NgModule({
  declarations: [
    Login,
    FindPage
  ],
  imports: [
    IonicPageModule.forChild(Login)
  ],
  exports: [
    Login,
    FindPage
  ]
})
export class LoginPageModule {}
