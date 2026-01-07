import React from 'react'

type Props = {
    heading: string
    points: string[]
}

const KeyInforMation: React.FC<Props> = ({ heading, points }) => {
    return (
        <div className='flex flex-col gap-2'>
            <div>
                <h5>
                    {heading}
                </h5>
            </div>
            <div className='flex flex-col gap-2'>
                {points.map((point, index) => (
                    <div key={index} className='flex items-start gap-2 w-full md:w-[75%]'>
                        <span className='font-bold text-black'>•</span>
                        <p className='text-black leading-7 lg:leading-8'>{point}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default KeyInforMation