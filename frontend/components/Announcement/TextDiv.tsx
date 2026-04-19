import { ThemeContext } from '@/context/Theme'
import React from 'react'

type Props = {
    heading: string
    content: string
}

const TextDiv: React.FC<Props> = ({ heading, content }) => {
    const { theme } = React.useContext(ThemeContext)
    const isDark = theme === "dark"

    return (
        <div className="flex flex-col gap-3 font-satoshi">
            <div className="flex items-center gap-3">
                <div className="w-[3px] h-6 rounded-full bg-[#c51057] flex-shrink-0" />
                <h3 className={`text-[1.15rem] md:text-[1.3rem] font-semibold leading-snug
                    ${isDark ? "text-white/90" : "text-[#321F1F]"}`}>
                    {heading}
                </h3>
            </div>
            <p className={`text-[1rem] md:text-[1.1rem] leading-relaxed pl-[15px] border-l border-[#c51057]/10
                ${isDark ? "text-white/50" : "text-[#321F1F]/60"}`}>
                {content}
            </p>
        </div>
    )
}

export default TextDiv