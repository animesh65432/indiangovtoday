import config from "../config";
import { MongoClient, Db } from "mongodb";


const client = new MongoClient(config.ALERTS_DATABASE_URL as string);

let db: Db | null = null;

export async function connectDB() {
    try {
        if (!db) {
            await client.connect();
            db = client.db("IndianGovtAnnouncements");
            console.log("✅ Connected to MongoDB");
        }
        return db;
    } catch (err) {
        console.error("❌ DB connection error:", err);
        throw err;
    }
}