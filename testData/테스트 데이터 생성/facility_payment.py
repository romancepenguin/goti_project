import base64
import pymongo
import codecs
import csv
from PIL import Image
import json
import time
from bson.objectid import ObjectId
import random
import bson

#지불내역 만개 // 아이템 지불내역 삼만개

connect = pymongo.MongoClient("localhost",27017) #ip,port
db = connect.goti #db명

item_id_query = db.items.find({},{"_id":True,"f_id":True,"item_name":True})
item_id_list = []
for _i in item_id_query:
	item_id_list.append(_i)

facility_id_query = db.facility.find({},{"_id":True})
facility_id_list = []
for _i in facility_id_query:
	facility_id_list.appned(_i)

u_id_query = db.users.find({},{"_id":True})
u_id_list = []
for _i in u_id_query:
	u_id_list.append(_i)
#팔만
for index in range(0, 5000):
	tmp_object_u_id = u_id_list[random.randint(0, len(u_id_list)-1)]["_id"]
	#tmp_f_id = facility_id_list[random.randint(0, len(facility_id_list)-1)]["_id"]

	random.seed()
	random_item = random.randint(0, len(item_id_list)-1)
	tmp_f_id = item_id_list[random_item]["f_id"]
	tmp_item_id = item_id_list[random_item]["_id"]
	tmp_item_name = item_id_list[random_item]["item_name"]
	year=random.randint(2016, 2017)
	"{0:0>4}".format(year)
	month=random.randint(1, 12)
	month = "{0:0>2}".format(month)
	day=random.randint(1, 31)
	day = "{0:0>2}".format(day)
	date = str(year)+"-"+str(month)+"-"+str(day)

	facility_payment_id = db.facility_payment.insert({
		"date":date,
		"time":"24:24:24",
		"object_u_id":tmp_object_u_id,
		"f_id":tmp_f_id,
		"order_id_list":[]
	})


	use_count = random.randint(0, 10)
	order_id = db.order_items.insert({
		"item_id":tmp_item_id,
		"object_u_id":tmp_object_u_id,
		"f_id":tmp_f_id,
		"item_name":tmp_item_name,
		"count":1, 
		"pass_payment":1,
		"use_count":use_count, 
		"use":True,
		"cancel_date":[],
		"use_date":[]
	})

	db.facility_payment.update({"_id":facility_payment_id},{'$push':{"order_id_list":order_id}})
		
	for k in range(0, use_count):
		random.seed()
		#year=random.randint(2016, 2017)
		year=2016
		"{0:0>4}".format(year)
		month=random.randint(1, 12)
		month = "{0:0>2}".format(month)
		day=random.randint(1, 31)
		day = "{0:0>2}".format(day)
		date = str(year)+"-"+str(month)+"-"+str(day)

		hour=random.randint(0,24)
		hour = "{0:0>2}".format(hour)
		min_=random.randint(0,24)
		min_ = "{0:0>2}".format(min_)
		sec=random.randint(0,24)
		sec = "{0:0>2}".format(sec)
		time = str(hour)+":"+str(min_)+":"+str(sec)

		count = random.randint(0, 10)

		data = {"date":date,"count":count}
		db.order_items.update({"_id":order_id},{'$push':{"use_date":{"date":date,"time":time,"count":count}}})
		

	#tmp[random.randint(0, len(tmp))]["_id"] #유저 오브젝트 id

