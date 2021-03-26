import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpService } from '../../service/httpService';
import { Geolocation } from '@ionic-native/geolocation';
import { Map } from '../../pages/map/map';

@Component({//
  selector: 'page-search-page',
  templateUrl: 'search-page.html',
  providers : [HttpService],

})
export class SearchPage {

  private query_distance:number=1; //오름차순
  private query_rate:number=1; //오름차순 1, 변화없음 0, 내림차순 -1

  //private loc:string;
  private lat:number;
  private lon:number;
  private heart:string = "heart-outline";
  //private kind_color:any;
  private input:any="";
  private facilites:any[] = []; //item
  private skip: number = 0;//
  private moreCanBeLoaded: boolean = false;
  private inquiry: string;
  private markers = ["수상","육상","휴양","체험","항공"];
  private clicked_marker = [];
  private pass_range:number=50;
  private structure: any = {lower: 0, upper: 5000};
  private all_fac:any; //전체 데이터 임시 보관
  private expand_filter_word:string="펼치기";
  private expand_filter_value:boolean=false;

  constructor(private nav: NavController,
              private httpservice: HttpService,
              private geolocation: Geolocation) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat=resp.coords.latitude
      this.lon=resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
      this.lat=0
      this.lon=0
      //alert(error);
    });
    for(let i=0;i<this.markers.length;i++){
      this.clicked_marker.push("3px solid #755eff");
    }
    //this.markers =
    let time = new Date();
    console.log(time.getDate());

  }
  sort_rate(check){
    if(check==1){//up
      this.query_distance = 0;
      this.query_rate = 1;
    }else{//down
      this.query_distance = 0;
      this.query_rate = -1;
    }
  }
  sort_distance(check){
    if(check==1){//up
      this.query_distance = 1;
      this.query_rate = 0;
    }else{//down
      this.query_distance = -1;
      this.query_rate = 0;
    }
  }
  expand_filter(){
    if(this.expand_filter_value){
      this.expand_filter_value=false;
      this.expand_filter_word="펼치기";
    }else{
      this.expand_filter_value=true;
      this.expand_filter_word="접기";
    }
  }

  filter_activity(facility){
    if(this.expand_filter_value == false){
      return true;
    }
    for(let i=0;i<facility.kind.length;i++){
      for(let j=0;j<this.markers.length;j++){
        if(this.markers[j] == facility.kind[i] && this.clicked_marker[j]=="3px solid #755eff"){
          return true;
        }
      }
    }
    return false;
  }

  filter_list(facility){
    //console.log(facility);
    if(this.filter_activity(facility)==false){
      return false;
    }

    if(this.structure.lower<facility.min_pass && facility.max_pass<this.structure.upper){
      return true;
    }
    return false;
  }

  filter_marker_on(index){
    if(this.clicked_marker[index]=="3px solid white"){
      this.clicked_marker[index] = "3px solid #755eff";
    }else{
      this.clicked_marker[index] = "3px solid white";
    }
  }

  doInfinite(infiniteScroll) { //스크롤 제어 메소드
    //console.log('Begin async operation');

    setTimeout(() => {
      this.getFacility(this.inquiry);

      //console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  getFacility(inquiry:string){ //데이터 불러오기
    this.httpservice.getFacility(inquiry,this.skip).subscribe(
      res =>{
        let i = 0;
        if(!res[i]) this.moreCanBeLoaded = false;
        while(res[i]) {
          //console.log(res);
          this.facilites.push(res[i]);
          //console.log("hi");
          //console.log(this.facilites[i].item[0].iname);
          i++;
          this.skip++;
        }
        console.log(this.facilites);
        //console.log(this.items);
      },
      err =>{
        console.error(err);
      }
    );
  }

  onInput() { //검색
    this.facilites = [];
    //let val = ev.target.value;
    let val = this.input;
    this.inquiry = val;
    this.moreCanBeLoaded = true;
    this.skip = 0;
    this.getFacility(this.inquiry);
  }

  mapPage(){
     this.nav.push(Map,{
       facilites : this.facilites,
       lat: this.lat,
       lon: this.lon
     });
  }
}
