import base64
import pymongo
import codecs
import csv
from PIL import Image
import json
import time
from bson.objectid import ObjectId


connect = pymongo.MongoClient("localhost",27017) #ip,port
db = connect.goti #db명

db.order_items.drop()
db.comments.drop()
db.facilities.drop()
db.items.drop()
db.facility_payment.drop()
