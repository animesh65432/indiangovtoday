import React from 'react'

type Props = {
    heading: string
    points: string[]
}

const KeyInforMation: React.FC<Props> = ({ heading, points }) => {
    return (
        <div className='flex flex-col gap-2 font-satoshi text-multiselect'>
            <div>
                <h3 className='text-[1.4rem] font-semibold'>
                    {heading}
                </h3>
            </div>
            <div className='flex flex-col gap-2'>
                {points.map((point, index) => (
                    <div key={index} className='flex items-start gap-2 w-full md:w-[75%]'>
                        <span className='font-bold '>•</span>
                        <p className='leading-7 lg:leading-8 text-[1.2rem]'>{point}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default KeyInforMation