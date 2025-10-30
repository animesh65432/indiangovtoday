import { Request, Response } from "express"
import { asyncerrorhandler } from "../middleware/ayncerrorhandler"
import { connectDB } from "../db"
import { ObjectId } from "mongodb";
import { redis } from "../services/redis"
import { LANGUAGE_CODES } from "../utils/lan"

export const GetIndiaAnnouncements = asyncerrorhandler(async (req: Request, res: Response) => {
    const { target_lan, startdate, endDate, page, limit } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 2;
    const skip = (pageNumber - 1) * pageSize;

    const announcementsStartDate = startdate
        ? new Date(startdate as string)
        : new Date(new Date().setDate(new Date().getDate() - 7));

    const announcementsEndDate = endDate
        ? new Date(endDate as string)
        : new Date();

    const targetLanguage = (target_lan as string) || "English";
    const lan = LANGUAGE_CODES[targetLanguage] || "en";

    const redis_key = `Announcements_${targetLanguage}_${announcementsStartDate.toISOString().split('T')[0]}_${announcementsEndDate.toISOString().split('T')[0]}_page${pageNumber}_limit${pageSize}`;

    const cached_data = await redis.get(redis_key);

    if (typeof cached_data === "string" && cached_data.trim() !== "") {
        res.status(200).json(JSON.parse(cached_data));
        return;
    }


    const db = await connectDB();

    const filter = {
        created_at: {
            $gte: announcementsStartDate,
            $lte: announcementsEndDate,
        },
    };

    const pipeline: any[] = [{ $match: filter }];

    if (lan !== "en") {
        pipeline.push(
            {
                $addFields: {
                    translation: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$translations",
                                    as: "trans",
                                    cond: { $eq: ["$$trans.ln_code", lan] },
                                },
                            },
                            0,
                        ],
                    },
                },
            },
            {
                $addFields: {
                    title: { $ifNull: ["$translation.title", "$title"] },
                    type: { $ifNull: ["$translation.type", "$type"] },
                    original_type: "$type"
                },
            },
            { $unset: ["translations", "translation", "content", "source", "original_title"] }
        );
    }

    pipeline.push(
        { $sort: { created_at: -1 } },
        { $limit: 3 },
        {
            $group: {
                _id: "$type",
                announcements: { $push: "$$ROOT" },
            },
        },
        {
            $project: {
                type: "$_id",
                announcements: 1,
                _id: 0,
            },
        },
        { $skip: skip },
        { $limit: pageSize },
    );

    const indiaAnnouncements = await db
        .collection("announcements")
        .aggregate(pipeline)
        .toArray();

    const totalCount = await db.collection("announcements").countDocuments(filter);
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
export const GetGroupIndiaAnnouncements = asyncerrorhandler(async (req: Request, res: Response) => {
    const { target_lan, startdate, endDate, typeofGroup } = req.query;

    if (!typeofGroup) {
        res.status(400).json({
            message: "typeofGroup is required"
        })
        return
    }

    const announcementsStartDate = startdate
        ? new Date(startdate as string)
        : new Date(new Date().setDate(new Date().getDate() - 7));

    const announcementsEndDate = endDate
        ? new Date(endDate as string)
        : new Date();

    if (isNaN(announcementsStartDate.getTime()) || isNaN(announcementsEndDate.getTime())) {
        res.status(400).json({ error: "Invalid date format" });
        return;
    }

    const targetLanguage = (target_lan as string) || "English";
    const lan = LANGUAGE_CODES[targetLanguage] || "en";

    const redis_key = `Group_Announcements_${targetLanguage}_${announcementsStartDate.toISOString().split('T')[0]}_${announcementsEndDate.toISOString().split('T')[0]}_${typeofGroup || "all"}`;

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

    const db = await connectDB();

    const filter: any = {
        created_at: { $gte: start, $lte: end }
    };

    filter.type = typeofGroup;


    const pipeline: any[] = [
        { $match: filter }
    ];


    if (lan !== "en") {
        pipeline.push(
            {
                $addFields: {
                    translation: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$translations",
                                    as: "trans",
                                    cond: { $eq: ["$$trans.ln_code", lan] },
                                },
                            },
                            0,
                        ],
                    },
                },
            },
            {
                $addFields: {
                    title: { $ifNull: ["$translation.title", "$title"] },
                    summary: { $ifNull: ["$translation.summary", "$summary"] },
                    type: { $ifNull: ["$translation.type", "$type"] },
                },
            },
            {
                $unset: [
                    "language",
                    "translation",
                    "translations",
                    "content",
                    "original_title",
                    "source",
                ],
            }
        );
    } else {
        pipeline.push({
            $unset: [
                "translations",
                "content",
                "original_title",
                "language",
                "source",
            ],
        });
    }

    const indiaAnnouncements = await db
        .collection("announcements")
        .aggregate(pipeline)
        .toArray();




    const responseData = {
        success: true,
        data: indiaAnnouncements,
        count: indiaAnnouncements.length,
        languageCode: lan,
        dateRange: {
            start: start.toISOString(),
            end: end.toISOString(),
        },
        group: typeofGroup || null,
    };

    await redis.set(redis_key, JSON.stringify(responseData), { ex: 300 });

    res.status(200).json(responseData);
});

export const GetallGroupsIndiaAnnouncements = asyncerrorhandler(async (req: Request, res: Response) => {
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
    const searchQuery = typeof SearchInput === 'string' ? SearchInput.trim() : null;

    if (isNaN(announcementsStartDate.getTime()) || isNaN(announcementsEndDate.getTime())) {
        res.status(400).json({ error: "Invalid date format" });
        return;
    }

    const targetLanguage = (target_lan as string) || "English";
    const lan = LANGUAGE_CODES[targetLanguage] || "en";


    const redis_key = `AllGroupsIndiaAnnouncements_${targetLanguage}_${announcementsStartDate.toISOString().split('T')[0]}_${announcementsEndDate.toISOString().split('T')[0]}${page}${limit}${searchQuery}`;

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
        created_at: { $gte: start, $lte: end }
    };

    if (searchQuery) {
        const searchRegex = new RegExp(searchQuery as string, "i");

        if (lan === "en") {
            filter.$or = [
                { title: searchRegex },
                { type: searchRegex }
            ];
        } else {
            filter["translations.ln_code"] = lan;
            filter.$or = [
                { "translations.title": searchRegex },
                { "translations.type": searchRegex }
            ];
        }
    }

    const db = await connectDB();

    const pipeline: any[] = [
        { $match: filter }
    ];

    if (lan !== "en") {
        pipeline.push(
            {
                $addFields: {
                    translation: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$translations",
                                    as: "trans",
                                    cond: { $eq: ["$$trans.ln_code", lan] },
                                },
                            },
                            0,
                        ],
                    },
                },
            },
            {
                $addFields: {
                    original_type: "$type",
                },
            },
            {
                $addFields: {
                    title: { $ifNull: ["$translation.title", "$title"] },
                    type: { $ifNull: ["$translation.type", "$type"] },
                    summary: { $ifNull: ["$translation.summary", "$summary"] }
                },
            },
            {
                $unset: [
                    "language",
                    "translation",
                    "translations",
                    "content",
                    "original_title",
                    "source"
                ],
            }
        );
    } else {
        pipeline.push({
            $unset: [
                "translations",
                "content",
                "original_title",
                "language",
                "source",
            ],
        });
    }

    pipeline.push(
        {
            $group: {
                _id: "$type",
                announcements: { $push: "$$ROOT" },
            }
        },
        {
            $project: {
                type: "$_id",
                announcements: { $slice: ["$announcements", 3] },
                _id: 0
            }
        },
        { $sort: { type: -1 } },
        { $skip: skip },
        { $limit: pageSize },
    );

    const indiaAnnouncements = await db
        .collection("announcements")
        .aggregate(pipeline)
        .toArray();

    const totalCount = await db.collection("announcements").countDocuments(filter);
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


export const GetIndiaAnnouncement = asyncerrorhandler(async (req: Request, res: Response) => {
    const { id, target_lan } = req.query;

    if (!id || typeof id !== "string") {
        res.status(400).json({ message: "Missing or invalid id" });
        return;
    }

    const targetLanguage = (target_lan as string) || "English";
    const lan = LANGUAGE_CODES[targetLanguage] || "en";

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


    const pipeline: any[] = [
        { $match: { _id: objectId } }
    ];

    if (lan !== "en") {
        pipeline.push(
            {
                $addFields: {
                    translation: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$translations",
                                    as: "trans",
                                    cond: { $eq: ["$$trans.ln_code", lan] }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $addFields: {
                    title: { $ifNull: ["$translation.title", "$title"] },
                    content: { $ifNull: ["$translation.content", "$content"] }
                }
            },
            {
                $unset: [
                    "translation",
                    "translations",
                    "language",
                    "original_title",
                    "summary",
                    "type"
                ]
            }
        );
    } else {
        pipeline.push({
            $unset: ["translations", "language", "original_title", "summary",]
        });
    }
    const result = await db
        .collection("announcements")
        .aggregate(pipeline)
        .toArray();

    if (!result.length) {
        res.status(404).json({ error: "Announcement not found" });
        return;
    }

    const announcement = result[0];

    const responseData = {
        success: true,
        data: announcement,
        languageCode: lan
    };


    await redis.set(redis_key, JSON.stringify(responseData), { ex: 300 });

    res.status(200).json(responseData);
});