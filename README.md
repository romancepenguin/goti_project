# goti_project
- 액티비티(놀이공원, 워터파크, 박물관 등)을 중계하는 O2O 플랫폼 서비스
- Angular 기반의 하이브리드 웹 앱

## 기능
- PASS권 온라인 결재
- 페이스북, 구글 소셜 가입 및 로그인
- O2O 서비스 조회 및 검색
- O2O 서비스 예약 및 결재
- 예약 현황 조회 및 마이페이지
- 머신러닝(FP-growth, 협업필터링) 분석을 통한 사용자 맞춤 추천 O2O 서비스 제공

## 기술 스택
![image](https://user-images.githubusercontent.com/28975774/112632465-80535a80-8e7b-11eb-864f-787b902b5048.png)

## 의존성
App & Server
- nodejs : v12.20.2
- npm : 7.6.3

ml(머신러닝)
- Spark : 2.4.7
- Python : 3.6.x

DB
- mongo : 4.4.4
- firebase

## Usage
본 문서에서 제공되지 않는 가이드
- mongoDB, firebase 구축 및 연동
- 소셜로그인 연동(google, facebook 개발자 사이트를 참조하세요.)
- Cordova 빌드(https://ionicframework.com/docs/cli/commands/cordova-build)
- iamport 결재 서비스 연동

App(하이브리드 앱)
```sh
cd app
npm install --legacy-peer-deps
npm run ionic:serve
curl http://127.0.0.1:8100/
```

Server
```sh
cd server
npm install
npm start
curl http://127.0.0.1:3000/
```

ml(머신러닝)
```sh
cd ml
spark-2.4.7-bin-hadoop2.7
python3.6.9
./spark-submit col.py
./spark-submit fp.py
```

## DEMO
URL : http://13.124.42.129:3000/web/index.html
> Note: AWS 서버 사용중으로 사정에 따라 다운할수도 있기 때문에, 접근 안될 수도 있습니다.
LOCK된 기능
- 온라인 결재
- 추천 서비스
- 소셜 로그인
- 현재 위치 기반 서비스

## 구동 이미지
![image](https://user-images.githubusercontent.com/28975774/112716893-6de52980-8f2c-11eb-8cdd-41dc6b879814.png)
![image](https://user-images.githubusercontent.com/28975774/112716896-73db0a80-8f2c-11eb-8ef0-b3e900a1dadb.png)
![image](https://user-images.githubusercontent.com/28975774/112716902-7a698200-8f2c-11eb-89ae-c1805de135ee.png)
![image](https://user-images.githubusercontent.com/28975774/112716906-7dfd0900-8f2c-11eb-867b-5085546a641e.png)
![image](https://user-images.githubusercontent.com/28975774/112716908-835a5380-8f2c-11eb-8dbb-1230c952389d.png)




