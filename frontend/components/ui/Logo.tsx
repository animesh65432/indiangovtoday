import { ThemeContext } from '@/context/Theme'
import React from 'react'

type LogoProps = {
    fst: string,
    snd: string
}

const Logo = ({ fst, snd }: LogoProps) => {
    const { theme } = React.useContext(ThemeContext)
    return (
        <div className="flex-1 flex  gap-1 select-none font-satoshi text-color">
            <span>🇮🇳</span>
            <span className={`text-[0.9rem] font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>
                {fst}{snd}
            </span>
        </div>
    )
}

export default Logo