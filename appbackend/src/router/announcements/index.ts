import { Router } from "express"
import { rateLimiter } from "../../middleware/ratelimiter"
import { GetIndiaAnnnouncements, GetIndiaAnnouncement } from "../../controllers/announcements"


const router = Router()

router.use(rateLimiter(10, 60000))

router.get("/GetIndiaAnnnouncements", GetIndiaAnnnouncements)
router.get("/GetIndiaAnnouncement", GetIndiaAnnouncement)


export default router