import { Router } from "express"
import { auth } from "../../controllers/auth"
import { rateLimiter } from "../../middleware/ratelimiter"

const router = Router()


router.use(rateLimiter(25, 60000))

router.post("/auth", auth)


export default router