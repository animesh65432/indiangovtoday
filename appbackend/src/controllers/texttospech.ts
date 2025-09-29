import { sarvamai } from "../services/SarvamAi"
import { Request, Response } from "express";
import { asyncerrorhandler } from "../middleware/ayncerrorhandler";
import { LanguageSupport } from "../types";
import { languagespporiton } from "../utils/lan"

export const translatespech = asyncerrorhandler(async (req: Request, res: Response) => {
    const { text, target_language_code } = req.body

    if (!text || !target_language_code) {
        res.status(400).json({ message: "Text and target_language_code are required" })
        return
    }

    if (!languagespporiton.includes(target_language_code as LanguageSupport)) {
        res.status(400).json({ message: "Unsupported language code" })
        return
    }

    const response = await sarvamai.textToSpeech.convert({
        text: text,
        target_language_code: `${target_language_code as LanguageSupport}-IN`,
    });

    res.status(200).json({
        sucess: true,
        message: "Text converted to speech successfully",
        audioContent: response.audios[0],
    })
    return
})