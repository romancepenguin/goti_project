import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sort'})
export class SortFacility implements PipeTransform {
  transform(value: any, distance: number, rate: number, lat:number, lon:number){
    //console.log(value);
    //console.log(distance);
    //console.log(rate);

    function calculateDistance(lat1, lon1, lat2, lon2) {
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

    function compare_up_rate(a,b) {
      if (a.score < b.score)
        return 1;
      if (a.score > b.score)
        return -1;
      return 0;
    }
    function compare_down_rate(a,b) {
      if (a.score < b.score)
        return -1;
      if (a.score > b.score)
        return 1;
      return 0;
    }
    function compare_up_distance(a,b) {
      if (calculateDistance(lat,lon,a.loc.lat,a.loc.lon) < calculateDistance(lat,lon,b.loc.lat,b.loc.lon))
        return 1;
      if (calculateDistance(lat,lon,a.loc.lat,a.loc.lon) > calculateDistance(lat,lon,b.loc.lat,b.loc.lon))
        return -1;
      return 0;
    }
    function compare_down_distance(a,b) {
      if (calculateDistance(lat,lon,a.loc.lat,a.loc.lon) < calculateDistance(lat,lon,b.loc.lat,b.loc.lon))
        return -1;
      if (calculateDistance(lat,lon,a.loc.lat,a.loc.lon) > calculateDistance(lat,lon,b.loc.lat,b.loc.lon))
        return 1;
      return 0;
    }
    if(distance==1){
      value.sort(compare_up_distance);
    }else if(distance==-1){
      value.sort(compare_down_distance);
    }

    if(rate==1){
      value.sort(compare_up_rate);
    }else if(rate==-1){
      value.sort(compare_down_rate);
    }
    return value;
  }
}
