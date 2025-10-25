import { Request, Response } from "express"
import { asyncerrorhandler } from "../middleware/ayncerrorhandler"
import { connectDB } from "../db"
import { ObjectId } from "mongodb";
import { redis } from "../services/redis"
import { translateannouncements, TranslatedAnnouncement } from "../utils/translateannouncements"
import { translateannouncement, translatedAnnouncementTypes } from "../utils/translateannouncement"

export const GetIndiaAnnouncements = asyncerrorhandler(async (req: Request, res: Response) => {
    const { target_lan, startdate, endDate } = req.query;

    const announcementsStartDate = startdate
        ? new Date(startdate as string)
        : new Date(new Date().setDate(new Date().getDate() - 7));

    const announcementsEndDate = endDate
        ? new Date(endDate as string)
        : new Date();

    // const redis_key = `Announcements_${target_lan || "English"}_${announcementsStartDate.toISOString()}_${announcementsEndDate.toISOString()}`;

    // const cached_data = await redis.get(redis_key);

    // if (cached_data) {
    //     res.status(200).json(cached_data);
    //     return;
    // }

    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);

    const filter: any = {
        created_at: { $gte: start, $lte: end }
    };

    const db = await connectDB();


    let indiaAnnouncements = await db
        .collection("announcements")
        .aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$type",
                    announcements: { $push: "$$ROOT" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    type: "$_id",
                    announcements: { $slice: ["$announcements", 3] },
                    count: 1,
                    _id: 0,
                    created_at: 1,
                }
            },
            { $sort: { type: -1 } }
        ])
        .toArray() as { type: string, announcements: TranslatedAnnouncement[] }[];


    // await redis.set(redis_key, JSON.stringify(indiaAnnouncements), { ex: 300 });

    res.status(200).json(indiaAnnouncements);
    return;
});

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