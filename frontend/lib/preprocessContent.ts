import { EmailRegex } from "./EmailRegex"
import { PdfRegex } from "./Pdfregex"
import { TwitterRegex } from "./TwitterRegex"
import { UrlRegex, IsVaildUrl } from "./UrlRegex"
import { findsperater } from "@/lib/findsperater"
import { Languages } from "@/lib/lan"

/**
 * Clean noise without breaking markdown syntax
 */
function adjust_markdown_for_non_english(text: string, lan: string) {
    if (lan === "বাংলা") {
        // Keep placeholders but wrap them in a span for better visibility
        text = text.replace(/___PHONE_(\d+)___/g, '');

        // Clean up markdown formatting if needed
        text = text.replace(/^##\s+/gm, "## ");
        text = text.replace(/^#\s+/gm, "# ");
    }

    return text;
}


function cleanNoise(text: string): string {
    return text
        // Remove selected noise codes (but not markdown syntax)
        .replace(/\b(AB|NB|MI|ARJ)\b/g, "")
        // Remove patterns like ABC/XYZ (but preserve URLs)
        .replace(/\b[A-Z]{2,}\/[A-Z0-9]{2,}\b(?!\/)/g, "")
        // Collapse multiple spaces (but preserve intentional line breaks)
        .replace(/[^\S\r\n]+/g, " ")
        .trim();
}

function convertNumberingToBullet(text: string): string {
    return text.replace(
        /^(\s*)(?!_)([\p{L}\p{N}]+)\s*\/\s*/gmu,
        "$1- "
    );
}

/**
 * Main preprocessing function for markdown content
 */
export const preprocessContent = (text: string, lan: string): string => {
    if (!text) return '';

    // 🔥 CRITICAL FIX: Convert escaped newlines (\\n) to actual newlines
    text = text.replace(/\\n/g, '\n');

    // Also handle other escaped characters
    text = text.replace(/\\t/g, '\t');
    text = text.replace(/\\"/g, '"');
    text = text.replace(/\\'/g, "'");

    // Apply language-specific adjustments
    text = adjust_markdown_for_non_english(text, lan);

    // Step 1: Convert numbering patterns to bullets
    text = convertNumberingToBullet(text);

    // Step 2: Get sentence separator for the language
    const separator = findsperater(lan);

    // Step 3: Split by words while preserving newlines
    const lines = text.split('\n');
    const processedLines: string[] = [];

    for (const line of lines) {
        // Skip processing for markdown syntax lines
        if (line.trim().startsWith('#') ||
            line.trim().startsWith('-') ||
            line.trim().startsWith('*') ||
            line.trim().startsWith('>') ||
            line.trim().startsWith('```') ||
            line.trim().startsWith('|') ||
            line.trim() === '---' ||
            line.trim() === '') {
            processedLines.push(line);
            continue;
        }

        // Process words in this line
        const words = line.split(/\s+/);
        const processedWords: string[] = [];

        for (const word of words) {
            const trailingMatch = word.match(/[.,!?;:]+$/);
            const trailing = trailingMatch ? trailingMatch[0] : "";
            const cleanedWord = word.replace(/[.,!?;:]+$/, "");

            // Email detection
            if (EmailRegex.test(cleanedWord)) {
                processedWords.push(`[${cleanedWord}](mailto:${cleanedWord})${trailing}`);
            }
            // PDF detection
            else if (PdfRegex.test(cleanedWord)) {
                let url = cleanedWord;
                if (!IsVaildUrl.test(url)) url = `https://${url}`;
                processedWords.push(`<embed src="${url}" width="100%" height="500px" type="application/pdf" />`);
            }
            // Twitter/X embed detection
            else if (TwitterRegex.test(cleanedWord)) {
                processedWords.push(`<iframe src="${cleanedWord}" width="100%" height="500px" style="border: none; border-radius: 8px;"></iframe>`);
            }
            // URL detection
            else if (UrlRegex.test(cleanedWord)) {
                let url = cleanedWord;
                if (!IsVaildUrl.test(url)) url = `https://${url}`;
                processedWords.push(`[${cleanedWord}](${url})${trailing}`);
            }
            // Regular word
            else {
                processedWords.push(word); // Keep original word with punctuation
            }
        }

        processedLines.push(processedWords.join(' '));
    }

    // Join lines back with newlines
    return processedLines.join('\n');
};