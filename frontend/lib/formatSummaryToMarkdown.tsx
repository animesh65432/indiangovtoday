import { JSX } from "react";

export function formatSummaryToMarkdown(summary: string): JSX.Element {
    if (!summary) return <></>;


    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/[^\s]*)?/g;
    const phoneRegex = /\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;

    // Function to process text and add underlines to emails, URLs, and phone numbers
    const processText = (text: string) => {
        const parts: (string | JSX.Element)[] = [];
        let currentIndex = 0;

        // Find all matches with their positions
        const allMatches: Array<{
            start: number;
            end: number;
            text: string;
            type: 'email' | 'url' | 'phone';
        }> = [];

        // Find emails
        let match: RegExpExecArray | null;
        while ((match = emailRegex.exec(text)) !== null) {
            allMatches.push({
                start: match.index,
                end: match.index + match[0].length,
                text: match[0],
                type: 'email'
            });
        }

        // Reset and find URLs
        urlRegex.lastIndex = 0;
        while ((match = urlRegex.exec(text)) !== null) {
            // Check if this match is not part of an email
            const isPartOfEmail = allMatches.some(
                m => m.type === 'email' && match!.index >= m.start && match!.index < m.end
            );
            if (!isPartOfEmail) {
                allMatches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'url'
                });
            }
        }

        // Reset and find phone numbers
        phoneRegex.lastIndex = 0;
        while ((match = phoneRegex.exec(text)) !== null) {
            const cleanPhone = match[0].replace(/[\s.()-]/g, '');
            // Only include if it has at least 10 digits (valid phone number length)
            if (cleanPhone.length >= 10) {
                allMatches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    type: 'phone'
                });
            }
        }

        // Sort by start position and remove overlaps
        allMatches.sort((a, b) => a.start - b.start);
        const filteredMatches = allMatches.filter((current, index) => {
            if (index === 0) return true;
            const previous = allMatches[index - 1];
            return current.start >= previous.end;
        });

        // Build the result with underlined links
        filteredMatches.forEach((match, index) => {
            // Add text before the match
            if (match.start > currentIndex) {
                parts.push(text.substring(currentIndex, match.start));
            }

            // Add the underlined link
            if (match.type === 'email') {
                parts.push(
                    <a
                        key={`email-${index}`}
                        href={`mailto:${match.text}`}
                        className="underline text-gray-800 hover:text-gray-900 transition-colors"
                    >
                        {match.text}
                    </a>
                );
            } else if (match.type === 'url') {
                const href = match.text.startsWith('http') ? match.text : `https://${match.text}`;
                parts.push(
                    <a
                        key={`url-${index}`}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-gray-800 hover:text-gray-900 transition-colors"
                    >
                        {match.text}
                    </a>
                );
            } else if (match.type === 'phone') {
                const cleanPhone = match.text.replace(/[\s.()-]/g, '');
                parts.push(
                    <a
                        key={`phone-${index}`}
                        href={`tel:${cleanPhone}`}
                        className="underline text-gray-800 hover:text-gray-900 transition-colors"
                    >
                        {match.text}
                    </a>
                );
            }

            currentIndex = match.end;
        });

        // Add remaining text
        if (currentIndex < text.length) {
            parts.push(text.substring(currentIndex));
        }

        return parts;
    };

    return (
        <div className="leading-relaxed whitespace-pre-line">
            {processText(summary)}
        </div>
    );
}