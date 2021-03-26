import base64
import pymongo
import codecs
import csv
from PIL import Image
import json
import time
from bson.objectid import ObjectId
import random

connect = pymongo.MongoClient("localhost",27017) #ip,port
db = connect.goti #db명
collection = db.comments #콜렉션 명

_id_list = db.users.find({},{"_id":True})
tmp=[]
for _i in _id_list:
	tmp.append(_i)
f_id_list = db.facilities.find({},{"_id":True})
tmp_t=[]
for _i in f_id_list:
	tmp_t.append(_i)

for index in range(0, 5000):
	collection.insert({
	    "title": "comment"+str(index),
	    "contents": "contents"+str(index),
	    "date": "2015-12-14",
	    "time": "24:24:24",
	    "good": random.randint(0, 20),
	    "bad": random.randint(0, 20),
	    "score": random.randint(1, 5),
	    "f_id": tmp_t[random.randint(0, len(tmp_t)-1)]["_id"], 
	    "u_id": "test_user"+str(index),
	    "object_u_id": tmp[random.randint(0, len(tmp)-1)]["_id"],
	    "eval_user_list":[]
	})
