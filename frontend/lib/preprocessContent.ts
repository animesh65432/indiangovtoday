import { EmailRegex } from "./EmailRegex"
import { PdfRegex } from "./Pdfregex"
import { TwitterRegex } from "./TwitterRegex"
import { UrlRegex, IsVaildUrl } from "./UrlRegex"

/**
 * Fix broken markdown syntax from translation
 */
function fixBrokenMarkdown(text: string, lan: string): string {
    if (lan === "English") return text;

    // 1. \*  → *
    text = text.replace("#", '#');

    // 2. * *  → **
    text = text.replace(/###/g, '\n\n###');

    // 3. remove lonely *
    text = text.replace(/ \*/g, '\n\n**');

    return text;
}

/**
 * Normalize text structure for better markdown rendering
 */
function normalizeMarkdownStructure(text: string, lan: string): string {
    if (lan === "English") return text;

    // Convert multiple consecutive # at line start to proper markdown
    text = text.replace(/^#{3,}(\s|$)/gm, '### ');
    text = text.replace(/^#{2}(\s|$)/gm, '## ');
    text = text.replace(/^#{1}(\s|$)/gm, '## ');

    // Fix bullet points - normalize different bullet styles
    text = text.replace(/^[•·◦▪▫]\s*/gm, '- ');

    // Ensure blank line before and after lists
    text = text.replace(/([^\n])\n(-\s)/g, '$1\n\n$2');
    text = text.replace(/(-\s[^\n]+)\n([^\n-])/g, '$1\n\n$2');

    // Ensure blank line after headers
    text = text.replace(/(^#{1,6}\s[^\n]+)\n([^#\n])/gm, '$1\n\n$2');

    return text;
}


/**
 * Final cleanup pass
 */
function finalCleanup(text: string): string {
    // Remove multiple consecutive blank lines (keep max 2)
    text = text.replace(/\n{3,}/g, '\n\n');

    // Remove trailing spaces on each line
    text = text.replace(/[ \t]+$/gm, '');

    // Remove leading spaces (except for intended indentation in lists/code)
    text = text.replace(/^[ \t]+(?![-*+]|\d+\.)/gm, '');

    // Ensure content ends with single newline
    text = text.trim() + '\n';

    return text;
}

/**
 * Convert numbering to bullets
 */
function convertNumberingToBullet(text: string): string {
    return text.replace(
        /^(\s*)(?!_)([\p{L}\p{N}]+)\s*\/\s*/gmu,
        "$1- "
    );
}

/**
 * Remove duplicate blocks of text (common in translations)
 */
function removeDuplicateBlocks(text: string): string {
    const lines = text.split('\n');
    const blocks: string[] = [];
    let currentBlock: string[] = [];

    for (const line of lines) {
        if (line.trim() === '') {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'));
                currentBlock = [];
            }
            blocks.push(''); // preserve empty line
        } else {
            currentBlock.push(line);
        }
    }

    if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'));
    }

    // Remove duplicate blocks (keep only first occurrence)
    const seen = new Set<string>();
    const uniqueBlocks = blocks.filter(block => {
        if (block === '') return true; // keep empty lines
        const normalized = block.replace(/\s+/g, ' ').toLowerCase();
        if (seen.has(normalized)) {
            return false; // duplicate
        }
        seen.add(normalized);
        return true;
    });

    return uniqueBlocks.join('\n');
}

/**
 * Main preprocessing function for markdown content
 */
export const preprocessContent = (text: string, lan: string): string => {
    if (!text) return '';

    // Step 1: Convert escaped characters
    text = text.replace(/\\n/g, '\n');
    text = text.replace(/\\t/g, '\t');
    text = text.replace(/\\"/g, '"');
    text = text.replace(/\\'/g, "'");

    // Step 2: Remove duplicate blocks (entire paragraphs repeated)
    text = removeDuplicateBlocks(text);

    // Step 4: FIX BROKEN MARKDOWN (This is the key fix!)
    text = fixBrokenMarkdown(text, lan);

    // Step 5: Normalize markdown structure
    text = normalizeMarkdownStructure(text, lan);

    // Step 9: Convert numbering patterns to bullets
    text = convertNumberingToBullet(text);

    // Step 10: Process URLs, emails, etc. (existing logic)
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
            const trailingMatch = word.match(/[.,!?;:।۔]+$/);
            const trailing = trailingMatch ? trailingMatch[0] : "";
            const cleanedWord = word.replace(/[.,!?;:।۔]+$/, "");

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
                processedWords.push(word);
            }
        }

        processedLines.push(processedWords.join(' '));
    }

    text = processedLines.join('\n');

    // Step 11: Final cleanup
    text = finalCleanup(text);

    return text;
};