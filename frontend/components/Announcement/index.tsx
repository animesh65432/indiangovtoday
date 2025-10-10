import React, { useState } from 'react'
import Header from '../Header'
import { useEffect } from "react"
import { getAnnouncement } from "@/api/announcements"
import { UseLanguageContext } from '@/context/Lan'
import ShowAnnouncement from './ShowAnnouncement'
import { ShowAnnouncementsTypes } from "@/types"
import AnnouncementSkeleton from './AnnouncementSkeleton'

type Props = {
    id: string
}

const Announcement = ({ id }: Props) => {
    const [announcement, setannouncement] = useState<ShowAnnouncementsTypes | null>(null)
    const LanContext = UseLanguageContext()
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    if (!LanContext) {
        return null
    }
    const { language } = LanContext

    async function fetch() {
        SetIsLoading(true)
        try {
            const data = await getAnnouncement(language, id) as ShowAnnouncementsTypes
            setannouncement(data)
        } catch (error) {
            console.log(error)
        }
        finally {
            SetIsLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetch()
        }
    }, [id,])

    if (IsLoading) {
        return <div>
            <Header />
            <AnnouncementSkeleton />
        </div>
    }

    if (!announcement) {
        return
    }

    return (
        <div className="bg-[#FFFFFF] flex flex-col h-[100vh] w-[100vw] overflow-hidden">
            <Header />
            <ShowAnnouncement source={announcement.source} title={announcement.title} content={announcement.content} />
        </div>
    )
}

export default Announcement