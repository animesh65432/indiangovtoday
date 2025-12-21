import { Router } from "express"
import { rateLimiter } from "../../middleware/ratelimiter"
import { GetIndiaAnnouncements, GetIndiaAnnouncement, GetGroupIndiaAnnouncements, SerachallIndiaAnnouncements } from "../../controllers/announcements"


const router = Router()

router.use(rateLimiter(20, 60000))

router.get("/GetIndiaAnnnouncements", GetIndiaAnnouncements)
router.get("/GetGroupIndiaAnnouncements", GetGroupIndiaAnnouncements)
router.get("/GetIndiaAnnouncement", GetIndiaAnnouncement)
router.get("/SerachallIndiaAnnouncements", SerachallIndiaAnnouncements)


export default router