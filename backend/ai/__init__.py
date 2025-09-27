from config import config
from groq import AsyncGroq

GroqClient = AsyncGroq(
    api_key=config["GROQ_API_KEY"]
)

