from sarvamai import SarvamAI
from config import config

SarvamAIclient = SarvamAI(
    api_subscription_key=config["SARVAMAI"],
)