type Env = "PROD" | "dev";

export const API_BASE_URL = "https://indiangovtoday-stpy.vercel.app"
export const env: Env = process.env.NODE_ENV === "production" ? "PROD" : "dev";
export const LocalhostUrl = "http://127.0.0.1:8000"