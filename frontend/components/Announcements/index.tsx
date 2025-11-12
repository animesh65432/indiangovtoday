"use client"
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react'
import Header from '@/components/Home/Header'
import { SerachallIndiaAnnouncements } from "@/api/announcements"
import { Currentdate } from "@/context/Currentdate"
import { LanguageContext } from "@/context/Lan"
import { AnnouncementsTypes } from "@/types"
import Main from './Main'

type Props = {
    QueryInput: string
}

const Announcements = ({ QueryInput }: Props) => {
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementsTypes[]>([])
    const { startdate, endDate } = useContext(Currentdate)
    const { language } = useContext(LanguageContext)
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)


    const fetchGetIndiaAnnouncements = async () => {
        SetIsLoading(true)
        try {
            const respose = await SerachallIndiaAnnouncements(language, startdate, endDate, page, limit, QueryInput)
            console.log(respose)
        } finally {
            SetIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGetIndiaAnnouncements()
    }, [language])

    return (
        <div className='flex flex-col gap-4'>
            <Header />
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