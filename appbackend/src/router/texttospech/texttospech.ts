import { Router } from "express"
import { translateSpeech } from "../../controllers/texttospech"
import { rateLimiter } from "../../middleware/ratelimiter"

const texttospech = Router()

texttospech.use(rateLimiter(5, 6000))

texttospech.post("/texttospech", translateSpeech)

export default texttospech