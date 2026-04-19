import React, { useState, useContext, useEffect } from 'react'
import { getAnnouncement } from "@/api/announcements"
import ShowAnnouncement from './ShowAnnouncement'
import { ShowAnnouncementsTypes } from "@/types"
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { LanguageContext } from "@/context/Lan"
import { ThemeContext } from "@/context/Theme"
import Subscribe from '@/components/Subscribe'
import EmptyAnnouncements from '../Home/EmptyAnnoucments'

type Props = {
    id: string
    lan: string
}

const Announcement = ({ id, lan }: Props) => {
    const [announcement, setAnnouncement] = useState<ShowAnnouncementsTypes | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [toggle, setToggle] = useState<boolean>(false)
    const { language } = useContext(LanguageContext)
    const { theme } = useContext(ThemeContext)
    const isDark = theme === "dark"

    useEffect(() => {
        if (!id) return

        const fetchAnnouncement = async () => {
            setIsLoading(true)
            try {
                const response = await getAnnouncement(lan, id) as { data: ShowAnnouncementsTypes }
                setAnnouncement(response.data)
            } catch (err) {
                console.error("Failed to fetch announcement:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnnouncement()
    }, [id, language])

    if (isLoading) {
        return (
            <div className={`h-screen ${isDark ? "bg-[#050505]" : "bg-white"}`}>
                <AnnouncementSkeleton />
            </div>
        )
    }

    return (
        <main className={`flex flex-col min-h-dvh ${isDark ? "bg-[#050505]" : "bg-white"}`}>
            <Subscribe />
            {announcement
                ? <ShowAnnouncement
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
                />
                : <EmptyAnnouncements />
            }
        </main>
    )
}

export default Announcement