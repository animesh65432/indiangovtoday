import { Request, Response } from "express"
import { asyncErrorHandler } from "../middleware/asyncErrorHandler"
import { connectDB } from "../db"
import { ObjectId } from "mongodb";
import { redis } from "../services/redis"
import { LANGUAGE_CODES } from "../utils/lan"
import { PrasePayloadArray } from "../utils/translatePayloadAnnoucements"

export const GetIndiaAnnouncements = asyncErrorHandler(async (req: Request, res: Response) => {

    const { category, target_lan, startDate, endDate, page, limit, states } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const selectedStates = PrasePayloadArray(states as string);
    const sortedStates = [...selectedStates].sort();
    const stateCachePart = sortedStates.join(",");

    const Category = category ? category.toString().trim() : "";

    const announcementsStartDate = startDate
        ? new Date(startDate as string)
        : new Date(new Date().setDate(new Date().getDate() - 7));

    const announcementsEndDate = endDate ? new Date(endDate as string) : new Date();

    const targetLanguage = LANGUAGE_CODES[target_lan as string] || "en";

    const redis_key = `Announcements_${targetLanguage}_${announcementsStartDate.toISOString().split('T')[0]}_${announcementsEndDate.toISOString().split('T')[0]}_page${page}_limit${limit}_${Category}_${stateCachePart}`;
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

    let announcements: any[] = [];
    let totalCount: number = 0;


    const filter: any = {
        date: { $gte: start, $lte: end },
        language: targetLanguage,
        state: sortedStates.length ? { $in: sortedStates } : { $exists: true },
    };

    const collationOptions = { collation: { locale: 'simple', strength: 1 } };

    if (Category.length > 0) {
        filter.category = Category ? Category : { $exists: true };
    }

    announcements = await db.collection("Translated_Announcements")
        .find(filter, {
            projection: {
                sections: 0,
                language: 0,
                source_link: 0,
                _id: 0
            },
            ...collationOptions
        })
        .sort({ date: -1, _id: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray();

    totalCount = await db.collection("Translated_Announcements")
        .countDocuments(filter, collationOptions);


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
});

export const SerachallIndiaAnnouncements = asyncErrorHandler(async (req: Request, res: Response) => {
    const { target_lan, startDate, endDate, page, limit, SearchInput, states } = req.query;

    const announcementsStartDate = startDate
        ? new Date(startDate as string)
        : new Date(new Date().setDate(new Date().getDate() - 7));

    const announcementsEndDate = endDate
        ? new Date(endDate as string)
        : new Date();

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const selectedStates = PrasePayloadArray(states as string);
    const sortedStates = [...selectedStates].sort();
    const stateCachePart = sortedStates.join(",");


    let searchInputValue = typeof SearchInput === "string" && SearchInput.length > 0 ? SearchInput : "";

    if (isNaN(announcementsStartDate.getTime()) || isNaN(announcementsEndDate.getTime())) {
        res.status(400).json({ error: "Invalid date format" });
        return;
    }

    const targetLanguage = LANGUAGE_CODES[target_lan as string] || "en";

    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);

    const redis_key = `AllGroupsIndiaAnnouncements_${targetLanguage}_${announcementsStartDate.toISOString().split('T')[0]}_${announcementsEndDate.toISOString().split('T')[0]}_page${page}_limit${limit}_search${searchInputValue}-${stateCachePart}`;


    const cached_data = await redis.get(redis_key);


    if (cached_data) {
        const parsedData = typeof cached_data === 'string'
            ? JSON.parse(cached_data)
            : cached_data;
        res.status(200).json(parsedData);
        return;
    }

    const db = await connectDB();

    let indiaAnnouncements: any[] = [];
    let totalCount: number = 0;

    const stateFilter = selectedStates.length > 0 ? { state: { $in: selectedStates } } : {}

    if (searchInputValue.length > 0) {
        const searchRegex = new RegExp(searchInputValue as string, "i");

        const pipeline = [
            {
                $match: {
                    date: { $gte: start, $lte: end },
                    language: targetLanguage,
                    ...stateFilter,
                    $or: [
                        { title: searchRegex },
                        { state: searchRegex },
                        { category: searchRegex },
                        { description: searchRegex },
                        { department: searchRegex }
                    ]
                }
            },
            {
                $addFields: {
                    searchScore: {
                        $switch: {
                            branches: [
                                { case: { $regexMatch: { input: "$title", regex: searchRegex } }, then: 100 },
                                { case: { $regexMatch: { input: "$state", regex: searchRegex } }, then: 50 },
                                { case: { $regexMatch: { input: "$category", regex: searchRegex } }, then: 30 },
                                { case: { $regexMatch: { input: "$description", regex: searchRegex } }, then: 20 }
                            ],
                            default: 10
                        }
                    }
                }
            },
            { $sort: { searchScore: -1, date: -1, _id: -1 } },
            { $skip: skip },
            { $limit: pageSize },
            {
                $project: {
                    searchScore: 0,
                    sections: 0,
                    language: 0,
                    source_link: 0
                }
            }
        ];

        indiaAnnouncements = await db.collection("Translated_Announcements").aggregate(pipeline).toArray();

        // Count total matching documents for pagination
        const countFilter = {
            date: { $gte: start, $lte: end },
            language: targetLanguage,
            ...stateFilter,
            $or: [
                { title: searchRegex },
                { state: searchRegex },
                { category: searchRegex },
                { description: searchRegex },
                { department: searchRegex }
            ]
        };
        totalCount = await db.collection("Translated_Announcements").countDocuments(countFilter);

    } else {
        // NO SEARCH - Just date/language filter
        const filter = {
            date: { $gte: start, $lte: end },
            language: targetLanguage,
            ...stateFilter
        };

        indiaAnnouncements = await db
            .collection("Translated_Announcements")
            .find(filter, {
                projection: { sections: 0, language: 0, source_link: 0 }
            })
            .sort({ date: -1, _id: -1 })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        totalCount = await db.collection("Translated_Announcements").countDocuments(filter);
    }

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
    return;
});


export const GetIndiaAnnouncement = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id, target_lan } = req.query;

    if (!id || typeof id !== "string" || !target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid id or target_lan is bad" });
        return;
    }

    const targetLanguage = LANGUAGE_CODES[target_lan as string] || "English";

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
                language: 0,
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

export const GetallAnnoucementsDepartments = asyncErrorHandler(async (req: Request, res: Response) => {
    const { target_lan, startDate, endDate, states } = req.query;

    if (!target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid target_lan" });
        return;
    }

    const targetLanguage = LANGUAGE_CODES[target_lan] || "en";
    const selectedStates = PrasePayloadArray(states as string);
    const sortedStates = [...selectedStates].sort();
    const stateCachePart = sortedStates.join(",");

    const announcementsStartDate = startDate
        ? new Date(startDate as string)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const announcementsEndDate = endDate
        ? new Date(endDate as string)
        : new Date();

    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);

    const redisKey = `All_Announcements_Departments_${targetLanguage}_${start
        .toISOString()
        .split("T")[0]}_${end
            .toISOString()
            .split("T")[0]}_${stateCachePart}`;

    const cached = await redis.get(redisKey);

    if (cached) {
        res.status(200).json(cached);
        return;
    }

    const db = await connectDB();

    const filter = {
        date: { $gte: start, $lte: end },
        language: targetLanguage,
        state: sortedStates.length ? { $in: sortedStates } : { $exists: true },
    };

    const collationOptions = { collation: { locale: "simple", strength: 1 } };

    const departments = await db
        .collection("Translated_Announcements")
        .distinct("department", filter, collationOptions);

    const response = {
        success: true,
        data: departments,
    };

    await redis.set(redisKey, JSON.stringify(response), { ex: 300 });

    res.status(200).json(response);
    return;
}
);

export const GetAllTrendingTitles = asyncErrorHandler(async (req: Request, res: Response) => {
    const { target_lan } = req.query;

    if (!target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid target_lan" });
        return;
    }

    const targetLanguage = LANGUAGE_CODES[target_lan as string] || "en";


    const redis_key = `Trending_Announcements_${targetLanguage}`;

    const cached_data = await redis.get(redis_key);

    if (cached_data) {
        const parsedData = typeof cached_data === "string" ? JSON.parse(cached_data) : cached_data;
        res.status(200).json(parsedData);
        return;
    }

    const db = await connectDB();

    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);

    const trendingAnnouncements = await db
        .collection("Translated_Announcements")
        .aggregate([
            {
                $match: {
                    date: { $gte: fifteenDaysAgo },
                    language: targetLanguage,
                },
            },
            {
                $sort: { date: -1 },
            },
            {
                $group: {
                    _id: "$department",
                    doc: { $first: "$$ROOT" },
                },
            },
            {
                $replaceRoot: { newRoot: "$doc" },
            },
            {
                $sort: { date: -1 },
            },
            {
                $project: {
                    announcementId: 1,
                    title: 1,
                }
            }
        ])
        .toArray();

    const responseData = {
        success: true,
        data: trendingAnnouncements,
        languageCode: LANGUAGE_CODES[targetLanguage] || "en",
    };

    await redis.set(redis_key, JSON.stringify(responseData), { ex: 300 });

    res.status(200).json(responseData);
    return;
});

export const GetAllCountAnnouncements = asyncErrorHandler(async (req: Request, res: Response) => {

    const { target_lan, startDate, endDate } = req.query;

    if (!target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid target_lan" });
        return;
    }

    const targetLanguage = LANGUAGE_CODES[target_lan as string] || "en";

    const announcementsStartDate = startDate
        ? new Date(startDate as string)
        : new Date(new Date().setDate(new Date().getDate() - 7));

    const announcementsEndDate = endDate
        ? new Date(endDate as string)
        : new Date();

    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);

    const redis_key = `Count_Announcements_${targetLanguage}_${start
        .toISOString()
        .split("T")[0]}_${end.toISOString().split("T")[0]}`;

    const cached_data = await redis.get(redis_key);

    if (cached_data) {
        const parsedData = typeof cached_data === "string" ? JSON.parse(cached_data) : cached_data;
        res.status(200).json(parsedData);
        return;
    }

    const db = await connectDB();


    const stateCounts = await db
        .collection("Translated_Announcements")
        .aggregate([
            {
                $match: {
                    date: { $gte: start, $lte: end },
                    language: targetLanguage
                }
            },
            {
                $sort: { date: -1 }
            },
            {
                $group: {
                    _id: {
                        state: "$state",
                        category: "$category",
                    },
                    count: { $sum: 1 },
                    announcements: {
                        $push: {
                            title: "$title",
                            date: "$date",
                            id: "$_id"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.state",
                    total: { $sum: "$count" },
                    categories: {
                        $push: {
                            category: "$_id.category",
                            count: "$count",
                            announcements: {
                                $slice: ["$announcements", 10]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    state: "$_id",
                    categories: 1
                }
            },
            {
                $sort: { total: -1 }
            }
        ])
        .toArray();


    await redis.set(redis_key, JSON.stringify({
        success: true,
        data: stateCounts
    }), { ex: 300 });

    res.status(200).json({
        success: true,
        data: stateCounts
    });

    return;
});

export const GetAllCategoriesAnnouncements = asyncErrorHandler(async (req: Request, res: Response) => {
    const { target_lan, startDate, endDate } = req.query;

    if (!target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid target_lan" });
        return;
    }

    const targetLanguage = LANGUAGE_CODES[target_lan] || "en";

    const announcementsStartDate = startDate
        ? new Date(startDate as string)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const announcementsEndDate = endDate
        ? new Date(endDate as string)
        : new Date();

    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);

    const redisKey = `All_Announcements_Categories_${targetLanguage}_${start
        .toISOString()
        .split("T")[0]}_${end
            .toISOString()
            .split("T")[0]}`;

    const cached = await redis.get(redisKey);

    if (cached) {
        res.status(200).json(cached)
        return;
    }

    const db = await connectDB();

    const filter = {
        date: { $gte: start, $lte: end },
        language: targetLanguage,
    };

    const collationOptions = { collation: { locale: "simple", strength: 1 } };

    const categories = await db
        .collection("Translated_Announcements")
        .distinct("category", filter, collationOptions);

    const response = {
        success: true,
        data: categories,
    };

    await redis.set(redisKey, JSON.stringify(response), { ex: 300 });

    res.status(200).json(response);
    return;
})

export const GetStats = asyncErrorHandler(async (req: Request, res: Response) => {
    const db = await connectDB();

    const redis_key = `Stats_Announcements_en`;
    const cached_data = await redis.get(redis_key);

    if (cached_data) {
        const parsedData = typeof cached_data === "string" ? JSON.parse(cached_data) : cached_data;
        res.status(200).json(parsedData);
        return;
    }

    const totalAnnouncements = await db.collection("Translated_Announcements").countDocuments({
        language: "en"
    });

    const totalDepartments = await db.collection("Translated_Announcements").distinct("department", {
        language: "en"
    });

    await redis.set(redis_key, JSON.stringify({
        success: true,
        data: {
            totalAnnouncements,
            totalDepartments: totalDepartments.length,
        }
    }), { ex: 300 });

    res.status(200).json({
        success: true,
        data: {
            totalAnnouncements,
            totalDepartments: totalDepartments.length,
        }
    });
});

export const GetBriefAnnouncements = asyncErrorHandler(async (req: Request, res: Response) => {
    const { target_lan, states, startDate, endDate } = req.query;

    if (!target_lan || typeof target_lan !== "string") {
        res.status(400).json({ message: "Missing or invalid target_lan" });
        return;
    }

    const selectedStates = PrasePayloadArray(states as string);

    const announcementsStartDate = startDate
        ? new Date(startDate as string)
        : new Date(new Date().setDate(new Date().getDate() - 7));

    const announcementsEndDate = endDate ? new Date(endDate as string) : new Date();

    const stateCachePart = selectedStates.join(",");

    const targetLanguage = LANGUAGE_CODES[target_lan as string] || "en";

    const redis_key = `Brief_Announcements_${targetLanguage}_${stateCachePart}_${announcementsStartDate.toISOString().split("T")[0]}_${announcementsEndDate.toISOString().split("T")[0]}`;

    const cached_data = await redis.get(redis_key);

    if (cached_data) {
        const parsedData = typeof cached_data === "string" ? JSON.parse(cached_data) : cached_data;
        res.status(200).json(parsedData);
        return;
    }

    const db = await connectDB();

    const start = new Date(announcementsStartDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(announcementsEndDate);
    end.setUTCHours(23, 59, 59, 999);

    const result = await db.aggregate([
        {
            $documents: selectedStates.map((s) => ({ state: s }))
        },
        {
            $lookup: {
                from: "Translated_Announcements",
                let: { stateVar: "$state" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$state", "$$stateVar"] },
                                    { $eq: ["$language", targetLanguage] },
                                    { $gte: ["$date", start] },
                                    { $lte: ["$date", end] },
                                ]
                            }
                        }
                    },
                    { $sort: { date: -1 } }
                ],
                as: "announcements"
            }
        },
        {
            $project: {
                _id: 0,
                state: 1,
                total: { $size: "$announcements" },
                latest: {
                    $cond: {
                        if: { $gt: [{ $size: "$announcements" }, 0] }, // ✅ fixed brackets here
                        then: {
                            title: { $first: "$announcements.title" },
                            date: { $first: "$announcements.date" },
                            category: { $first: "$announcements.category" },
                            announcementId: { $first: "$announcements.announcementId" }
                        },
                        else: null
                    }
                }
            }
        },
        { $sort: { total: -1 } }
    ]).toArray();

    const responseData = {
        success: true,
        data: result
    };

    await redis.set(redis_key, JSON.stringify(responseData), { ex: 300 });

    res.status(200).json(responseData);
    return;
});