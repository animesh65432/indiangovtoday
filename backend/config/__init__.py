from dotenv import load_dotenv
import os

load_dotenv()

config = {
    "INDIAN_GOVERMENT_BASE_URL": "https://www.pib.gov.in/Allrel.aspx?lang=1",
    "MONGODB_URL": os.getenv("MONGODB_URL"),
    "UPSTASH_REDIS_REST_URL" : os.getenv("UPSTASH_REDIS_REST_URL"),
    "UPSTASH_REDIS_REST_TOKEN": os.getenv("UPSTASH_REDIS_REST_TOKEN"),
    "GROQ_API_KEY":os.getenv("GROQ_API_KEY")
}