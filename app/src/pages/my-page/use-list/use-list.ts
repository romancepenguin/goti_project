import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'use-list',
  templateUrl: 'use-list.html'
})
export class UseList {

  @Input() use:any; //이용 기록

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

  ngOnInit(){
    //console.log(this.use);
  }

}
