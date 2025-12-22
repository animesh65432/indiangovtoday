import { Request, Response, NextFunction } from "express";
import { redis } from "../services/redis";

export const rateLimiter = (limit: number, windowMs: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip;
        const key = `rate-limit:${ip}`;
        const expireSeconds = Math.floor(windowMs / 1000);

        try {
            const count = await redis.get(key) as string

            if (count) {
                const current = parseInt(count);
                const ttl = await redis.ttl(key);

                if (ttl === -1) {
                    await redis.expire(key, expireSeconds);
                }

                if (current >= limit) {
                    return res
                        .status(429)
                        .set("Retry-After", `${expireSeconds}`)
                        .json({ message: "Too many requests, please try again later." });
                }

                await redis.incr(key);
            } else {
                await redis.set(key, "1", { ex: expireSeconds });
            }

            next();
        } catch (error) {
            console.error("Redis rate limiter error:", error);
            next();
        }
    };
};
