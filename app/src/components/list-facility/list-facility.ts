import { Component, Input, Output } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpService } from '../../service/httpService';
import { DetailPage } from '../../pages/detail-page/detail-page';

@Component({
  selector: 'list-facility',
  templateUrl: 'list-facility.html',
  providers : [HttpService]
})
export class ListFacility {

  @Input() facility:any;
  @Input() lat:number;
  @Input() lon:number;
  @Input() heart:string = "heart-outline";
  @Input() checkFilter:boolean;

  private minPass:number;
  private maxPass:number;

  constructor(private nav: NavController,
              private httpservice: HttpService) {
  }

  ngOnInit(){
    //console.log(this.facility.kind);
  }

  format_score(score){
    return score.toFixed(1);
  }
  format(kind){
    let item_sort = ["수상","육상","휴양","실내","항공"];
    console.log(kind);
    let index = item_sort.indexOf(kind);
    return index;
  }

  pass_count(){
    if(this.facility.max_pass==this.facility.min_pass){
      return "모두 "+this.facility.min_pass+"pass"
    }else{
      return "최소 "+this.facility.min_pass+"pass ~ "+this.facility.max_pass+"pass"
    }
  }

  calculateDistance(lat1:any, lon1:any, lat2:any, lon2:any) {
     let R = 6371; // km
     let dLat = (lat2-lat1)* Math.PI / 180;
     let dLon = (lon2-lon1)* Math.PI / 180;
     let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(lat1* Math.PI / 180) * Math.cos(lat2* Math.PI / 180) *
             Math.sin(dLon/2) * Math.sin(dLon/2);
     let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     let d = R * c;
     //d = Math.floor(d/100);
     let x = d.toFixed(2);
     return x;
   }

   detail_Page(){
     this.nav.push(DetailPage,{
       id:this.facility['_id']
     })
   }
}
