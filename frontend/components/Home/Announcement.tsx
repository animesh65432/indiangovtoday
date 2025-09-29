import React from 'react'
import { AnnouncementsTypes } from "@/types"
import { useRouter } from 'next/router'

type Props = {
    Announcement: AnnouncementsTypes
}

const Announcement: React.FC<Props> = ({ Announcement }) => {
    const router = useRouter()

    const redirect_to = (id: string) => {
        router.push(`/Announcement?id=${id}`)
    }

    return (
        <div
            onClick={() => redirect_to(Announcement._id)}
            className='text-[#353535] border border-[#5e5e5e] p-3 rounded-lg w-[85%] mx-auto hover:cursor-pointer text-[0.85rem] md:text-[1rem] lg:text-[1.1rem] shadow-sm hover:shadow-md transition-shadow duration-300'
        >
            {Announcement.title}
        </div>


    )
}

export default Announcement