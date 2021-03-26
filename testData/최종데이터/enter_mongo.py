#-*- coding: utf-8 -*-
import base64
import pymongo
import codecs
import csv
from PIL import Image, ImageFile
import json
import time
from bson.objectid import ObjectId
import os

ImageFile.LOAD_TRUNCATED_IMAGES = True

def convert(image):
	if(image == ""):
		return ""
	fi = open(image,'rb')
	data = fi.read()
	fi.close()

	string = base64.b64encode(data)
	
	return string
    #디코더
    #convert = base64.b64decode(string)

    #t = open("example.png", "w+")
    #t.write(convert)
    #t.close()


def resize(image,size):
	try:
		im = Image.open(image)
	except FileNotFoundError as e:
		print(str(e))
	else:
		rim=im.resize((size+int(size/4),size))
		rim.save(image)

if __name__ == "__main__":


	connect = pymongo.MongoClient("localhost",27017) #ip,port

	db = connect.goti #db명
	collection = db.facilities # 콜렉션 명
	collection_item = db.items # 콜렉션 명
	ipath = os.getcwd()+"/"


	f = codecs.open(ipath+"activity.csv","r","EUC-KR")
	csv_f = csv.reader(f)
	start = 0
	id_num = collection.count()

	for row in csv_f:
		if(start == 0 ):
			start+=1
		else:	
			print(row)
			id_num += 1
			bname = row[0]
			#print(ipath+row[0]+"/"+row[1]+".png")
			if os.path.isfile(ipath+row[0]+"/"+row[1]+".png"):
				resize(ipath+row[0]+"/"+row[1]+".png",180)
				banner = convert(ipath+row[0]+"/"+row[1]+".png")
			else:
				resize(ipath+row[0]+"/"+row[1]+".jpg",180)
				print("true")
				banner = convert(ipath+row[0]+"/"+row[1]+".jpg")
			context = row[2]

			weekday_open = row[3]
			weekday_close = row[4]
			weekend_open = row[5]
			weekend_close = row[6]

			pic = []
			pic = row[7].split(",")
			picture = []
			y = 0
			if(len(pic)!=1):
				for i in range(0,len(pic)):
					#print(pic[i]+".png")
					if pic[i].startswith(" "):
						pic[i] = pic[i][1:] #첫번째가 " "임을 검사
					if os.path.isfile(ipath+row[0]+"/"+row[1]+".png"):
						resize(ipath+row[0]+"/"+pic[i]+".png",450)
						picture.append(convert(ipath+row[0]+"/"+pic[i]+".png"))
					else:
						resize(ipath+row[0]+"/"+pic[i]+".jpg",450)
						picture.append(convert(ipath+row[0]+"/"+pic[i]+".jpg"))

			si_do = row[8]	
			si_gun_goo = row[9]
			town = row[10]
			numb = row[11]

			lat = row[12]
			lon = row[13]

			phone = row[14]

			kind_list=row[15].split(",")
			kind = []
			for k in kind_list:
				tmp3 = k.split(" ")
				kind.append(tmp3[0])
			#item_sort = ["수상","육상","휴양","체험","항공"] # 0 1 2 3 4

			#kind2 = row[16]
			kind_list=row[16].split(",")
			kind2 = kind_list
			items = row[17]
			item_list = items.split("\n")

			#score = row[17]
			score = 2.5
			#score = 2.5
			print(lat)
			#print(convert("/home/penguin/bear_banner.jpg"))

			max_pass=0
			min_pass=9999999999
			for item_i in item_list:
				tmp_list = item_i.split("#")
				print(tmp_list)
				if(tmp_list[0] == ""):
					print(item_list)
					item_list.remove('')
				else:
					#print(item_list)
					if(int(tmp_list[1])>max_pass):
						max_pass=int(tmp_list[1])
					if(int(tmp_list[1])<min_pass):
						min_pass=int(tmp_list[1])
			'''
			print(bname)
			print(context)
			print(weekday_open)
			print(weekday_close)
			print(weekend_open)
			print(weekend_close)
			print(si_do)
			print(si_gun_goo)
			print(town)
			print(numb)
			print(float(lat))
			print(float(lon))
			print(phone)
			print(kind)
			print(score)
			print(max_pass)
			print(min_pass)
			print(item_list)
			'''

			_id = collection.insert({
				"bname":bname,
				"banner":banner,
				"context":context,
				"picture":picture,
				"weekday":{
					"open":weekday_open,					
					"close":weekday_close
				},
				"weekend":{
					"open":weekend_open,
					"close":weekend_close
				},
				"adr":{
					"si_do":si_do,
					"si_gun_goo":si_gun_goo,
					"town":town,
					"numb":numb
				},
				"loc":{
					"lat":float(lat),
					"lon":float(lon)
				},
				"item_id_list":[],
				"phone":phone,
				"kind":kind,
				"kind2":kind2,
				"score":score,
				"max_pass":max_pass,
				"min_pass":min_pass,
			})


			#print(type(_id))
			now = time.localtime()
			s = "%04d-%02d-%02d" % (now.tm_year, now.tm_mon, now.tm_mday)
			t = "%02d:%02d:%02d" % (now.tm_hour, now.tm_min, now.tm_sec)

			for item_i in item_list:
				tmp_list = item_i.split("#")
				key = tmp_list[0]
				_id_item=collection_item.insert({
					"enrol_date":s,
					"enrol_time":t,
					"item_name":key[0:len(key)-1],
					"pass":tmp_list[1],
					"active":True,
					"f_id":_id						
				})
				collection.update({"_id":ObjectId(_id)},{
					'$push':{"item_id_list":_id_item}
				})



	f.close()
#{ "_id" : ObjectId("58f205fe91e71ef0afa28440") }
#{ "_id" : ObjectId("58f20cd824f7ca1c39dd1456"), "name" : "북극의 신사" }


