import React from 'react'

type LogoProps = {
    fst: string,
    snd: string
}

const Logo = ({ fst, snd }: LogoProps) => {
    return (
        <div className="flex  gap-2 select-none font-tanker text-color">
            <span className="text-xl sm:text-2xl font-medium">
                {fst.toUpperCase()}
            </span>

            <span className="text-xl sm:text-2xl  ">
                {snd.toUpperCase()}
            </span>
        </div>
    )
}

export default Logo