import React from 'react'

type Props = {
    heading: string
    points: string[]
}

const KeyInforMation: React.FC<Props> = ({ heading, points }) => {
    return (
        <div className="flex flex-col gap-4 font-satoshi">
            {/* Heading */}
            <div className="flex items-center gap-3">
                <div className="w-[3px] h-6 rounded-full bg-[#FF9933] flex-shrink-0" />
                <h3 className="text-white text-[1.15rem] md:text-[1.3rem] font-semibold leading-snug">
                    {heading}
                </h3>
            </div>

            {/* Points */}
            <ul className="flex flex-col gap-3 pl-[15px] border-l border-[#FF9933]/10">
                {points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 w-full md:w-[75%]">
                        {/* Saffron bullet */}
                        <span className="mt-[6px] w-[6px] h-[6px] rounded-full bg-[#FF9933]/60 flex-shrink-0" />
                        <p className="text-white/65 text-[1rem] md:text-[1.1rem] leading-7">
                            {point}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default KeyInforMation