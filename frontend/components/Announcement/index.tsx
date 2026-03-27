import React, { useState, useContext } from 'react'
import { useEffect } from "react"
import { getAnnouncement } from "@/api/announcements"
import ShowAnnouncement from './ShowAnnouncement'
import { ShowAnnouncementsTypes } from "@/types"
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { LanguageContext } from "@/context/Lan"
import Subscribe from '@/components/Subscribe'
import EmptyAnnouncements from '../Home/EmptyAnnoucments'

type Props = {
    id: string
    lan: string
}

const Announcement = ({ id, lan }: Props) => {
    const [announcement, setannouncement] = useState<ShowAnnouncementsTypes | null>(null)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [toggle, setToggle] = useState<boolean>(false)
    const { language } = useContext(LanguageContext)

    async function fetch() {
        SetIsLoading(true)
        try {
            const response = await getAnnouncement(language, id) as { data: ShowAnnouncementsTypes }
            setannouncement(response.data)
        }
        finally {
            SetIsLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetch()
        }
    }, [id, language])

    return (
        <main className=" flex flex-col  min-h-dvh ">
            <Subscribe />
            {!IsLoading ?
                (announcement ?
                    <ShowAnnouncement
                        title={announcement.title}
                        source={announcement.source_link}
                        lan={language}
                        announcementId={announcement.announcementId}
                        state={announcement.state}
                        date={announcement.date}
                        category={announcement.category}
                        department={announcement.department}
                        sections={announcement.sections}
                        toggle={toggle}
                        setToggle={setToggle}
                        image={announcement.image}
                    /> :
                    <EmptyAnnouncements />) :
                <div className='h-screen'>
                    <AnnouncementSkeleton />
                </div>
            }
        </main>
    )
}

export default Announcement