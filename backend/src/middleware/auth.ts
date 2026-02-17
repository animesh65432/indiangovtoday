import { asyncErrorHandler } from "./asyncErrorHandler"
import { verifyToken } from "../utils/createToken"
import { connectDB } from "../db"

export const authMiddleware = asyncErrorHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
        return
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
        return
    }

    const email = await verifyToken(token)

    if (!email) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
        return
    }

    const db = await connectDB()

    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ email }) as { _id: string, email: string, name: string } | null

    if (!user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
        return
    }

    req.user = user
    next()
})
