import { EmailRegex } from "./EmailRegex"
import { PdfRegex } from "./Pdfregex"
import { TwitterRegex } from "./TwitterRegex"
import { UrlRegex, IsVaildUrl } from "./UrlRegex"
import { findsperater } from "@/lib/findsperater"

/**
 * Clean noise without breaking markdown syntax
 */
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

/**
 * Convert numbering patterns to bullets (only at line start)
 */
function convertNumberingToBullet(text: string): string {
    return text.replace(
        /^(\s*)([\p{L}\p{N}]+)\s*\/\s*/gmu,
        "$1- "
    );
}

/**
 * Check if a word is part of markdown syntax
 */
function isMarkdownSyntax(word: string): boolean {
    const markdownPatterns = [
        /^\*\*.*\*\*$/,        // **bold**
        /^\*.*\*$/,            // *italic*
        /^__.*__$/,            // __bold__
        /^_.*_$/,              // _italic_
        /^~~.*~~$/,            // ~~strikethrough~~
        /^`.*`$/,              // `code`
        /^#+\s/,               // # headers
        /^\[.*\]\(.*\)$/,      // [link](url)
        /^!\[.*\]\(.*\)$/,     // ![image](url)
        /^>\s/,                // > blockquote
        /^-\s/,                // - list
        /^\*\s/,               // * list
        /^\d+\.\s/,            // 1. numbered list
        /^```/,                // ``` code block
        /^\|.*\|$/,            // | table |
    ];

    return markdownPatterns.some(pattern => pattern.test(word));
}

/**
 * Process a single word (convert emails, URLs, PDFs to markdown)
 */
function processWord(word: string): string {
    // Extract trailing punctuation
    const trailingMatch = word.match(/[.,!?;:]+$/);
    const trailing = trailingMatch ? trailingMatch[0] : "";
    const cleanedWord = word.replace(/[.,!?;:]+$/, "");

    // Skip if already markdown syntax
    if (isMarkdownSyntax(cleanedWord)) {
        return word;
    }

    // Email detection
    if (EmailRegex.test(cleanedWord)) {
        return `[${cleanedWord}](mailto:${cleanedWord})${trailing}`;
    }

    // PDF detection
    if (PdfRegex.test(cleanedWord)) {
        let url = cleanedWord;
        if (!IsVaildUrl.test(url)) url = `https://${url}`;
        return `<embed src="${url}" width="100%" height="500px" type="application/pdf" />`;
    }

    // Twitter/X embed detection
    if (TwitterRegex.test(cleanedWord)) {
        return `<iframe src="${cleanedWord}" width="100%" height="500px" style="border: none; border-radius: 8px;"></iframe>`;
    }

    // URL detection
    if (UrlRegex.test(cleanedWord)) {
        let url = cleanedWord;
        if (!IsVaildUrl.test(url)) url = `https://${url}`;
        return `[${cleanedWord}](${url})${trailing}`;
    }

    // Return cleaned word
    return cleanNoise(cleanedWord) + trailing;
}

/**
 * Add paragraph breaks intelligently (respecting markdown structure)
 */
function addParagraphBreaks(text: string, separator: string): string {
    const lines = text.split('\n');
    const result: string[] = [];
    let sentenceCount = 0;

    for (const line of lines) {
        // Don't add breaks inside markdown blocks
        if (line.trim().startsWith('#') ||
            line.trim().startsWith('-') ||
            line.trim().startsWith('*') ||
            line.trim().startsWith('>') ||
            line.trim().startsWith('```') ||
            line.trim().startsWith('|')) {
            result.push(line);
            sentenceCount = 0;
            continue;
        }

        // Count sentences in this line
        const sentences = line.split(separator).length - 1;
        sentenceCount += sentences;

        result.push(line);

        // Add paragraph break after 4 sentences
        if (sentenceCount >= 4) {
            result.push(''); // Empty line creates paragraph break in markdown
            sentenceCount = 0;
        }
    }

    return result.join('\n');
}

/**
 * Main preprocessing function for markdown content
 */
export const preprocessContent = (text: string, lan: string): string => {
    if (!text) return '';

    // Step 1: Convert numbering patterns to bullets
    text = convertNumberingToBullet(text);

    // Step 2: Get sentence separator for the language
    const separator = findsperater(lan);

    // Step 3: Process word by word (preserving markdown)
    const words = text.split(/\s+/);
    const processedWords = words.map(word => processWord(word));

    // Step 4: Rejoin text
    let processedText = processedWords.join(' ');

    // Step 5: Add intelligent paragraph breaks
    processedText = addParagraphBreaks(processedText, separator);

    // Step 6: Final cleanup
    processedText = cleanNoise(processedText);

    return processedText;
};