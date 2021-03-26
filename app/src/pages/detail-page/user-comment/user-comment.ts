import { Component, Input } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpService } from '../../../service/httpService';

@Component({
  selector: 'user-comment',
  templateUrl: 'user-comment.html',
  providers: [HttpService]
})
export class UserComment {

  //private comments:any;
  private comment_rate = [];
  private expand_content = false;
  private expand_style = "word-break:break-all;";
  @Input() comment:any;

  private goodStyle:any = {'font-size': '25px','color' : 'black'};
  private badStyle:any = {'font-size': '25px','color' : 'black'};
  private myObjectId:any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private httpservice: HttpService,
              private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.httpservice.getMyObjectId().subscribe(
      res=>{
        let index = this.comment.eval_user_list.findIndex(x => x.object_u_id ==  res.object_u_id);

        if(index != -1){
          if(this.comment.eval_user_list[index].goodbad == 1){
            this.goodStyle = {'font-size': '25px','color' : 'blue'}
          }else{
            this.badStyle = {'font-size': '25px','color' : 'blue'}
          }
        }
      },
      err=>{
        console.log(err);
      }
    )

  }

  expand_contents(){
    if(this.expand_content==true){
      this.expand_content=false
      this.expand_style = "";
    }else{
      this.expand_content=true
      this.expand_style = "word-break:break-all;";
    }
  }

  good_comment(c_id){ //comment 고유 id
    this.httpservice.GoodBadComment(c_id,1).subscribe(
      res=>{
        if(res.success == false){
          this.alert_duplicate_goodbad();
        }else{
          if(this.goodStyle['color'] == 'blue'){
            this.goodStyle['color'] = 'black'
            this.comment.good-=1;
          }else{
            this.goodStyle['color'] = 'blue'
            this.comment.good+=1;
          }
            this.alert_thank_you();
        }
      },
      err=>{
        this.alert_network_bad();
      }
    )
  }
  bad_comment(c_id){
    this.httpservice.GoodBadComment(c_id,0).subscribe(
      res=>{
        if(res.success == false){
          this.alert_duplicate_goodbad();
        }else{
          if(this.badStyle['color'] == 'blue'){
            this.badStyle['color'] = 'black'
            this.comment.bad-=1;
          }else{
            this.badStyle['color'] = 'blue'
            this.comment.bad+=1;
          }
          this.alert_thank_you();
        }
      },
      err=>{
        this.alert_network_bad();
      }
    )
  }

  alert_network_bad(){
    let alert = this.alertCtrl.create({
      title: '오류',
      subTitle: '네트워크가 원활하지 않습니다.',
      buttons: ['확인']
    });
    alert.present();
  }
  alert_duplicate_goodbad(){
    let alert = this.alertCtrl.create({
      title: '등록실패',
      subTitle: '이미 평가를 하셨습니다.',
      buttons: ['확인']
    });
    alert.present();
  }
  alert_thank_you(){
    let alert = this.alertCtrl.create({
      title: '등록완료',
      subTitle: '평가를 등록해주셔서 감사합니다.~',
      buttons: ['확인']
    });
    alert.present();
  }
}
