import React from 'react'

type Props = {
    title: string
}

const Title: React.FC<Props> = ({ title }) => {
    return (
        <h1 className="font-satoshi leading-snug text-2xl md:text-3xl font-bold text-[#ff3333]">
            {title}
        </h1>
    )
}

export default Title