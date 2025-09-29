import { Router } from "express"
import { translatespech } from "../../controllers/texttospech"
import { rateLimiter } from "../../middleware/ratelimiter"

const texttospech = Router()

texttospech.use(rateLimiter(5, 6000))

texttospech.get("/texttospech", translatespech)

export default texttospech