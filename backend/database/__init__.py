from config import config
from pymongo import MongoClient

client = MongoClient(config["MONGODB_URL"])

db = client["IndianGovtAnnouncements"]
users = db["users"]
saves = db["saves"]

