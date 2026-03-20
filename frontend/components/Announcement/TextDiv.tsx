import React from 'react'

type Props = {
    heading: string
    content: string
}

const Summary: React.FC<Props> = ({ heading, content }) => {
    return (
        <div className='flex flex-col gap-2 font-satoshi text-multiselect'>
            <div>
                <h3 className='font-semibold text-[1.4rem]'>
                    {heading}
                </h3>
            </div>
            <p className='leading-relaxed w-full lg:w-[60vw] text-[1.2rem]'>{content}</p>
        </div>
    )
}

export default Summary