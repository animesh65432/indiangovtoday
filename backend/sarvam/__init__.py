from sarvamai import SarvamAI
from config import config

SarvamAIClient = SarvamAI(
    api_subscription_key=config["SARVAMAI"],
)