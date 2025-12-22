import config from "./config"
import express from "express"
import { errorMiddleware } from "./middleware/errormiddleware"
import cors from "cors"
import router from "./router"

const app = express()

app.use(cors({
    origin: ["http://localhost:3000", "https://indiangovtoday.app", "http://localhost:3001", "https://demo-lilac-sigma-56.vercel.app"],
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