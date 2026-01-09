import React, { useState, useContext } from 'react'
import { useEffect } from "react"
import { getAnnouncement } from "@/api/announcements"
import ShowAnnouncement from './ShowAnnouncement'
import { ShowAnnouncementsTypes } from "@/types"
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { TranslateText } from "@/lib/translatetext"
import { Inbox } from 'lucide-react'
import { LanguageContext } from "@/context/Lan"
import Explore from './Explore'
import Subscribe from '@/components/Subscribe'

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
        <main className=" flex flex-col  min-h-dvh bg-[#F8F8F8]">
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
                    /> :
                    <main className='h-[100vh] flex justify-center items-center'>
                        <div className='flex items-center gap-2'>
                            <Inbox className="w-10 h-10 mb-2 text-[#E0614B]" />
                            <p className="text-[1rem] sm:text-lg text-[#E0614B]">
                                {TranslateText[lan].NO_ANNOUNCEMENTS_FOUND}
                            </p>
                        </div>
                    </main>) :
                <div className='h-screen'>
                    <AnnouncementSkeleton />
                </div>
            }
            <Explore
                id={id}
            />
        </main>
    )
}

export default Announcement