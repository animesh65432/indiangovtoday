import os
from pymongo import MongoClient


mongo_url = os.getenv("MONGODB_URL")

client = MongoClient(mongo_url)

db = client["IndianGovtAnnouncements"]
announcements_collection = db["announcements"]

