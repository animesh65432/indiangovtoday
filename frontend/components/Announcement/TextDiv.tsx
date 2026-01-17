import React from 'react'

type Props = {
    heading: string
    content: string
}

const Summary: React.FC<Props> = ({ heading, content }) => {
    return (
        <div className='flex flex-col gap-2'>
            <div>
                <h5>
                    {heading}
                </h5>
            </div>
            <p className='text-black leading-7 lg:leading-8 w-full lg:w-[60vw]'>{content}</p>
        </div>
    )
}

export default Summary