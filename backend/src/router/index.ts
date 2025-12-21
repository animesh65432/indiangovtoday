import { Router } from "express"
import announcementsrouter from "./announcements"
import texttospech from "./texttospech/texttospech"
import emailrouter from "./alerts"

const router = Router()

router.use(announcementsrouter)

router.use(texttospech)

router.use(emailrouter)

export default router