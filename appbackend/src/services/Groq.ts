import Groq from "groq-sdk";
import config from "../config";

export const groq = new Groq({ apiKey: config.GROQ_API_KEY });