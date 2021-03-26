import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../service/httpService';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-heart-page',
  templateUrl: 'heart-page.html',
  providers : [HttpService]
})
export class HeartPage {

  private facilites:any[] = [];
  private lat:number;
  private lon:number;
  private data_check:boolean = true;
  private context:string = "시설을 찜 해주세요~~";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private httpservice: HttpService,
              private geolocation: Geolocation) {
                this.geolocation.getCurrentPosition().then((resp) => {
                  this.lat=resp.coords.latitude
                  this.lon=resp.coords.longitude
                  console.log(this.lat);
                  console.log(this.lon);
                }).catch((error) => {
                  console.log('Error getting location', error);
                });
                if(this.facilites.length == 0){
                  this.data_check = false;
                }else{
                  this.data_check = true;
                }
  }
  ionViewWillEnter() {
    let listHeart = JSON.parse(window.localStorage.getItem('myHeart'));
    this.getHeart(listHeart)
    console.log(this.facilites.length)
    if(this.facilites.length > 0 ) this.context = "";
    else this.context = "시설을 찜 해주세요~~";
  }

  allHeartRemove(){
    let listHeart = [];
    window.localStorage.setItem('myHeart', JSON.stringify(listHeart));
    this.facilites = [];
  }

  heartRemove(f_id){
    let listHeart = JSON.parse(window.localStorage.getItem('myHeart'));
    let index = listHeart.indexOf(f_id);
    listHeart.splice(index, 1);
    window.localStorage.setItem('myHeart', JSON.stringify(listHeart));

    console.log(this.facilites)
    index = this.facilites.findIndex(x => x._id ==  f_id);
    console.log(index);
    this.facilites.splice(index, 1);
  }

  getHeart(list){ //데이터 불러오기
    this.httpservice.getHeart(list).subscribe(
      res =>{
        console.log(this.facilites);
        this.facilites = res;
      },
      err =>{
        console.error(err);
      }
    );
  }



}
