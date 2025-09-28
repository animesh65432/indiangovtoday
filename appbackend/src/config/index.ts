import "dotenv/config";

const config = {
    INDIAN_GOVERMENT_BASE_URL: "https://www.pib.gov.in/Allrel.aspx?lang=1",
    MONGODB_URL: process.env.MONGODB_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    SARVAMAI: process.env.SARVAMAI,
    SCRAPERAPI: process.env.SCRAPERAPI,
    PORT: 3000
};

export default config;
