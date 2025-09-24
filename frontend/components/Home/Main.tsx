import React, { useEffect, useState } from 'react'
import { getAllAnnouncements } from "@/api/announcements"
import { AnnouncementsTypes } from "@/types"
import Announcement from './Announcement'
import AnnouncementSkeleton from './AnnouncementSkeleton'

const Main: React.FC = () => {

    const [Announcements, setAnnouncements] = useState<AnnouncementsTypes[]>([])
    const [IsLoading, SetIsLoading] = useState<boolean>(false)

    async function fetchAnnouncements() {
        SetIsLoading(true)
        try {
            const data = await getAllAnnouncements() as AnnouncementsTypes[];
            setAnnouncements(data)
        } catch (error) {
            console.error(error);
        }
        finally {
            SetIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    if (IsLoading) {
        return <div className='flex flex-col gap-4 w-[85%] mx-auto pt-7'>
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
        </div>
    }


    if (Announcements.length === 0) {
        return <div className="flex-1 w-[100%] h-[70vh] flex justify-center items-center text-center">
            <p className="text-[#353535] text-[1rem] lg:text-[1.3rem]">
                No announcements found
            </p>
        </div>

    }


    return (
        <div className='w-[85%] mx-auto pt-8 flex flex-col gap-4'>
            {
                Announcements.map
                    ((announcement, index) =>
                        <Announcement
                            Announcement={announcement}
                            key={index}
                        />)
            }
        </div>
    )
}

export default Main