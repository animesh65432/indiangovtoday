import { asyncErrorHandler } from "../middleware/asyncErrorHandler"
import { connectDB } from "../db"
import { redis } from "../services/redis"
import { LANGUAGE_CODES } from "../utils/lan"
import { ObjectId } from "mongodb"

const addSave = asyncErrorHandler(async (req, res) => {
    const userId = req.user?._id
    const { announcementId } = req.body

    if (!userId || !announcementId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
        return
    }
    const db = await connectDB()

    const savesCollection = db.collection("saves")

    const existingSave = await savesCollection.findOne({
        userId: userId,
        announcementId: announcementId,
    })

    if (existingSave) {
        res.status(400).json({
            success: true,
            message: "Already saved"
        })
        return
    }

    await savesCollection.insertOne({
        userId: userId,
        announcementId: announcementId,
    })

    res.json({
        success: true,
        message: "Saved successfully"
    })
    return
})

const removeSave = asyncErrorHandler(async (req, res) => {
    const userId = req.user?._id
    const { announcementId } = req.query

    if (!userId || !announcementId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
        return
    }
    const db = await connectDB()

    const savesCollection = db.collection("saves")

    await savesCollection.deleteOne({
        userId: userId,
        announcementId: announcementId,
    })

    res.json({
        success: true,
        message: "Removed from saves successfully"
    })

    return
})

const getSavedAnnouncements = asyncErrorHandler(async (req, res) => {
    const userId = req.user?._id
    const { page = 1, limit = 10, lan } = req.query

    if (!userId || !lan) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
        return
    }

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const targetLanguage = LANGUAGE_CODES[lan as string] || "en";


    const redis_key = `SavedAnnouncements_${userId}_${targetLanguage}_page${page}_limit${limit}`;
    const cached_data = await redis.get(redis_key);

    if (cached_data && typeof cached_data === "string") {
        res.status(200).json(JSON.parse(cached_data));
        return
    }

    const db = await connectDB()
    const savesCollection = db.collection("saves")

    const savedRecords = await savesCollection
        .find({ userId: new ObjectId(userId) })
        .toArray();


    const announcementIds = savedRecords.map(save => new ObjectId(save.announcementId));

    if (announcementIds.length === 0) {
        const emptyResponse = {
            success: true,
            data: [],
            pagination: {
                page: pageNumber,
                totalPages: 0,
                totalCount: 0,
                pageSize,
            },
        };

        await redis.set(redis_key, JSON.stringify(emptyResponse), { ex: 300 });
        res.status(200).json(emptyResponse);
        return
    }


    const announcements = await db.collection("Translated_Announcements")
        .find({
            announcementId: { $in: announcementIds },
            language: targetLanguage
        }, {
            projection: {
                sections: 0,
                language: 0,
                source_link: 0,
                _id: 0
            }
        })
        .sort({ date: -1, _id: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray();


    const totalCount = await db.collection("Translated_Announcements")
        .countDocuments({
            announcementId: { $in: announcementIds },
            language: targetLanguage
        });

    const totalPages = Math.ceil(totalCount / pageSize);

    const responseData = {
        success: true,
        data: announcements,
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
})
export { addSave, removeSave, getSavedAnnouncements }