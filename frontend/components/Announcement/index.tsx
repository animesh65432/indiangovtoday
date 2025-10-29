import React, { useState } from 'react'
import Header from './Header'
import { useEffect } from "react"
import { getAnnouncement } from "@/api/announcements"
import ShowAnnouncement from './ShowAnnouncement'
import { ShowAnnouncementsTypes } from "@/types"
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { TranslateText } from "@/lib/translatetext"
import { Inbox } from 'lucide-react'

type Props = {
    id: string
    lan: string
}

const Announcement = ({ id, lan }: Props) => {
    const [announcement, setannouncement] = useState<ShowAnnouncementsTypes | null>(null)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)

    async function fetch() {
        SetIsLoading(true)
        try {
            const response = await getAnnouncement(lan, id) as { data: ShowAnnouncementsTypes }
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
    }, [id])

    return (
        <div className="bg-[#FFFFFF] flex flex-col h-[100vh] w-[100vw] overflow-hidden">
            <Header />
            {!IsLoading ?
                (announcement ?
                    <ShowAnnouncement
                        title={announcement.title}
                        content={announcement.content}
                        source={announcement.source}
                        lan={lan}
                    /> :
                    <div className='h-[70vh] flex justify-center items-center'>
                        <div className='flex items-center gap-2'>
                            <Inbox className="w-10 h-10 mb-2 text-[#E0614B]" />
                            <p className="text-[1rem] sm:text-lg text-[#2B2B2B]">
                                {TranslateText[lan].No_announcements_found}
                            </p>
                        </div>
                    </div>) :
                <AnnouncementSkeleton />
            }
        </div>
    )
}

export default Announcement