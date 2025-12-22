import { Request, Response } from "express"
import { asyncErrorHandler } from "../middleware/asyncErrorHandler"
import { connectDB } from "../db"
import { ObjectId } from "mongodb";
import { redis } from "../services/redis"
import { LANGUAGE_CODES } from "../utils/lan"


export const GetIndiaAnnouncements = asyncErrorHandler(async (req: Request, res: Response) => {
    const { target_lan, startdate, endDate, page, limit } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const announcementsStartDate = startdate
        ? new Date(startdate as string)
        : new Date(new Date().setDate(new Date().getDate() - 7));

    const announcementsEndDate = endDate ? new Date(endDate as string) : new Date();

    const targetLanguage = (target_lan as string) || "English";

    const redis_key = `Announcements_${targetLanguage}_${announcementsStartDate.toISOString()}_${announcementsEndDate.toISOString()}_page${pageNumber}_limit${pageSize}`;
    const cached_data = await redis.get(redis_key);

    if (cached_data && typeof cached_data === "string") {
        res.status(200).json(JSON.parse(cached_data));
        return
    }

    const db = await connectDB();

    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);

    const filter = {
        date: { $gte: start, $lte: end },
        language: targetLanguage
    };

    const annoucments = await db.collection("Translated_Announcements").
        find(filter, {
            projection: {
                content: 0,
                language: 0,
                source_link: 0,
                _id: 0
            }
        })
        .skip(skip)
        .limit(pageSize)
        .toArray()

    const totalCount = await db.collection("Translated_Announcements").countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    const responseData = {
        success: true,
        data: annoucments,
        pagination: {
            page: pageNumber,
            totalPages,
            totalCount,
            pageSize,
        },
    };

    await redis.set(redis_key, JSON.stringify(responseData), { ex: 300 });

    res.status(200).json(responseData);
    return
});

export const SerachallIndiaAnnouncements = asyncErrorHandler(async (req: Request, res: Response) => {
    const { target_lan, startdate, endDate, page, limit, SearchInput } = req.query;

    const announcementsStartDate = startdate
        ? new Date(startdate as string)
        : new Date(new Date().setDate(new Date().getDate() - 7));

    const announcementsEndDate = endDate
        ? new Date(endDate as string)
        : new Date();

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    if (!SearchInput || (typeof SearchInput === 'string' && SearchInput.trim().length < 3)) {
        res.status(400).json({ error: "Search query must be at least 3 characters long" });
        return;
    }

    if (isNaN(announcementsStartDate.getTime()) || isNaN(announcementsEndDate.getTime())) {
        res.status(400).json({ error: "Invalid date format" });
        return;
    }

    const targetLanguage = (target_lan as string) || "English";

    const redis_key = `AllGroupsIndiaAnnouncements_${targetLanguage}_${announcementsStartDate.toISOString().split('T')[0]}_${announcementsEndDate.toISOString().split('T')[0]}${page}${limit}${SearchInput}`;

    const cached_data = await redis.get(redis_key);

    if (cached_data) {
        const parsedData = typeof cached_data === 'string'
            ? JSON.parse(cached_data)
            : cached_data;
        res.status(200).json(parsedData);
        return;
    }

    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);

    const filter: any = {
        date: { $gte: start, $lte: end },
        language: targetLanguage,

    };

    if (SearchInput) {
        const searchRegex = new RegExp(SearchInput as string, "i");
        filter["language"] = targetLanguage;
        filter.$or = [
            { "title": searchRegex },
            { "description": searchRegex },
        ];

    }

    const db = await connectDB();


    const indiaAnnouncements = await db
        .collection("Translated_Announcements")
        .find(filter, {
            projection: {
                content: 0,
                language: 0,
                source_link: 0
            }
        })
        .skip(skip)
        .limit(pageSize)
        .toArray();

    const totalCount = await db.collection("Translated_Announcements").countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    const responseData = {
        success: true,
        data: indiaAnnouncements,
        pagination: {
            page: pageNumber,
            totalPages,
            totalCount,
            pageSize,
        },
    };

    await redis.set(redis_key, JSON.stringify(responseData), { ex: 300 });

    res.status(200).json(responseData);
    return
});

export const GetIndiaAnnouncement = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id, target_lan } = req.query;

    if (!id || typeof id !== "string") {
        res.status(400).json({ message: "Missing or invalid id" });
        return;
    }

    const targetLanguage = (target_lan as string) || "English";

    const redis_key = `Announcement_${targetLanguage}_${id}_${target_lan}`;
    const cached_data = await redis.get(redis_key);

    if (cached_data) {
        const parsedData = typeof cached_data === "string" ? JSON.parse(cached_data) : cached_data;
        res.status(200).json(parsedData);
        return;
    }

    let objectId: ObjectId;
    try {
        objectId = new ObjectId(id);
    } catch {
        res.status(400).json({ message: "Invalid ObjectId format" });
        return;
    }

    const db = await connectDB();


    const announcement = await db
        .collection("Translated_Announcements")
        .find({
            announcementId: objectId,
            language: targetLanguage
        }, {
            projection: {
                description: 0,
                title: 0,
                language: 0,
                date: 0,
                _id: 0
            }
        }).toArray()


    if (!announcement) {
        res.status(404).json({ error: "Announcement not found" });
        return;
    }

    const responseData = {
        success: true,
        data: announcement[0],
        languageCode: LANGUAGE_CODES[targetLanguage] || "en"
    };

    await redis.set(redis_key, JSON.stringify(responseData), { ex: 300 });

    res.status(200).json(responseData);
    return
});