import React from 'react'

type Props = {
    heading: string
    content: string
}

const Summary: React.FC<Props> = ({ heading, content }) => {
    return (
        <div className='flex flex-col gap-2 font-satoshi text-multiselect'>
            <div>
                <h3 className='font-semibold text-xl'>
                    {heading}
                </h3>
            </div>
            <p className='leading-relaxed w-full lg:w-[60vw]'>{content}</p>
        </div>
    )
}

export default Summary