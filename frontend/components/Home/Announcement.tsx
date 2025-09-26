import React from 'react'
import { AnnouncementsTypes } from "@/types"
import { useRouter } from 'next/router'

type Props = {
    Announcement: AnnouncementsTypes
}

const Announcement: React.FC<Props> = ({ Announcement }) => {
    const router = useRouter()

    const redirect_to = (news_id: string, title: string) => {
        router.push(`/Announcement?news_id=${news_id}&title=${title}`)
    }

    return (
        <li
            onClick={() => redirect_to(Announcement.link, Announcement.title)}
            className='text-[#353535] w-[85%] mx-auto hover:underline cursor-pointer focus:underline active:underline text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]'
        >
            {Announcement.title}
        </li>

    )
}

export default Announcement