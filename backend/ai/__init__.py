from config import config
from groq import Groq

GroqClient = Groq(
    api_key=config["GROQ_API_KEY"]
)

