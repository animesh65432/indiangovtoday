"use client"
import { useSearchParams } from 'next/navigation'
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
import Announcement from '@/components/Announcement'
import React, { useContext } from 'react'
import { ThemeContext } from '@/context/Theme'

const AnnouncementPage = () => {
    const searchParams = useSearchParams()
    const { language } = useContext(LanguageContext)
    const { theme } = useContext(ThemeContext)
    const isDark = theme === "dark"

    const id = searchParams.get("id")
    const lan = searchParams.get("lan")

    if (!id || !lan) {
        return (
            <div className={`h-screen w-screen flex items-center justify-center ${isDark ? "bg-[#050505]" : "bg-white"}`}>
                <div className='text-[#c51057]'>{TranslateText[language].SOMETHING_WENT_WRONG}</div>
            </div>
        )
    }

    return <Announcement id={id} lan={lan} />
}

export default AnnouncementPage