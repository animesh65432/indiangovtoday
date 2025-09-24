import React from 'react'
import { AnnouncementsTypes } from "@/types"
import { useRouter } from 'next/router'

type Props = {
    Announcement: AnnouncementsTypes
}

const Announcement: React.FC<Props> = ({ Announcement }) => {
    const router = useRouter()

    const redirect_to = (news_id: string) => {
        router.push(`/Announcement?news_id=${news_id}`)
    }
    return (
        <li onClick={() => redirect_to(Announcement.link)} className='text-[#353535] hover:underline text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]'>
            {Announcement.title}
        </li>
    )
}

export default Announcement