import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Book } from './book';
import { CancelPageModule } from './cancel/cancel.module';

@NgModule({
  declarations: [
    Book,
  ],
  imports: [
    IonicPageModule.forChild(Book),
    CancelPageModule
  ],
  exports: [
    Book
  ]
})
export class BookModule {}
