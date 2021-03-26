import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../../service/httpService';

@Component({
  selector: 'book-list',
  templateUrl: 'book-list.html',
  providers: [HttpService]
})
export class BookList {

  private order_item_list:any;
  private facility_list:any;
  private payment_list:any;
  private date_list:any[]=[];

  private expand:boolean = false;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private httpservice: HttpService) {
                if(!this.payment_list){
                  this.httpservice.getMyBook().subscribe(
                    res =>{
                      this.order_item_list = res[res.length-2];
                      this.facility_list = res[res.length-1];
                      this.payment_list = res.slice(0,res.length-2);
                      console.log(this.order_item_list)
                      console.log(this.facility_list)
                      console.log(this.payment_list)
                      for(let i=0;i<this.payment_list.length;i++){
                        if (this.date_list.indexOf(this.payment_list[i].date) == -1) {
                          this.date_list.push(this.payment_list[i].date);
                        }
                      }
                    },
                    err =>{
                      console.error(err);
                    }
                  );
                }
  }

  ionViewDidLoad() {


  }

  get_facility(f_id){
    let index = this.facility_list.findIndex(x => x._id === f_id)
    if(index != -1){
      return this.facility_list[index];
    }else{
      return "";
    }
  }

  filter_order(order_id_list){
    let tmp_order_item_list=[];
    for(let i=0;i<this.order_item_list.length;i++){
      for(let j=0;j<order_id_list.length;j++){
        if(this.order_item_list[i]._id == order_id_list[j]){
          tmp_order_item_list.push(this.order_item_list[i]);
        }
      }
    }
    return tmp_order_item_list;
  }

}
