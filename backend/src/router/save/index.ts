import { addSave, removeSave, getSavedAnnouncements } from "../../controllers/save"
import { Router } from "express"
import { rateLimiter } from "../../middleware/ratelimiter"
import { authMiddleware } from "../../middleware/auth"

const router = Router()


router.use(rateLimiter(25, 60000))
router.use(authMiddleware)

router.post("/addSave", addSave)
router.delete("/removeSave/:id", removeSave)
router.get("/getSavedAnnouncements", getSavedAnnouncements)

export default router