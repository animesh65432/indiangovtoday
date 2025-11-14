import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentProps {
    content: string;
    IsAnnoucements: boolean
}

const Content: React.FC<ContentProps> = ({ content, IsAnnoucements }) => {

    /**
     * Clean and format content for better readability
     */
    const preprocessContent = (text: string): string => {
        if (!text) return '';

        let cleaned = text;

        // Step 1: Remove common markers and artifacts
        // Remove patterns like: **** NB/KMN, **** ABC/XYZ, etc.
        cleaned = cleaned.replace(/\*{2,}\s*[A-Z]{2,}\/[A-Z]{2,}\s*/g, '');

        // Remove other common artifacts
        cleaned = cleaned.replace(/\*{3,}/g, ''); // Remove multiple asterisks
        cleaned = cleaned.replace(/_{3,}/g, ''); // Remove multiple underscores
        cleaned = cleaned.replace(/\-{3,}/g, '---'); // Keep only 3 dashes for hr

        // Step 2: Smart paragraph breaking (every 3 sentences)
        // Split by sentence endings followed by space and capital letter
        const sentences = cleaned.split(/(?<=[.!?])\s+(?=[A-Z])/);

        let formatted = '';
        let sentenceCount = 0;

        for (let i = 0; i < sentences.length; i++) {
            formatted += sentences[i];
            sentenceCount++;

            // Add double line break after every 3 sentences (creates new paragraph)
            if (sentenceCount === 3 && i < sentences.length - 1) {
                formatted += '\n\n';
                sentenceCount = 0;
            } else if (i < sentences.length - 1) {
                formatted += ' ';
            }
        }

        // Step 3: Add visual break after approximately 35 lines
        const lines = formatted.split('\n');
        if (lines.length > 35) {
            // Insert a horizontal rule after line 35
            lines.splice(35, 0, '\n---\n');
            formatted = lines.join('\n');
        }

        return formatted;
    };

    const processedContent = preprocessContent(content);

    return (
        <div className="text-[#2B2B2B] custom-scroll overflow-x-auto overflow-y-auto">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Customize headings
                    h1: ({ node, ...props }: any) => (
                        <h1
                            className="text-2xl md:text-3xl font-bold mt-8 mb-5 text-gray-900 border-b-2 border-gray-200 pb-3"
                            {...props}
                        />
                    ),
                    h2: ({ node, ...props }: any) => (
                        <h2
                            className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900 border-l-4 border-blue-600 pl-4"
                            {...props}
                        />
                    ),
                    h3: ({ node, ...props }: any) => (
                        <h3
                            className="text-lg md:text-xl font-bold mt-6 mb-3 text-gray-900 border-l-4 border-blue-500 pl-3"
                            {...props}
                        />
                    ),

                    // Customize paragraphs - shorter line height for better density
                    p: ({ node, ...props }: any) => (
                        <p
                            className={`mb-6 text-gray-700 leading-loose text-[0.9rem] md:text-[1rem] ${!IsAnnoucements ? "lg:text-[1.1rem]" : null}`}
                            {...props}
                        />
                    ),

                    // Customize links
                    a: ({ node, ...props }: any) => (
                        <a
                            className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2 font-medium transition-colors hover:decoration-blue-700"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),

                    // Customize strong/bold
                    strong: ({ node, ...props }: any) => (
                        <strong
                            className="font-bold text-gray-900 bg-yellow-50 px-1 rounded"
                            {...props}
                        />
                    ),

                    // Customize em/italic
                    em: ({ node, ...props }: any) => (
                        <em
                            className="italic text-gray-700"
                            {...props}
                        />
                    ),

                    // Customize unordered lists
                    ul: ({ node, ...props }: any) => (
                        <ul
                            className="my-4 ml-6 space-y-2 list-disc marker:text-blue-600"
                            {...props}
                        />
                    ),

                    // Customize ordered lists
                    ol: ({ node, ...props }: any) => (
                        <ol
                            className="my-4 ml-6 space-y-2 list-decimal marker:text-blue-600 marker:font-semibold"
                            {...props}
                        />
                    ),

                    // Customize list items
                    li: ({ node, ...props }: any) => (
                        <li
                            className="text-gray-700 leading-relaxed pl-2"
                            {...props}
                        />
                    ),

                    // Customize blockquotes
                    blockquote: ({ node, ...props }: any) => (
                        <blockquote
                            className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r"
                            {...props}
                        />
                    ),

                    // Customize code blocks
                    code: ({ node, className, children, ...props }: any) => {
                        const isInline = !className;
                        return isInline ? (
                            <code
                                className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                                {...props}
                            >
                                {children}
                            </code>
                        ) : (
                            <code
                                className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    // Customize tables
                    table: ({ node, ...props }: any) => (
                        <div className="overflow-x-auto my-6">
                            <table
                                className="min-w-full border border-gray-300 rounded-lg"
                                {...props}
                            />
                        </div>
                    ),
                    thead: ({ node, ...props }: any) => (
                        <thead
                            className="bg-gray-100"
                            {...props}
                        />
                    ),
                    th: ({ node, ...props }: any) => (
                        <th
                            className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900"
                            {...props}
                        />
                    ),
                    td: ({ node, ...props }: any) => (
                        <td
                            className="border border-gray-300 px-4 py-2 text-gray-700"
                            {...props}
                        />
                    ),

                    // Customize horizontal rules - visual break
                    hr: ({ node, ...props }: any) => (
                        <hr
                            className="my-10 border-t-2 border-gray-300 shadow-sm"
                            {...props}
                        />
                    ),
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};

export default Content;