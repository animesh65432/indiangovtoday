import React from 'react';

const Content = ({ content }: { content: string }) => {

    const cleanText = (text: string) => {
        let cleaned = text;

        // Remove pic.twitter.com links
        cleaned = cleaned.replace(/pic\.twitter\.com\/\S+/g, '');

        // Remove repeated hashtags or mentions joined together
        cleaned = cleaned.replace(/([#@]\w+)([#@]\w+)/g, '$1 ');

        // Remove sections that contain only hashtags, mentions, or junk characters
        cleaned = cleaned.replace(
            /((?:[#@]\w+\s*){2,}|\*{2,}.*|SS\/\s*MS|ViksitBharat2047\s*)/gi,
            ''
        );

        // Remove trailing "(1/3)" or similar numbering
        cleaned = cleaned.replace(/\(\d+\/\d+\)/g, '');

        // Remove press agency codes like "... PK/KC/KJ" or "PK/MS/KJ"
        cleaned = cleaned.replace(/\.{2,}\s*[A-Z]{2}\/[A-Z]{2}\/[A-Z]{2}\s*/g, '');
        cleaned = cleaned.replace(/\s+[A-Z]{2}\/[A-Z]{2}\/[A-Z]{2}\s*$/g, '');

        // Collapse extra spaces left behind
        cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

        return cleaned;
    };

    const processContent = (text: string) => {
        text = cleanText(text);
        text = text.replace(/\\n/g, '\n');
        text = text.replace(/(#\w+)(?=#)/g, '$1 ');
        text = text.replace(/(@\w+)(?=@)/g, '$1 ');

        const parts = text.split(
            /(https?:\/\/[^\s]+|[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+|#\w+|@\w+)/g
        );

        return parts.map((part, index) => {
            if (!part) return null;

            if (part.match(/^https?:\/\//)) {
                // Extract domain or show shortened version
                let displayText = part;
                try {
                    const url = new URL(part);
                    displayText = url.hostname + (url.pathname !== '/' ? url.pathname.substring(0, 30) : '');
                    if (part.length > displayText.length + 10) displayText += '...';
                } catch (e) {
                    // If URL parsing fails, show first 50 chars
                    displayText = part.length > 50 ? part.substring(0, 50) + '...' : part;
                }
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                        title={part}
                    >
                        {displayText}
                    </a>
                );
            }

            if (part.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/)) {
                return (
                    <a
                        key={index}
                        href={`mailto:${part}`}
                        className="text-blue-600 hover:underline break-all"
                        title={part}
                    >
                        📧 {part}
                    </a>
                );
            }

            if (part.match(/^#\w+$/)) {
                const tag = part.substring(1);
                return (
                    <a
                        key={index}
                        href={`https://twitter.com/hashtag/${tag}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {part}
                    </a>
                );
            }

            if (part.match(/^@\w+$/)) {
                const user = part.substring(1);
                return (
                    <a
                        key={index}
                        href={`https://twitter.com/${user}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {part}
                    </a>
                );
            }

            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="whitespace-pre-line text-[#2B2B2B] h-[60vh] custom-scroll overflow-x-auto leading-8 md:leading-9 text-[0.9rem] md:text-[1rem] lg:text-[1.1rem]">
            {processContent(content)}
        </div>
    );
};

export default Content;