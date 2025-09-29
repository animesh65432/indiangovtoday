import { Router } from "express"
import announcementsrouter from "./announcements"
import texttospech from "./texttospech/texttospech"

const router = Router()

router.use(announcementsrouter)

router.use(texttospech)

export default router