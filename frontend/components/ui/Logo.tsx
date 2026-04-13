import React from 'react'

type LogoProps = {
    fst: string,
    snd: string
}

const Logo = ({ fst, snd }: LogoProps) => {
    return (
        <div className="flex-1 flex  gap-1 select-none font-satoshi text-color">
            <span>🇮🇳</span>
            <span className="text-[0.9rem] font-semibold">
                {fst}{snd}
            </span>
        </div>
    )
}

export default Logo