import React from 'react'
import { AnnouncementsTypes } from "@/types"

type Props = {
    Announcement: AnnouncementsTypes
}

const Announcement: React.FC<Props> = ({ Announcement }) => {
    return (
        <div className='text-[#353535] hover:underline text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]'>
            {Announcement.title}
        </div>
    )
}

export default Announcement