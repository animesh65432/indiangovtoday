import React from 'react'

type Props = {
    title: string
}

const Title: React.FC<Props> = ({ title }) => {
    return (
        <h4 className='text-black'>
            {title}
        </h4>
    )
}

export default Title