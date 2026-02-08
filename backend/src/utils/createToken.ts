import jwt from "jsonwebtoken"
import config from "../config"

export const createToken = (email: string) => {
    return jwt.sign({ email }, config["JWT_SECRET"] as string, { expiresIn: "7d" })
}

export const verifyToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, config["JWT_SECRET"] as string) as { email: string }
        return decoded.email
    } catch (err) {
        return null
    }
}