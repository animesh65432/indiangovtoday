import React, { useState } from 'react'
import { Share } from "lucide-react"
import ShareSection from '../Share'

type Props = {
    title: string
    content: string
    source: string
}

const ShowAnnouncement: React.FC<Props> = ({ title, content, source }: Props) => {
    const [toggle, settoogle] = useState<boolean>(false)

    return (
        <div className='w-[85%] mx-auto flex flex-col gap-6 pt-7'>
            <div className='flex items-center justify-between text-[1rem] sm:text-xl md:text-2xl text-[#1a1919]'>
                <div>
                    {title}
                </div>
                <div>
                    <Share onClick={() => settoogle((prev) => !prev)} />
                    {toggle &&
                        <ShareSection Announcement={title} setisShareOPen={settoogle} />}
                </div>
            </div>
            <div className='text-[#353535] leading-relaxed text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]'>{content}</div>
            <div className='text-[#353535] text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]'>
                <p className="text-gray-500 italic text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]">
                    Source:{" "}
                    <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {source}
                    </a>
                </p>
            </div>
        </div>
    )
}

export default ShowAnnouncement