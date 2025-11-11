import { sarvamai } from "../services/SarvamAi";
import { Request, Response } from "express";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";
import { LanguageSupport } from "../types";
import { languageCodeMap } from "../utils/lan";

export const translateSpeech = asyncErrorHandler(async (req: Request, res: Response) => {
    const { text, target_language } = req.body;

    if (!text || !target_language) {
        res.status(400).json({ message: "Text and target_language are required" });
        return;
    }


    const target_language_code = languageCodeMap[target_language as keyof typeof languageCodeMap];

    if (!target_language_code) {
        res.status(400).json({
            message: "Unsupported language",
            supportedLanguages: Object.keys(languageCodeMap)
        });
        return;
    }

    const response = await sarvamai.textToSpeech.convert({
        text: text,
        target_language_code: `${target_language_code as LanguageSupport}-IN`,
    });

    res.status(200).json({
        success: true,
        message: "Text converted to speech successfully",
        audioContent: response.audios[0],
        language: target_language,
        languageCode: target_language_code
    });
    return;
});