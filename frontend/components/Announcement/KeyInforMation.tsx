import { ThemeContext } from '@/context/Theme'
import React, { useContext } from 'react'

type Props = {
    heading: string
    points: string[]
}

const KeyInforMation: React.FC<Props> = ({ heading, points }) => {
    const { theme } = useContext(ThemeContext)
    const isDark = theme === "dark"

    return (
        <div className="flex flex-col gap-4 font-satoshi">
            <div className="flex items-center gap-3">
                <div className="w-[3px] h-6 rounded-full bg-[#c51057] flex-shrink-0" />
                <h3 className={`text-[1.15rem] md:text-[1.3rem] font-semibold leading-snug
                    ${isDark ? "text-white/90" : "text-[#321F1F]"}`}>
                    {heading}
                </h3>
            </div>

            <ul className="flex flex-col gap-3 pl-[15px] border-l border-[#c51057]/10">
                {points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 w-full md:w-[75%]">
                        <span className="mt-[6px] w-[6px] h-[6px] rounded-full bg-[#c51057]/50 flex-shrink-0" />
                        <p className={`text-[1rem] md:text-[1.1rem] leading-7
                            ${isDark ? "text-white/50" : "text-[#321F1F]/60"}`}>
                            {point}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default KeyInforMation