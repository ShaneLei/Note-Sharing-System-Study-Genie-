from pymongo import MongoClient
import string
import random

client = MongoClient()
db = client.aw
logins = db.logins
logins.insert_one({'userid': '1', 'password': 'abc'})

token = ''.join(random.choices(string.ascii_uppercase + string.digits, k=20))
logins.update({'userid': '1', 'password': 'abc'}, {'$set': {"token": token}})
print(logins.find_one({"userid": "1", 'password': 'abc'}))