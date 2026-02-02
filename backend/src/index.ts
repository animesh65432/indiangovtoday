import config from "./config"
import express from "express"
import { errorMiddleware } from "./middleware/errormiddleware"
import cors from "cors"
import router from "./router"

const app = express()

app.use(cors({
    origin: [
        "http://localhost:3000",      // Web dev
        "http://localhost:3001",      // Web dev 2
        "https://indiangovtoday.app", // Production PWA
        // Hybrid apps ONLY (add these if using):
        "capacitor://localhost",      // iOS Capacitor  
        "http://localhost",           // Android Capacitor
        "gap://ready",                // Cordova (older)
        "gap-iab://localhost"         // Cordova InAppBrowser
    ],
    credentials: true
}))
app.use(express.json({ limit: "20mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(router)
app.use(errorMiddleware)


app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
})

export default app