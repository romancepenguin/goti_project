import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { HttpService } from '../../service/httpService';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [HttpService]
})
export class Map {

  @ViewChild('map') mapElement: ElementRef;

  private map: any;
  private facilites:any = this.navParams.get('facilites');
  private facility:any;
  private lat:number;
  private lon:number;
  private show:boolean = false;
  private mheight:string = "98%";

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private platform: Platform,
              private ngzone: NgZone,
              private http: HttpService) {
              //this.ionViewDidLoad();
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  clickMarker(){
    console.log("aabab");
    if(this.show == true) this.show = false;
    else this.show = true;
  }

  loadMap(){
    //let latLng = new google.maps.LatLng(this.navParams.get('lat'),
    //                                    this.navParams.get('lon'));
    let latLng;
    let facilityLoc;
    let marker = [];

    if((this.facilites).length == 0){
      latLng = new google.maps.LatLng(this.navParams.get('lat'),this.navParams.get('lon'));
      this.http.getPinPoint(this.navParams.get('lon'),this.navParams.get('lat')).subscribe(
        res =>{
          this.facilites = res;
          for(let i=0; i<(this.facilites).length; i++) {
              this.addMarker(this.facilites[i]);
          }

        },
        err =>{
          console.error(err);
        });

    } else {
      console.log(this.facilites[0].loc.lat);
      console.log(this.facilites[0].loc.lon);
      latLng = new google.maps.LatLng(this.facilites[0].loc.lat,
                                      this.facilites[0].loc.lon);
    }

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    for(let i=0; i<(this.facilites).length; i++) {
        this.addMarker(this.facilites[i]);
    }
  }

  addMarker(facility){
    let facilityLoc = new google.maps.LatLng(facility.loc.lat,
                                           facility.loc.lon);
    let marker = new google.maps.Marker({
      map: this.map,
      position: facilityLoc
  });

    this.addInfoWindow(marker,facility);
  }

  addInfoWindow(marker,facility){

    google.maps.event.addListener(marker, 'click', () => {
      this.ngzone.run(() => {
        this.facility = facility;
        console.log(this.facility);
        this.lat = this.navParams.get('lat');
        this.lon =this.navParams.get('lon');
        this.show = true;
        this.mheight = "74%"
      });
    });
  }

// To add the marker to the map, call setMap();

}
