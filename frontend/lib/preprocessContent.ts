// lib/preprocessContent.ts - UPDATED VERSION

import { EmailRegex } from "./EmailRegex"
import { PdfRegex } from "./Pdfregex"
import { TwitterRegex } from "./TwitterRegex"
import { UrlRegex, IsVaildUrl } from "./UrlRegex"

/**
 * Clean up translated content - removes artifacts from translation
 */
function cleanTranslatedContent(text: string, lan: string): string {
    if (lan === "English") return text;

    // Remove ALL hashtags (both at start and in middle of text)
    text = text.replace(/#[^\s#]+/g, '');

    // Remove words that have ellipsis cutting through them (দায়িত্…য়া)
    text = text.replace(/[\p{L}\p{N}]+…[\p{L}\p{N}]+/gu, '');

    // Remove truncation markers with content between them (…text…)
    text = text.replace(/…[^…\n]*…/g, '');

    // Remove sentences ending with ellipsis (incomplete)
    text = text.replace(/[^\n.।۔]*…/g, '');

    // Remove isolated ellipsis
    text = text.replace(/…+/g, '');

    // Remove leftover English words that are translation artifacts
    text = text.replace(/\b[A-Z][a-z]+\s+\d+,\s+\d{4}\b/g, ''); // dates like "January 1, 2003"

    // Clean up malformed bullet points: * *- or ** - 
    text = text.replace(/^\s*\*+\s*[-*]+\s*/gm, '- ');

    // Clean up excessive spaces
    text = text.replace(/\s{2,}/g, ' ');

    // Remove empty lines with just spaces
    text = text.replace(/^\s+$/gm, '');

    return text;
}

/**
 * Normalize text structure for better markdown rendering
 */
function normalizeMarkdownStructure(text: string, lan: string): string {
    if (lan === "English") return text;

    // Ensure proper paragraph breaks before headers
    text = text.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');

    // Fix header formatting - ensure space after # symbols
    text = text.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');

    // Convert multiple consecutive # at line start to proper markdown
    text = text.replace(/^#{3,}(\s|$)/gm, '### ');
    text = text.replace(/^#{2}(\s|$)/gm, '## ');
    text = text.replace(/^#{1}(\s|$)/gm, '## ');

    // Fix bullet points - normalize different bullet styles
    text = text.replace(/^[•·◦▪▫]\s*/gm, '- ');

    // Ensure blank line before and after lists
    text = text.replace(/([^\n])\n(-\s)/g, '$1\n\n$2');
    text = text.replace(/(-\s[^\n]+)\n([^\n-])/g, '$1\n\n$2');

    return text;
}

/**
 * Fix language-specific punctuation and spacing
 */
function fixPunctuation(text: string, lan: string): string {
    // Bengali, Hindi, Marathi, Nepali use ।
    if (['বাংলা', 'हिन्दी', 'मराठी', 'नेपाली'].includes(lan)) {
        text = text.replace(/\s+।/g, '।');
        text = text.replace(/।([^\s\n])/g, '। $1');
    }

    // Tamil uses .
    if (lan === 'தமிழ்') {
        text = text.replace(/\s+\./g, '.');
        text = text.replace(/\.([^\s\n])/g, '. $1');
    }

    // Urdu, Kashmiri, Sindhi (RTL languages)
    if (['اردو', 'کٲشُر', 'سنڌي'].includes(lan)) {
        text = text.replace(/\s+([۔،؛:])/g, '$1');
        text = text.replace(/([۔،؛:])([^\s\n])/g, '$1 $2');
    }

    // Fix English punctuation spacing for all languages
    text = text.replace(/\s+([.,;:!?])/g, '$1');
    text = text.replace(/([.,;:!?])([^\s\n])/g, '$1 $2');

    return text;
}

/**
 * Remove incomplete sentences and clean up edges
 */
function cleanIncompleteSentences(text: string, lan: string): string {
    if (lan === "English") return text;

    // Split into lines
    const lines = text.split('\n');
    const cleanedLines: string[] = [];
    const seenContent = new Set<string>(); // Track duplicate content

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Skip empty lines
        if (!line) {
            cleanedLines.push('');
            continue;
        }

        // Skip duplicate lines (same content appearing twice)
        const normalizedLine = line.replace(/\s+/g, ' ').toLowerCase();
        if (seenContent.has(normalizedLine)) {
            continue;
        }
        seenContent.add(normalizedLine);

        // Keep markdown syntax lines as-is
        if (line.match(/^#{1,6}\s/) || line.match(/^[-*+]\s/) || line.match(/^\d+\.\s/)) {
            cleanedLines.push(line);
            continue;
        }

        // Remove lines that start with ellipsis or seem truncated
        if (line.startsWith('…') || line.endsWith('…')) {
            continue;
        }

        // Remove lines with mid-word ellipsis (text is broken)
        if (line.match(/[\p{L}\p{N}]…[\p{L}\p{N}]/u)) {
            continue;
        }

        // Remove very short fragments (less than 20 chars, unless it's a header or list)
        if (line.length < 20 && !line.match(/^#{1,6}\s/) && !line.match(/^[-*+]\s/)) {
            continue;
        }

        cleanedLines.push(line);
    }

    return cleanedLines.join('\n');
}

/**
 * Adjust markdown for non-English languages
 */
function adjust_markdown_for_non_english(text: string, lan: string): string {
    if (lan === "English") return text;

    // Remove phone number placeholders
    text = text.replace(/___PHONE_(\d+)___/g, '');

    // Remove any remaining English reference codes
    text = text.replace(/\b(AB|NB|MI|ARJ|KPCS)\b/g, '');

    // Remove patterns like "ABC/XYZ/123"
    text = text.replace(/\b[A-Z]{2,}\/[A-Z0-9]{2,}\b/g, '');

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

    // Step 3: Clean translated content artifacts
    text = cleanTranslatedContent(text, lan);

    // Step 3: Clean translated content artifacts
    text = cleanTranslatedContent(text, lan);

    // Step 4: Normalize markdown structure
    text = normalizeMarkdownStructure(text, lan);

    // Step 5: Fix punctuation
    text = fixPunctuation(text, lan);

    // Step 6: Remove incomplete sentences
    text = cleanIncompleteSentences(text, lan);

    // Step 7: Apply language-specific adjustments
    text = adjust_markdown_for_non_english(text, lan);

    // Step 8: Convert numbering patterns to bullets
    text = convertNumberingToBullet(text);

    // Step 9: Process URLs, emails, etc. (existing logic)
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

    // Step 10: Final cleanup
    text = finalCleanup(text);

    return text;
};