"use client"
import React, { useEffect, useState, useContext } from 'react'
import Header from './Header'
import { GetallGroupsIndiaAnnouncements } from "@/api/announcements"
import { Currentdate } from "@/context/Currentdate"
import { LanguageContext } from "@/context/Lan"
import { GetallGroupsIndiaAnnouncementsResponse, GetallGroupsIndiaAnnouncements as AnnouncementsTyps } from "@/types"
import Main from './Main'

const Announcements = () => {
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementsTyps[]>([])

    const { startdate, endDate } = useContext(Currentdate)
    const { language } = useContext(LanguageContext)

    async function fetchGetGroupIndiaAnnouncements() {
        SetIsLoading(true)
        try {
            const IndiaAnnouncementsResponse = await GetallGroupsIndiaAnnouncements(language, startdate, endDate) as GetallGroupsIndiaAnnouncementsResponse
            SetAnnouncements(IndiaAnnouncementsResponse.data)
        } finally {
            SetIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGetGroupIndiaAnnouncements()
    }, [language])


    return (
        <div>
            <Header />
            <Main Announcements={Announcements} />
        </div>
    )
}

export default Announcements