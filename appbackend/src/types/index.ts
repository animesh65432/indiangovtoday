import { Request, Response, NextFunction } from "express"

export type asyncerrorhandlerpayload = (req: Request, res: Response, next: NextFunction) => Promise<void>

export type LanguageSupport = "en" | "bn" | "hi" | "ta" | "te" | "ml" | "kn" | "mr" | "gu" | "pa"