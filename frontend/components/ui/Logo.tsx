import React from 'react'

type LogoProps = {
    fst: string,
    snd: string
}

const Logo = ({ fst, snd }: LogoProps) => {
    return (
        <div className="flex  gap-2 select-none font-satoshi text-color">
            <span className="text-[0.9rem] font-semibold">
                {fst}{snd}
            </span>
        </div>
    )
}

export default Logo