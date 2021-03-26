import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookList } from './book-list';
import { BookModule } from './book/book.module';
import { GroupByDatePayment } from '../../../service/groupby_date_payment';

@NgModule({
  declarations: [
    BookList,
    GroupByDatePayment
  ],
  imports: [
    IonicPageModule.forChild(BookList),
    BookModule
  ],
  exports: [
    BookList
  ]
})
export class BookListModule {}
