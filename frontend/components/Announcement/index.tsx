import React, { useState } from 'react'
import Header from '../Header'
import { useEffect } from "react"
import { getAnnouncement } from "@/api/announcements"
import { UseLanguageContext } from '@/context/Lan'
import ShowAnnouncement from './ShowAnnouncement'
import { ShowAnnouncementsTypes } from "@/types"
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { toast } from "react-toastify"

type Props = {
    news_id: string
}

const Announcement = ({ news_id }: Props) => {
    const [announcement, setannouncement] = useState<ShowAnnouncementsTypes[] | null>(null)
    const LanContext = UseLanguageContext()
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    if (!LanContext) {
        return null
    }
    const { language } = LanContext

    async function fetch() {
        SetIsLoading(true)
        try {
            const data = await getAnnouncement(language, news_id) as ShowAnnouncementsTypes[]
            setannouncement(data)
        } catch (error) {
            console.log(error)
        }
        finally {
            SetIsLoading(false)
        }
    }

    useEffect(() => {
        fetch()
    }, [language])

    if (IsLoading) {
        return <div>
            <Header />
            <AnnouncementSkeleton />
        </div>
    }

    if (!announcement) {
        toast.error("announcement didn't found")
        return
    }

    return (
        <div>
            <Header />
            <ShowAnnouncement source={news_id} title={announcement[0].title} content={announcement[0].content} />
        </div>
    )
}

export default Announcement