import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class AuthService {

    private isLoggedin: boolean;
    private AuthToken:any;
    //private serverUrl:string = "http://114.200.200.151:3000/";
    private serverUrl:string = "http://13.209.98.30:3000/";
    private addUserUrl:string = this.serverUrl+"adduser";//
    private authUrl:string = this.serverUrl+"authenticate";
    private FbUrl:string = this.serverUrl+"fb";
    private GgUrl:string = this.serverUrl+"gg";
    private validId:string = this.serverUrl+"validId";

    private autoLoginUrl:string = this.serverUrl+"auto_login";

    private findIdUrl:string = this.serverUrl+"find_id";
    private findPasswordUrl:string = this.serverUrl+"find_password";

    private registerTokenUrl:string = this.serverUrl+"register_token"

    constructor(public http: Http) {
        this.isLoggedin = false;
        this.AuthToken = null;
    }

    registerToken(token){
      let body = {
        token:token
      }
      return new Promise(resolve => {
          this.http.post(this.registerTokenUrl,body).subscribe(data => {
            resolve(data.json());
          },err=>{
            resolve(err);
          });
      });
    }

    autoLogin(token){
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' +token);
      let options = new RequestOptions({ headers: headers });
      return new Promise(resolve => {
          this.http.get(this.autoLoginUrl,options).subscribe(data => {
            resolve(data.json());
          },err=>{
            resolve(err);
          });
      });
    }

    findId(name,date,gender,email,address){
      let body = {
        name: name,
        date: date,
        gender: gender,
        email: email,
        address: address
      }
      return this.http.post(this.findIdUrl, body).map(res =>
        res.json());
    }

    findPassword(id, name, mail, date, gender,email,address){
      let body = {
        id:id,
        name:name,
        mail:mail,
        date:date,
        gender:gender,
        email:email,
        address: address
      }
      return this.http.post(this.findPasswordUrl, body).map(res =>
        res.json());
    }

    duplicateId(id){
      let body = {
        id:id
      }
      return this.http.post(this.validId, body).map(res =>
        res.json());
    }

    storeUserCredentials(token) {
        window.localStorage.setItem('myToken', token);
        this.useCredentials(token);
    }

    useCredentials(token) {
        this.isLoggedin = true;
        this.AuthToken = token;
    }

    loadUserCredentials() {
        var token = window.localStorage.getItem('myToken');
        this.useCredentials(token);
    }

    destroyUserCredentials() {
        this.isLoggedin = false;
        this.AuthToken = null;
        window.localStorage.clear();
    }

    authenticate(user) {
      let creds = {
        u_id: user.name,
        password: user.password
      }
      let headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      let options = new RequestOptions({ headers: headers });
        return new Promise(resolve => {
            this.http.post(this.authUrl, creds, options).subscribe(data => {
                if(data.json().success){
                    //console.log(data.json().token);
                    this.storeUserCredentials(data.json().token);
                    resolve(true);
                }
                else{
                  console.log("aaads");
                }
            },err=>{
              //console.log(err.json().msg)
              resolve(err.json().msg);
            });
        });
    }

    FBsign(token) {
      let body = {
        token: token
      }
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      let options = new RequestOptions({ headers: headers });
        return new Promise(resolve => {
            this.http.post(this.FbUrl, body, options).subscribe(data => {
                if(data.json().success){
                    console.log(data.json().token);
                    this.storeUserCredentials(data.json().token);
                    resolve(true);
                }
                else
                    resolve(false);
            });
        });
    }

    GGsign(token){
      let body = {
        token: token
      }
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      let options = new RequestOptions({ headers: headers });
        return new Promise(resolve => {
            this.http.post(this.GgUrl, body, options).subscribe(data => {
                if(data.json().success){
                    console.log(data.json().token);
                    this.storeUserCredentials(data.json().token);
                    resolve(true);
                }
                else
                    resolve(false);
            });
        });
    }

    adduser(user) { //로컬 서버 가입
        let creds = {
          u_id: user.u_id,
          password: user.password,
          birthday: user.month,
          gender: user.gender,
          email: user.email,
          phone: user.phone,
          address: user.address,
          name: user.name
        }
        //ssl 통신 사용할 것
        //password에 대해서 sha 기능 추가 할 것
        let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        let options = new RequestOptions({ headers: headers });
        return new Promise(resolve => {
            this.http.post(this.addUserUrl, creds, options).subscribe(data => {
              console.log(data);
                if(data.json().success){
                    resolve(true);
                }
                else
                    //중복 id 처리
                    //에러 처리 추가 할 것
                    resolve(false);
            });
        });
    }

    getinfo() {
        return new Promise(resolve => {
            var headers = new Headers();
            this.loadUserCredentials();
            console.log(this.AuthToken);
            headers.append('Authorization', 'Bearer ' +this.AuthToken);
            let options = new RequestOptions({ headers: headers });
            this.http.get('http://localhost:3333/getinfo', options).subscribe(data => {
                if(data.json().success)
                    resolve(data.json());
                else
                    console.log("false auth");
                    resolve(false);
            });
        })
    }

    logout() {
        this.destroyUserCredentials();
    }
}
