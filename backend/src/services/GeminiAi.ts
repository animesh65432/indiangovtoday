import { GoogleGenAI } from "@google/genai";
import config from "../config";

export const GeminiAI = new GoogleGenAI({
    apiKey: config.GEMINI_API_KEY
});