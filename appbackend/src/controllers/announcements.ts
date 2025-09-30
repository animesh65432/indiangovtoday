import { Request, Response } from "express"
import { asyncerrorhandler } from "../middleware/ayncerrorhandler"
import { connectDB } from "../db"
import { ObjectId } from "mongodb";
import { redis } from "../services/redis"
import { translateannouncements, TranslatedAnnouncement } from "../utils/translateannouncements"
import { translateannouncement, translatedAnnouncementTypes } from "../utils/translateannouncement"

export const GetIndiaAnnnouncements = asyncerrorhandler(async (req: Request, res: Response) => {
    const { target_lan, Currentdate } = req.query

    // const redis_key = `Annnouncements${target_lan ? target_lan : "English"}${Currentdate ? "_" + Currentdate : ""}`;


    // const cached_data = await redis.get(redis_key)

    // if (cached_data) {
    //     res.status(200).json(cached_data)
    //     return
    // }
    let filter: any = {};

    if (Currentdate) {
        const start = new Date(Currentdate as string);
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date(Currentdate as string);
        end.setUTCHours(23, 59, 59, 999);

        filter.created_at = { $gte: start, $lte: end };
    }

    const db = await connectDB();


    let IndiaAnnnouncements = await db.collection("announcements").find(filter).sort({ _id: -1 }).toArray() as TranslatedAnnouncement[];

    console.log(IndiaAnnnouncements, "IndiaAnnnouncements")

    if (target_lan && target_lan !== "English") {
        IndiaAnnnouncements = await translateannouncements(IndiaAnnnouncements, String(target_lan));
    }

    // await redis.set(redis_key, IndiaAnnnouncements, { ex: 300 });

    res.status(200).json(IndiaAnnnouncements);
    return
})


export const GetIndiaAnnouncement = asyncerrorhandler(async (req: Request, res: Response) => {
    const { id, target_lan } = req.query;

    if (!id || typeof id !== "string") {
        res.status(400).json({
            message: "Missing or invalid id",
        });
        return
    }

    const redis_key = `Annnouncement${target_lan ? target_lan : "English"}-${id}`

    const cached_data = await redis.get(redis_key)

    if (cached_data) {
        res.status(200).json(cached_data)
        return
    }


    const db = await connectDB();

    let objectId: ObjectId;
    try {
        objectId = new ObjectId(id);
    } catch (err) {
        res.status(400).json({
            message: "Invalid ObjectId format",
        });
        return
    }

    let IndiaAnnnouncement = await db.collection("announcements").findOne({ _id: objectId }) as translatedAnnouncementTypes;


    if (!IndiaAnnnouncement) {
        res.status(404).json({ error: "Not found" });
        return
    }

    if (target_lan && target_lan !== "English") {
        IndiaAnnnouncement = await translateannouncement(IndiaAnnnouncement, String(target_lan))
    }

    await redis.set(redis_key, IndiaAnnnouncement, { ex: 300 });

    res.status(200).json(IndiaAnnnouncement);
    return
});