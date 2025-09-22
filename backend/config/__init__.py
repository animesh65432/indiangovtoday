from dotenv import load_dotenv
import os

load_dotenv()

config = {
    "INDIAN_GOVERMENT_BASE_URL": "https://www.pib.gov.in/Allrel.aspx?lang=1",
    "MONGODB_URL": os.getenv("MONGODB_URL")
}