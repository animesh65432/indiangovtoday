import { Router } from "express"
import { AddSubscribe } from "../../controllers/alerts"

const router = Router()

router.post("/addsubscribe", AddSubscribe)

export default router