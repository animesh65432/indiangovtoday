import React from 'react'

type Props = {
    title: string
}

const Title: React.FC<Props> = ({ title }) => {
    return (
        <h3 className='text-multiselect  font-satoshi text-xl md:text-2xl font-bold'>
            {title}
        </h3>
    )
}

export default Title