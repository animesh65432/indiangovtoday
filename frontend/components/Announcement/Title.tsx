import React from 'react'

type Props = {
    title: string
}

const Title: React.FC<Props> = ({ title }) => {
    return (
        <h1 className="font-satoshi text-xl md:text-2xl font-bold text-white leading-snug">
            {title}
        </h1>
    )
}

export default Title