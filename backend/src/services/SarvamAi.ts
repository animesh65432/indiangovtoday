import { SarvamAIClient } from "sarvamai";
import config from "../config"

export const sarvamai = new SarvamAIClient({ apiSubscriptionKey: config.SARVAMAI });