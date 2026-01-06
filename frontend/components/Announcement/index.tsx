import React, { useState, useContext } from 'react'
import Header from './Header'
import { useEffect } from "react"
import { getAnnouncement } from "@/api/announcements"
import ShowAnnouncement from './ShowAnnouncement'
import { ShowAnnouncementsTypes } from "@/types"
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { TranslateText } from "@/lib/translatetext"
import { Inbox } from 'lucide-react'
import { LanguageContext } from "@/context/Lan"

type Props = {
    id: string
    lan: string
}

const Announcement = ({ id, lan }: Props) => {
    const [announcement, setannouncement] = useState<ShowAnnouncementsTypes | null>(null)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
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
        <div className=" flex flex-col  min-h-dvh   w-[99vw] ">
            <Header />
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
                    /> :
                    <div className='h-[70vh] flex justify-center items-center'>
                        <div className='flex items-center gap-2'>
                            <Inbox className="w-10 h-10 mb-2 text-[#E0614B]" />
                            <p className="text-[1rem] sm:text-lg text-[#2B2B2B]">
                                {TranslateText[lan].NO_ANNOUNCEMENTS_FOUND}
                            </p>
                        </div>
                    </div>) :
                <AnnouncementSkeleton />
            }
        </div>
    )
}

export default Announcement