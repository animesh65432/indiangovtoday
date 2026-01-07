import React, { useState, useEffect } from 'react'
import { getAllAnnouncements } from "@/api/announcements"
import { useContext } from 'react'
import { LanguageContext } from "@/context/Lan"
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types"
import ShowAnnouncements from '../ShowAnnouncements'
import { Button } from '../ui/button'
import { useRouter } from "next/navigation"


const Explore: React.FC = () => {
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const { language } = useContext(LanguageContext)
    const router = useRouter()
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])

    async function fetchExploreAnnouncements() {
        SetIsLoading(true)
        try {
            const end = new Date()
            const start = new Date()
            start.setDate(end.getDate() - 7)
            const response = await getAllAnnouncements(language, start, end, 1, 5) as AnnouncementsResponse
            SetAnnouncements(response.data)
        } finally {
            SetIsLoading(false)
        }
    }

    useEffect(() => {
        fetchExploreAnnouncements()
    }, [])

    return (
        <div className='bg-[#E6E6E6] p-10 flex flex-col gap-6'>
            <ShowAnnouncements
                Announcements={Announcements}
                IsLoading={IsLoading}
                page={1}
                totalpage={1}
                IsLoadingMore={false}
                LoadMoreData={() => { }}
                ShowBackButtom={false}
            />
            <Button
                onClick={() => router.push("/#announcements")}
                className='bg-white border border-black rounded-none w-fit mx-auto'
            >
                View More Announcements
            </Button>
        </div>
    )
}

export default Explore