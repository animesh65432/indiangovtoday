type Env = "PROD" | "dev";

export const API_BASE_URL = "https://indiangovtoday-hmfd.vercel.app"
export const env: Env = process.env.NODE_ENV === "production" ? "PROD" : "dev";
export const LocalhostUrl = "http://localhost:3000"
export const NEXT_PUBLIC_IMAGEKIT_URL = "https://ik.imagekit.io/jvube2rki"