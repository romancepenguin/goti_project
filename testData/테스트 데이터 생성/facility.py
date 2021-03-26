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
collection = db.facilities # 콜렉션 명
collection_item = db.items # 콜렉션 명

for index in range(0,15):
	_id = collection.insert({
		"bname":"test_facility"+str(index),
		"banner":convert("/home/ubuntu/테스트 데이터 생성/null.jpg"),
		"context":"context"+str(index),
		"weekday":{
			"open":"00:00",
			"close":"00:00",		
		},
		"weekend":{
			"open":"00:00",
			"close":"00:00",		
		},
		"picture":[convert("/home/ubuntu/테스트 데이터 생성/null.jpg"),
				convert("/home/ubuntu/테스트 데이터 생성/null.jpg")],
		"adr":{
			"si_do":"서울특별시",
			"si_gun_goo":"강남구",
			"town":"마장동",
			"numb":"100호"
		},
		"loc":{
			"lat":index,
			"lon":index
		},	
		"phone":"01044566668",
		"kind":["레저","수상"],
		"score":2.5,
		"max_pass":10,
		"min_pass":1,
		"item_id_list":[]
	})
	for j in range(0,10):
		_id_item = collection_item.insert({
			"item_name":"item_name"+str(j),
			"pass":j+1,
			"enrol_date":"2017-10-21",
			"enrol_time":"23:21:23",
			"active":True,
			"f_id":_id
		})
		collection.update({"_id":ObjectId(_id)},{
			'$push':{"item_id_list":_id_item}
		})

