"use client"
import React, { useEffect, useState, useContext } from 'react'
import Header from '@/components/Home/Header'
import { SerachallIndiaAnnouncements } from "@/api/announcements"
import { Currentdate } from "@/context/Currentdate"
import { LanguageContext } from "@/context/Lan"
import { Announcement as AnnouncementsTypes, AnnouncementsResponse } from "@/types"
import StickyHeader from '../StickyHeader'
import Main from './Main'
import useDidUserScroll from "@/hooks/useDidUserScroll"

type Props = {
    QueryInput: string
}

const Announcements = ({ QueryInput }: Props) => {
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [SearchInput, SetSearchInput] = useState<string>("")
    const { isScrolled } = useDidUserScroll()
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementsTypes[]>([])
    const { startdate, endDate } = useContext(Currentdate)
    const { language } = useContext(LanguageContext)
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)


    const fetchGetIndiaAnnouncements = async () => {
        SetIsLoading(true)
        try {
            const respose = await SerachallIndiaAnnouncements(language, startdate, endDate, page, limit, QueryInput) as AnnouncementsResponse
            SetAnnouncements(respose.data)
        } finally {
            SetIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGetIndiaAnnouncements()
    }, [language, startdate, endDate, language])

    return (
        <div className='flex flex-col gap-4'>
            <StickyHeader
                route="/announcements"
                isVisible={isScrolled}
                SearchInput={SearchInput}
                SetSearchInput={SetSearchInput}
            />
            <div className=' hidden sm:block'>
                <Header />
            </div>
            <Main
                Announcements={Announcements}
                IsLoading={IsLoading}
                SearchInput={SearchInput}
                SetSearchInput={SetSearchInput}
            />
        </div>
    )
}

export default Announcements