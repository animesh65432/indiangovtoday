import { Request, Response } from "express"
import { asyncerrorhandler } from "../middleware/ayncerrorhandler"
import { connectDB } from "../db"
import { ObjectId } from "mongodb";


export const GetIndiaAnnnouncements = asyncerrorhandler(async (req: Request, res: Response) => {
    const db = await connectDB();
    const docs = await db.collection("announcements").find().sort({ _id: -1 }).toArray();
    res.status(200).json(docs);
    return
})


export const GetIndiaAnnouncement = asyncerrorhandler(async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        res.status(400).json({
            message: "Missing or invalid id",
        });
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

    const doc = await db.collection("announcements").findOne({ _id: objectId });

    if (!doc) {
        res.status(404).json({ error: "Not found" });
        return
    }

    res.status(200).json(doc);
    return
});