import { asyncErrorHandler } from "../middleware/asyncErrorHandler"
import { connectDB } from "../db"
import { createToken } from "../utils/createToken"

export const auth = asyncErrorHandler(async (req, res) => {

    const { name, email } = req.body

    if (!name || !email) {
        res.status(400).json({
            success: false,
            message: "Name and email are required"
        })
        return
    }

    const token = createToken(email)

    const db = await connectDB()

    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({ email })

    if (existingUser) {
        res.status(200).json({
            success: true,
            message: "User already exists",
            token
        })
        return
    }

    const newUser = {
        name,
        email
    }

    await usersCollection.insertOne(newUser)

    res.status(200).json({
        success: true,
        message: "User created successfully",
        token
    })
    return
})