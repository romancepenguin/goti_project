# goti_project
- 액티비티(놀이공원, 워터파크, 박물관 등)을 중계하는 O2O 플랫폼 서비스
- Angular 기반의 하이브리드 웹 앱

## 기능
- ~~PASS권 온라인 결재~~ 해당 기능 잠겨 있음.
- ~~페이스북, 구글 소셜 가입 및 로그인~~ 해당 기능 잠겨 있음.
- O2O 서비스 조회 및 검색
- O2O 서비스 예약 및 결재
- 예약 현황 조회 및 마이페이지
- 머신러닝(FP-growth, 협업필터링) 분석을 통한 사용자 맞춤 추천 O2O 서비스 제공

## 기술 스택
![image](https://user-images.githubusercontent.com/28975774/112632465-80535a80-8e7b-11eb-864f-787b902b5048.png)

## 환경
- nodejs : v12.20.2
- npm : 7.6.3
- mongo : 4.4.4

## Usage
app 테스트
```sh
npm install -g @ionic/cli
npm install --legacy-peer-deps
npm run ionic:serve
```
접속 http://127.0.0.1:8100/

server
npm install
npm start

ml
spark-2.4.7-bin-hadoop2.7
python3.6.9
export PYSPARK_PYTHON=python3
./spark-submit col.py
./spark-submit fp.py

testData

## 이미지
