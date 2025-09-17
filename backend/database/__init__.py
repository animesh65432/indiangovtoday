from config import config
from pymongo import MongoClient

client = MongoClient(config["MONGODB_URL"])

db = client["IndianGovtAnnouncements"]
announcements_collection = db["announcements"]

