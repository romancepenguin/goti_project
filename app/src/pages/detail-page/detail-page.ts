import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { HttpService } from '../../service/httpService';
import { PayService } from '../../service/payService';
import { IonPullUpFooterState } from 'ionic-pullup';

declare var google;

@Component({
  selector: 'page-detail-page',
  templateUrl: 'detail-page.html',
  providers: [HttpService,PayService]
})
export class DetailPage {

  private fac:any;
  private img:any[] = [];
  private mimg:any;
  private maxCount:number[] = [1,2,3,4,5,6,7,8,10];
  private buylist:any = [];
  private fac_item_extend:boolean = false;
  private footer_title:string = "구매하기";
  private expand:boolean = true;
  private rate:Number=1;
  private title:string;
  private comment:string;
  private comments:any[] = [];
  private comments_rate = [];
  private skip:number=0;
  private moreCanComments:boolean = true;
  private expand_comments:string = "댓글 더보기";
  private heart:string = "heart-outline";

  @ViewChild('map') mapElement: ElementRef;
  private map: any;

  footerState: IonPullUpFooterState;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private httpservice: HttpService,
              private payservice: PayService,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController) {
                this.httpservice.getDetailData(this.navParams.get('id')).subscribe(
                  res =>{
                    this.fac = res;

                    //console.log(this.fac.bname);
                    console.log(this.fac);
                    for(let i=0 ; i<(this.fac.picture).length ; i++){
                      this.img.push(this.fac.picture[i]);
                    }
                    this.mimg = this.img[0];
                    this.fac_item_extend = true;
                    this.get_comments(3,0);
                    /*하트 초기화*/
                    let listHeart = JSON.parse(window.localStorage.getItem('myHeart'));
                    if(listHeart.indexOf(this.fac['_id']) == -1){ //이미 있는지 체크
                      this.heart = "heart-outline";
                    } else {
                      this.heart = "heart";
                      console.log("exist heart");
                    }
                    this.loadMap();
                  },
                  err =>{
                    console.error(err);
                    this.fac_item_extend = false;
                  }
                );

  }
    loadMap(){
      //let latLng = new google.maps.LatLng(this.fac.loc.lat,
      //                                    this.fac.loc.lon);
      let latLng;
      let facilityLoc;
      //let marker = [];
        latLng = new google.maps.LatLng(this.fac.loc.lat, this.fac.loc.lon);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      console.log(this.mapElement)
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      facilityLoc = new google.maps.LatLng(this.fac.loc.lat,
                                             this.fac.loc.lon);
      let marker = new google.maps.Marker({
        map: this.map,
        position: facilityLoc
      });
    }


  mark_facility(){
    if(this.heart =="heart"){ //찜 제거
      this.heart ="heart-outline";
      let listHeart = JSON.parse(window.localStorage.getItem('myHeart'));
      if(listHeart.indexOf(this.fac['_id']) != -1){
        listHeart.splice(listHeart.indexOf(this.fac['_id']),1);
        window.localStorage.setItem('myHeart', JSON.stringify(listHeart));
      }else {
        console.log("non exist heart");
      }

    }
    else{ //찜 추가
      this.heart ="heart"
      //let list = [];
      let listHeart:string[]= JSON.parse(window.localStorage.getItem('myHeart'));
      //console.log(listHeart);
      //console.log(this.facility['_id']);
      //console.log(listHeart.indexOf(this.facility['_id']));

      if(listHeart.indexOf(this.fac['_id']) == -1){ //이미 있는지 체크
        listHeart.push(this.fac['_id']);
        window.localStorage.setItem('myHeart', JSON.stringify(listHeart));
      } else {
        console.log("exist heart");
      }

    }
  }

  view_all_user_comment(){
    if(this.moreCanComments){
      this.get_comments(10,this.skip); //10개씩 펼치기
    }
  }

  footerExpanded() {
    this.footer_title = "접기";
  }

  footerCollapsed() {
    this.footer_title = "구매하기";
  }

  toggleFooter() {
    this.footerState = this.footerState == IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

  ionViewDidLoad(){

  }

  get_comments(cnt,skip){
    this.httpservice.getTopComment(this.fac._id, cnt, this.skip).subscribe(
      res_comment=>{
        if(!res_comment[0]){
          this.moreCanComments = false;
          this.expand_comments = "더 이상 댓글이 없습니다."
        }
        let i=0;
        while(res_comment[i]) {
          this.comments.push(res_comment[i]);
          i++;
          this.skip++;
        }
        if(skip!=0&&i<=9){
          this.moreCanComments = false;
          this.expand_comments = "더 이상 댓글이 없습니다."
        }
      },
      err=>{
        console.error(err);
      }
    )
  }

  cancel(index){
    this.buylist.splice(index,1);
  }

  countDown(e){
    let cnt = (document.getElementById(e) as HTMLInputElement).value;
    let c = Number(cnt);
    if(c>1){
      c -= 1;
      cnt  = String(c);
      (document.getElementById(e) as HTMLInputElement).value = cnt;
    }
  }
  countUp(e){
    let cnt = (document.getElementById(e) as HTMLInputElement).value;
    let c = Number(cnt);
    if(c<100){
      c += 1;
      cnt = String(c);
      (document.getElementById(e) as HTMLInputElement).value = cnt;
    }
  }
  onSelectChange(newform) {
    console.log(newform);
    console.log(this.buylist);
  }

  purchase(){
    if(typeof this.buylist == 'undefined' || this.buylist.length <= 0){
      let alert = this.alertCtrl.create({
        title: '구매 오류',
        subTitle: '상품을 하나라도 선택하세요.',
        buttons: ['확인']
      });
      alert.present();
      return 0
    }
    let post_buy_list:object[] = []; //전송 할 post 데이터
    for(let i=0; i<(this.buylist).length; i++){
      post_buy_list.push({
        item_id: this.buylist[i]._id,
        item_name: this.buylist[i].item_name,
        pass: this.buylist[i].pass,
        count:(document.getElementById(this.buylist[i]._id) as HTMLInputElement).value
      });
    }
    //console.log(post_buy_list)
    this.payservice.facility_payment_buy(post_buy_list, this.fac._id).subscribe(
      res =>{
        let alert = this.alertCtrl.create({
          title: '구매 완료!!',
          subTitle: '사용해 주셔서 감사합니다!',
          buttons: ['확인']
        });
        alert.present();
      },
      err =>{
        let alert = this.alertCtrl.create({
          title: '구매 실패!!',
          subTitle: '에러를 확인 해주세요!',
          buttons: ['확인']
        });
        alert.present();
      }
    );
    this.expand = true;
  }

  comment_enrol(){
    if(this.title == ""){
      let alert = this.alertCtrl.create({
        title: '등록 오류!!',
        subTitle: '제목을 한글자라도 입력해 주세요.',
        buttons: ['확인']
      });
      alert.present();
      return;
    }
    this.httpservice.enrolComment(this.title,this.comment,this.rate,this.fac._id).subscribe(
      res =>{
        if(res.success==true){
          this.get_comments(this.comments.length, 0);
          let alert = this.alertCtrl.create({
            title: '등록 완료!!',
            subTitle: '평점을 등록해 주셔서 감사합니다!',
            buttons: ['확인']
          });
          alert.present();
        }else{
          let alert = this.alertCtrl.create({
            title: '등록 실패!!',
            subTitle: '댓글을 이미 등록 하셨어요.',
            buttons: ['확인']
          });
          alert.present();
        }
      },
      err =>{
        let alert = this.alertCtrl.create({
          title: '등록 실패',
          subTitle: '현재 네트워크 환경이 좋지 않습니다.',
          buttons: ['확인']
        });
        alert.present();
      }
    );
  }
  backPage(){
     this.navCtrl.pop();
  }
  magnify(image){
    this.mimg = image;
  }
}
