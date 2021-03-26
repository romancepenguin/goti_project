import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpService } from '../../service/httpService';
import { ModifyInfoPage } from './modify-info/modify-info';
import { ConfigPage } from './config/config';

@Component({
  selector: 'page-my-page',
  templateUrl: 'my-page.html',
  providers: [Camera, HttpService]
})
export class MyPage {

  private profileImage:string;
  private MyProfile:any;
  private use_list:any;
  private payment_list:any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private camera: Camera,
              private actionSheetCtrl: ActionSheetController,
              private httpservice: HttpService) {
              this.profileImage = "assets/null_profile.png";
              this.httpservice.getMyProfile().subscribe(
                res=>{
                  this.MyProfile = res;
                  if(this.MyProfile.photo){
                      this.profileImage = 'data:image/jpeg;base64,' + this.MyProfile.photo;
                  }
                },
                err=>{
                  console.log(err)
                }
              )
  }

  ionViewWillEnter(){

    this.httpservice.getMyUse().subscribe(
      res=>{
        this.use_list = res;
      },
      err=>{
        console.log(err)
      }
    )
    this.httpservice.getPaymentList().subscribe(
      res=>{
        //console.log(res);
        this.payment_list = res;
      },
      err=>{
        console.log(err)
      }
    )
  }

  ngOnInit(){
    console.log("res");
  }

  private camera_options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 500,
    targetHeight: 500,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }

  private gallery_options: CameraOptions = {
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    quality: 50,
    targetWidth: 500,
    targetHeight: 500,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  }

  configControl(){
    this.navCtrl.push(ConfigPage,{
      user:this.MyProfile
    })
  }

  refresh_pass(){
    this.httpservice.refreshPass().subscribe(
      res=>{
        this.MyProfile.pass = res.pass;
      },
      err=>{
        console.log(err)
      }
    )
  }

  sendImage(Image){
    this.httpservice.sendProfileImage(Image).subscribe(
      res=>{
        console.log(res);
      },err=>{
        console.log(err);
      }
    )
  }

  takePicture(){
    this.camera.getPicture(this.camera_options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.profileImage = 'data:image/jpeg;base64,' + imageData;
     this.sendImage(imageData);
    }, (err) => {
     // Handle error
    });
  }

  takeGallery(){
    this.camera.getPicture(this.gallery_options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.profileImage = 'data:image/jpeg;base64,' + imageData;
     this.sendImage(imageData);
    }, (err) => {
     // Handle error
    });
  }

  modifyMyInfo(){
    this.navCtrl.push(ModifyInfoPage,{
      user:this.MyProfile
    })
  }

  openActionSheet(){
   console.log('opening');
   let actionsheet = this.actionSheetCtrl.create({
   title:"Choose Album",
   buttons:[{
   text: '새로찍기',
     handler: () => {
     this.takePicture();
    }
   },{
   text: '갤러리',
   handler: () => {
     this.takeGallery();
    }
  },
  {
  text: '취소',
  role: 'cancel'
  }
 ]
   });
   actionsheet.present();
  }



}
