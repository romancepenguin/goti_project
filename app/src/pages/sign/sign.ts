import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../service/authService';
import { Login } from '../../pages/login/login';

@Component({
  selector: 'page-sign',
  templateUrl: 'sign.html',
  providers :[AuthService]
})
export class Sign {
private newcreds = {
              u_id: '',
              password: '',
              month: '2000-01-01',
              gender: 1,
              email: '',
              phone: '',
              address: '',
              name: ''
          }
private id_ExplainColor = "red";
private pwd_ExplainColor = "red";
private name_ExplainColor = "red";
private sCheckName:string = "";
private sCheckId:string = "";
private sCheckPwd:string = "";

private bId:boolean = false;
private bPwd:boolean = false;
private bEmail:boolean = false;
private bEmailAddress:boolean = false;
private bName:boolean = false;

private errMsg:string = ""
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authservice: AuthService,
              private alertCtrl: AlertController) {
  }

  checkError(){
    this.errMsg = ""
    this.checkEmail(this.newcreds.email)
    this.checkEmailAdr(this.newcreds.address)
    this.checkPhone(this.newcreds.phone)

    if(this.errMsg != "" || this.bId == false || this.bPwd == false || this.bEmail == false || this.bEmailAddress == false){
      let alert = this.alertCtrl.create({
          title: "오류",
          subTitle: this.errMsg,
          buttons: ['확인']
        });
      alert.present();
    } else {
      this.register(this.newcreds)
    }
  }

  checkName(name){
    let spe = name.search(/['~!@@#$%^&*|\\\'\'';:\/?.,-_+=`]/gi);
    let num = name.search(/[0-9]/g);
    if(name.length<2 || name.length>40){
      this.sCheckName = "이름의 길이를 확인해주세요.\n";
      this.name_ExplainColor = "red";//
      this.bName=false
    }
    if(name.search(/\s/) != -1){
      this.sCheckName = "이름을 공뱁없이 입력해주세요.\n";
      this.name_ExplainColor = "red";//
      this.bName=false
    }
    if(spe >= 0 || num >= 0){
      this.sCheckName = "이름에 특수문자나 숫자가 들어가 있는지 확인하세요.\n";
      this.name_ExplainColor = "red";//
      this.bName=false
    }
    else{
      this.sCheckName = "올바른 형식 입니다.\n";
      this.name_ExplainColor = "blue";//
      this.bName=true
    }
  }

  checkEmailAdr(address){
    this.bEmailAddress=true
    if(address.length<2 || address.length>40){
      this.errMsg += "이메일주소의 길이를 확인해주세요.";
      this.bEmailAddress=false
    }
    else if(address.search(/\s/) != -1){
      this.errMsg += "이메일주소를 공뱁없이 입력해주세요.";
      this.bEmailAddress=false
    }
  }

  checkEmail(email){
    this.bEmail=true
    if(email.length<2 || email.length>40){
      this.errMsg += "이메일의 길이를 확인해주세요.";
      this.bEmail=false
    }
    else if(email.search(/\s/) != -1){
      this.errMsg += "이메일을 공백없이 입력해주세요.";
      this.bEmail=false
    }
  };

  checkPhone(phone){
    let spe = phone.search(/['~!@@#$%^&*|\\\'\'';:\/?`]/gi);
    let eng = phone.search(/[a-z]/ig);
    this.bEmail=true
    if(phone.length<11 || phone.length>20){
      this.errMsg += "폰 번호의 길이를 확인해주세요.";
      this.bEmail=false

    }
    else if(phone.search(/\s/) != -1){
      this.errMsg += "폰 번호를 공뱁없이 입력해주세요.";
      this.bEmail=false
    }
    else if(spe >= 0 || eng>=0){
      this.errMsg += "폰 번호에 숫자이외의 값이 들어가 있는지 확인해주세요.";
      this.bEmail=false
    }
  }

  checkId(id){
    let spe = id.search(/['~!@@#$%^&*|\\\'\'';:\/?.,-_+=`]/gi);
    if(id.length<2 || id.length>20){
      this.sCheckId = "아이디는 2~20자 이내여야 합니다.";
      this.id_ExplainColor = "red";//
      this.bId=false
    }
    else if(id.search(/\s/) != -1){
      this.sCheckId = "아이디는 공뱁없이 입력해주세요.";
      this.id_ExplainColor = "red";//
      this.bId=false
    }
    else if(spe > 0){
      this.sCheckId = "아이디에는 특수문자가 들어갈수 없습니다.";
      this.id_ExplainColor = "red";//
      this.bId=false
    }
    else{
      this.sCheckId = "올바른 아이디 형식 입니다.";
      this.id_ExplainColor = "blue";//
      this.bId=true
    }
  }

  checkPwd(pwd){
    let num = pwd.search(/[0-9]/g);
    let eng = pwd.search(/[a-z]/ig);
    let spe = pwd.search(/['~!@@#$%^&*|\\\'\'';:\/?`]/gi);
    if(pwd.length<8 || pwd.length>20){
      this.sCheckPwd = "패스워드를 8~20자 이내로 입력하세요.";
      this.pwd_ExplainColor = "red";//
      this.bPwd=false;
    }
    else if(pwd.search(/\s/) != -1){
      this.sCheckPwd = "패스워드는 공뱁없이 입력하세요";
      this.pwd_ExplainColor = "red";//
      this.bPwd=false;
    }
    else if(num < 0 || eng<0 || spe <0){
      this.sCheckPwd = "패스워드는 영문,숫자,특수문자 혼합으로 이루어져야 합니다.";
      this.pwd_ExplainColor = "red";//
      this.bPwd=false;
    }
    else{
      this.sCheckPwd = "사용가능한 패스워드 입니다.";
      this.pwd_ExplainColor = "blue";//
      this.bPwd=true;
    }
  }

  register(user) {
    this.authservice.adduser(user).then(data => {
      if(data) {
        console.log(data);
        let alert = this.alertCtrl.create({
            title: '가입완료',
            subTitle: '축하드립니다.~',
            buttons: ['확인']
          });
        alert.present();
      }
      this.navCtrl.push(Login);
    });
  }

}
