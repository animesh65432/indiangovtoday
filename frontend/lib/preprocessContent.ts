import { EmailRegex } from "./EmailRegex"
import { PdfRegex } from "./Pdfregex"
import { TwitterRegex, PicTwitterRegex } from "./TwitterRegex"
import { UrlRegex, IsVaildUrl } from "./UrlRegex"
import { findsperater } from "@/lib/findsperater"


function cleanNoise(text: string): string {
    return text
        // remove only selected noise codes (AB, NB, MI, ARJ, etc.)
        .replace(/\b(AB|NB|MI|ARJ)\b/g, "")

        // remove multiple asterisks
        .replace(/\*{2,}/g, "")

        // remove patterns like ABC/XYZ
        .replace(/[A-Z]{2,}\/[A-Z0-9]{2,}/g, "")

        // collapse multiple spaces
        .replace(/\s+/g, " ")
        .trim();
}


function convertNumberingToBullet(text: string): string {
    return text.replace(
        /^\s*([\p{L}\p{N}]+)\s*\/\s*/gmu,
        "- "
    );
}

export const preprocessContent = (text: string, lan: string): string => {
    if (!text) return '';

    // 🔥 Convert numbering like a/, 1/, अ/, ব/, etc. → "- "
    text = convertNumberingToBullet(text);

    const sperater = findsperater(lan);

    const text_array = text.split(" ");
    const formatedtextArray: string[] = [];

    let sentenceCount = 0;

    for (let i = 0; i < text_array.length; i++) {
        const word = text_array[i];

        const trailingMatch = word.match(/[.,!?;:]+$/);
        const trailing = trailingMatch ? trailingMatch[0] : "";
        const cleanedWord = word.replace(/[.,!?;:]+$/, "");

        if (EmailRegex.test(cleanedWord)) {
            formatedtextArray.push(`[${cleanedWord}](mailto:${cleanedWord})${trailing}`);
        }
        else if (PdfRegex.test(cleanedWord)) {
            let url = cleanedWord;
            if (!IsVaildUrl.test(url)) url = `https://${url}`;
            formatedtextArray.push(
                `<embed src="${url}" width="100%" height="500px" type="application/pdf" />`
            );
        }
        else if (TwitterRegex.test(cleanedWord)) {
            formatedtextArray.push(
                `<iframe 
                    src="${cleanedWord}" 
                    width="100%" 
                    height="500px" 
                    style="border: none; border-radius: 8px;">
                </iframe>`
            );
        }
        else if (UrlRegex.test(cleanedWord)) {
            let url = cleanedWord;
            if (!IsVaildUrl.test(url)) url = `https://${url}`;
            formatedtextArray.push(`[${cleanedWord}](${url})${trailing}`);
        }
        else {
            formatedtextArray.push(cleanNoise(cleanedWord));
        }

        if (word.endsWith(sperater)) {
            sentenceCount++;
            if (sentenceCount === 4) {
                formatedtextArray.push("\n\n");
                sentenceCount = 0;
            }
        }
    }

    return formatedtextArray.join(" ");
};
