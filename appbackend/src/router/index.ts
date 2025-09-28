import { Router } from "express"
import announcementsrouter from "./announcements"

const router = Router()

router.use(announcementsrouter)

export default router