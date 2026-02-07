import { Router } from "express"
import announcementsrouter from "./announcements"
import texttospech from "./texttospech/texttospech"
import emailrouter from "./alerts"
import authrouter from "./auth"
import saverouter from "./save"

const router = Router()

router.use(announcementsrouter)

router.use(texttospech)

router.use(emailrouter)

router.use(authrouter)

router.use(saverouter)

export default router