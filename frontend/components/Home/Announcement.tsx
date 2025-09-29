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
        <li
            onClick={() => redirect_to(Announcement._id)}
            className='text-[#353535] w-[85%] mx-auto hover:underline cursor-pointer focus:underline active:underline text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]'
        >
            {Announcement.title}
        </li>

    )
}

export default Announcement