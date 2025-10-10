import { Router } from "express"
import { translateSpeech } from "../../controllers/texttospech"
import { rateLimiter } from "../../middleware/ratelimiter"

const texttospech = Router()

texttospech.use(rateLimiter(10, 60000))

texttospech.post("/texttospech", translateSpeech)

export default texttospech