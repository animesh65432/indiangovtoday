export const preprocessContent = (text: string): string => {
    if (!text) return '';

    let cleaned = text;
    cleaned = cleaned.replace(/\*{2,}\s*[A-Z]{2,}\/[A-Z]{2,}\s*/g, '');

    cleaned = cleaned.replace(/\*{3,}/g, '');
    cleaned = cleaned.replace(/_{3,}/g, '');
    cleaned = cleaned.replace(/\-{3,}/g, '---');

    const sentences: string[] = [];
    let currentSentence = '';

    for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];
        const nextChar = cleaned[i + 1];

        currentSentence += char;

        // Check if this is a sentence delimiter followed by space/newline
        if ((char === '.' || char === '!' || char === '?' || char === '।' || char === '|') &&
            nextChar && /\s/.test(nextChar)) {
            // Add remaining whitespace to current sentence
            let j = i + 1;
            while (j < cleaned.length && /\s/.test(cleaned[j])) {
                currentSentence += cleaned[j];
                j++;
            }
            i = j - 1;

            sentences.push(currentSentence.trim());
            currentSentence = '';
        }
    }

    // Add any remaining text as the last sentence
    if (currentSentence.trim()) {
        sentences.push(currentSentence.trim());
    }

    // Step 3: Format with paragraph breaks every 3 sentences
    let formatted = '';
    for (let i = 0; i < sentences.length; i++) {
        formatted += sentences[i];

        if ((i + 1) % 3 === 0 && i < sentences.length - 1) {
            // Add paragraph break after every 3 sentences
            formatted += '\n\n';
        } else if (i < sentences.length - 1) {
            // Add single space between sentences within same paragraph
            formatted += ' ';
        }
    }

    // Step 4: Add visual break after approximately 35 lines
    const lines = formatted.split('\n');
    if (lines.length > 35) {
        lines.splice(35, 0, '\n---\n');
        formatted = lines.join('\n');
    }

    //Remove the extra words

    let arr = formatted.split("");
    let lastDot = formatted.lastIndexOf(".");
    arr.splice(lastDot + 1).join("").trim();
    formatted = arr.join("");

    return formatted;
};