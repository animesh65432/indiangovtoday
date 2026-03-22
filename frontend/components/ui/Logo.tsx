import React from 'react'

type LogoProps = {
    fst: string,
    snd: string
}

const Logo = ({ fst, snd }: { fst: string; snd: string }) => {
    return (
        <div className="flex flex-col leading-none select-none">
            <span className="text-[10px] tracking-[0.3em] text-[#FFB366] font-medium">
                {fst.toUpperCase()}
            </span>

            <span className="text-xl sm:text-2xl font-semibold text-white">
                {snd.toUpperCase()}
            </span>

            <div className="h-0.5 w-full bg-[#FF9933] mt-1" />
        </div>
    )
}

export default Logo