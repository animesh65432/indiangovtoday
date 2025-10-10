import React from 'react'
import { AnnouncementsTypes } from "@/types"
import { useRouter } from 'next/router'
import { Button } from '../ui/button'


type Props = {
    Announcement: AnnouncementsTypes
}

const Announcement: React.FC<Props> = ({ Announcement }) => {
    const router = useRouter()

    const redirect_to = (id: string) => {
        router.push(`/Announcement?id=${id}`)
    }

    return (
        <div className='p-2 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center rounded-md justify-between w-[97%] bg-[#FFFFFF] pb-3'>
            <div className='flex flex-col gap-2'>
                <div className='text-[#E0614B] font-medium text-[1.1rem]'>{Announcement.type}</div>
                <div className='text-[#2B2B2B] text-[0.9rem]'>{Announcement.title}</div>
            </div>
            <Button onClick={() => redirect_to(Announcement._id)} className='bg-[#FFFFFF] ml-auto border border-[#E0614B] text-[#E0614B] rounded-xl w-[120px] hover:bg-[#FFFFFF]  cursor-pointer'>See Details</Button>
        </div>
    )
}

export default Announcement