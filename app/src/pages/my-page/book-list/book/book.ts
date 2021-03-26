import { Component, Input } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { PayService } from '../../../../service/payService';
import { CancelPage } from './cancel/cancel';
import { DetailPage } from '../../../../pages/detail-page/detail-page';

@Component({
  selector: 'book',
  templateUrl: 'book.html',
  providers: [PayService]
})
export class Book {

  @Input() facility:any;
  @Input() payment:any;
  @Input() order_item_list:any = [];

  private expand:boolean = false;
  private open_check:string = "영업중 ~";
  private date:any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private payservice: PayService,
              private modalCtrl: ModalController) {

  }

  ngOnInit(){
console.log(this.order_item_list);
  }

  expand_detail(){
    this.expand= true;
  }
  fold_detail(){
    this.expand= false;
  }

  cancel_all(){

  }

  detail_Page(){
    this.navCtrl.push(DetailPage,{
      id:this.facility._id
    })
  }

  cancel(item_name ,order_id, order_count){
    console.log(order_count)
    console.log(order_id)
    console.log(item_name)
    let cancelModal = this.modalCtrl.create(CancelPage, {
      'item_name':item_name,
      'order_id': order_id,
      'order_count':order_count});
    cancelModal.present();
  }
}
