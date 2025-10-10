import React, { useState } from 'react'
import Header from '../Header'
import { useEffect } from "react"
import { getAnnouncement } from "@/api/announcements"
import { UseLanguageContext } from '@/context/Lan'
import ShowAnnouncement from './ShowAnnouncement'
import { ShowAnnouncementsTypes } from "@/types"
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { Inbox } from 'lucide-react'

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
                    /> :
                    <div className='h-[70vh] flex justify-center items-center'>
                        <div className='flex items-center gap-2'>
                            <Inbox className="w-10 h-10 mb-2 text-[#E0614B]" />
                            <p className="text-[1rem] sm:text-lg text-[#2B2B2B]">
                                No announcement found
                            </p>
                        </div>
                    </div>) :
                <AnnouncementSkeleton />
            }
        </div>
    )
}

export default Announcement