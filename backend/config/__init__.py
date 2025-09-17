from dotenv import load_dotenv
import os

load_dotenv()

config = {
    "INDIAN_GOVERMENT_BASE_URL": "https://www.india.gov.in/news_lists",
    "MONGODB_URL": os.getenv("MONGODB_URL")
}