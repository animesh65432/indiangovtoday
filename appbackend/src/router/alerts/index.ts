import { Router } from "express"
import { rateLimiter } from "../../middleware/ratelimiter"
import { AddSubscribe } from "../../controllers/alerts"

const router = Router()

router.use(rateLimiter(20, 60000))

router.post("/addsubscribe", AddSubscribe)

export default router