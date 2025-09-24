import React, { useState } from 'react'
import Header from '../Header'
import { useEffect } from "react"
import { getAnnouncement } from "@/api/announcements"
import { UseLanguageContext } from '@/context/Lan'
import ShowAnnouncement from './ShowAnnouncement'
import { ShowAnnouncementsTypes } from "@/types"

type Props = {
    news_id: string
}

const Announcement = ({ news_id }: Props) => {
    const [announcement, setannouncement] = useState<ShowAnnouncementsTypes[]>([{ title: "", content: "" }])
    const LanContext = UseLanguageContext()
    if (!LanContext) {
        return null
    }
    const { language } = LanContext

    async function fetch() {
        try {
            const data = await getAnnouncement(language, news_id) as ShowAnnouncementsTypes[]
            setannouncement(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetch()
    }, [language])

    console.log(announcement)

    return (
        <div>
            <Header />
            <ShowAnnouncement source={news_id} title={announcement[0].title} content={announcement[0].content} />
        </div>
    )
}

export default Announcement