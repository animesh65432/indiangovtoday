import React from 'react';

const Content = ({ content }: { content: string }) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;

    const processContent = (text: string) => {
        text = text.replace(/\\n/g, '\n');

        const parts = text.split(/((https?:\/\/[^\s]+)|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+))/g);

        return parts.map((part, index) => {
            if (!part) return null;


            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:underline underline break-all"
                    >
                        {part}
                    </a>
                );
            }

            if (part.match(emailRegex)) {
                return (
                    <a
                        key={index}
                        href={`mailto:${part}`}
                        className="text-black hover:underline underline break-all"
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
export default Content