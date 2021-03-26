import base64
import pymongo
import codecs
import csv
from PIL import Image
import json
import time
from bson.objectid import ObjectId


def convert(image): # image->base64
	if(image == ""):
		return ""
	fi = open(image,'rb')
	data = fi.read()
	fi.close()
	string = base64.b64encode(data)	
	return string


def resize(image,size): # image resize
	try:
		im = Image.open(image)
	except FileNotFoundError as e:
		print(str(e))
	else:
		rim=im.resize((size+int(size/4),size))
		rim.save(image)

resize("/home/ubuntu/테스트 데이터 생성/null.jpg",140)


connect = pymongo.MongoClient("localhost",27017) #ip,port
db = connect.goti #db명
collection = db.users # 콜렉션 명
#500명
for index in range(0,50):
	collection.insert({
		"u_id":"test_user"+str(index),
		"pasword":"0",
		"name":"test_user"+str(index),
		"birthday":"19"+str((index)%100)+"-01-01",
 		"gender":str(index%2),
		"email":"test_user"+str(index)+"@aa.com",
		"phone":"01043355309",
		"photo":convert("/home/ubuntu/테스트 데이터 생성/null.jpg"),
		"pass":10000,
		"point":100,
		"sign_date":"2017-05"
	})
