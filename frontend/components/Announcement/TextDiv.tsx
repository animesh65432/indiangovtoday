import React from 'react'

type Props = {
    heading: string
    content: string
}

const TextDiv: React.FC<Props> = ({ heading, content }) => {
    return (
        <div className="flex flex-col gap-3 font-satoshi">
            {/* Heading with left saffron accent */}
            <div className="flex items-center gap-3">
                <div className="w-[3px] h-6 rounded-full bg-[#FF9933] flex-shrink-0" />
                <h3 className="text-white text-[1.15rem] md:text-[1.3rem] font-semibold leading-snug">
                    {heading}
                </h3>
            </div>
            {/* Content */}
            <p className="text-white/65 text-[1rem] md:text-[1.1rem] leading-relaxed pl-[15px] border-l border-[#FF9933]/10">
                {content}
            </p>
        </div>
    )
}

export default TextDiv