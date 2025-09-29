import React, { useEffect, useState } from 'react'
import { getAllAnnouncements } from "@/api/announcements"
import { AnnouncementsTypes } from "@/types"
import Announcement from './Announcement'
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { UseLanguageContext } from '@/context/Lan'
import { Currentdate } from "@/context/Currentdate"
import { useContext } from "react"

const Main: React.FC = () => {
    const [Announcements, setAnnouncements] = useState<AnnouncementsTypes[]>([])
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const LanguageContext = UseLanguageContext()
    const { date } = useContext(Currentdate)

    if (!LanguageContext) {
        return null;
    }

    const { language } = LanguageContext


    async function fetchAnnouncements() {
        SetIsLoading(true)
        try {
            const data = await getAllAnnouncements(language, date) as AnnouncementsTypes[];
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
    }, [language, date]);

    if (IsLoading) {
        return <div className='flex flex-col gap-4 w-[85%] mx-auto pt-7'>
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
        </div>
    }


    if (Announcements.length === 0) {
        return <div className="flex-1 w-[100%] h-[60vh]  flex justify-center items-center text-center">
            <p className="text-[#353535] text-[1rem] lg:text-[1.3rem]">
                No announcements found
            </p>
        </div>

    }


    return (
        <ul className='w-[100%] list-disc pl-5 flex-1 overflow-x-auto  mx-auto pt-8 pb-6 flex flex-col gap-4'>
            {
                Announcements.map
                    ((announcement, index) =>
                        <Announcement
                            Announcement={announcement}
                            key={index}
                        />)
            }
        </ul>
    )
}

export default Main