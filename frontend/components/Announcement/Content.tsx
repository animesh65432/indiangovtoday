import React from 'react';

const Content = ({ content }: { content: string }) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    const hashtagRegex = /#(\w+)/g;
    const mentionRegex = /@(\w+)/g;

    const cleanText = (text: string) => {
        let cleaned = text;

        // 1️⃣ Remove any pic.twitter.com links
        cleaned = cleaned.replace(/pic\.twitter\.com\/\S+/g, '');

        // 2️⃣ Remove repeated hashtags or mentions joined together
        cleaned = cleaned.replace(/([#@]\w+)([#@]\w+)/g, '$1 ');

        // 3️⃣ Remove sections that contain only hashtags, mentions, or junk characters
        cleaned = cleaned.replace(
            /((?:[#@]\w+\s*){2,}|\*{2,}.*|SS\/\s*MS|ViksitBharat2047\s*)/gi,
            ''
        );

        // 4️⃣ Remove trailing "(1/3)" or similar numbering
        cleaned = cleaned.replace(/\(\d+\/\d+\)/g, '');

        // 5️⃣ Collapse extra spaces left behind
        cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

        return cleaned;
    };

    const processContent = (text: string) => {
        text = cleanText(text);
        text = text.replace(/\\n/g, '\n');
        text = text.replace(/(#\w+)(?=#)/g, '$1 ');
        text = text.replace(/(@\w+)(?=@)/g, '$1 ');

        const parts = text.split(
            /((https?:\/\/[^\s]+)|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)|(#\w+)|(@\w+))/g
        );

        return parts.map((part, index) => {
            if (!part) return null;

            if (urlRegex.test(part)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                    >
                        {part}
                    </a>
                );
            }

            if (emailRegex.test(part)) {
                return (
                    <a
                        key={index}
                        href={`mailto:${part}`}
                        className="text-blue-600 hover:underline break-all"
                    >
                        {part}
                    </a>
                );
            }

            if (hashtagRegex.test(part)) {
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

            if (mentionRegex.test(part)) {
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
