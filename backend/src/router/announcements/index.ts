import { Router } from "express"
import { rateLimiter } from "../../middleware/ratelimiter"
import { GetIndiaAnnouncements, GetIndiaAnnouncement, SerachallIndiaAnnouncements, GetallAnnoucementsDepartments } from "../../controllers/announcements"


const router = Router()

router.use(rateLimiter(25, 60000))

router.get("/GetIndiaAnnnouncements", GetIndiaAnnouncements)
router.get("/GetIndiaAnnnouncement", GetIndiaAnnouncement)
router.get("/GetallAnnoucementsDepartments", GetallAnnoucementsDepartments)
router.get("/SerachallIndiaAnnouncements", SerachallIndiaAnnouncements)


export default router