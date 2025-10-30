"use client"
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react'
import Header from '@/components/Home/Header'
import { GetallGroupsIndiaAnnouncements } from "@/api/announcements"
import { Currentdate } from "@/context/Currentdate"
import { LanguageContext } from "@/context/Lan"
import { GetallGroupsIndiaAnnouncementsResponse, GetallGroupsIndiaAnnouncements as AnnouncementsTyps } from "@/types"
import Main from './Main'

type Props = {
    QueryInput: string
}

const Announcements = ({ QueryInput }: Props) => {
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementsTyps[]>([])
    const { startdate, endDate } = useContext(Currentdate)
    const { language } = useContext(LanguageContext)
    const [Startpage, SetStartpage] = useState<number>(0)
    const [limit] = useState<number>(10)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const isFetchingRef = useRef(false)

    async function fetchGetGroupIndiaAnnouncements(page: number = 0, append: boolean = false) {

        if (isFetchingRef.current) return

        isFetchingRef.current = true

        if (append) {
            SetIsLoadingMore(true)
        } else {
            SetIsLoading(true)
        }

        try {
            const IndiaAnnouncementsResponse = await GetallGroupsIndiaAnnouncements(
                language,
                startdate,
                endDate,
                page,
                limit,
                QueryInput
            ) as GetallGroupsIndiaAnnouncementsResponse

            const newAnnouncements = IndiaAnnouncementsResponse.data

            if (append) {
                SetAnnouncements(prev => [...prev, ...newAnnouncements])
            } else {
                SetAnnouncements(newAnnouncements)
            }

            if (newAnnouncements.length < limit) {
                setHasMore(false)
            }

        } catch (error) {
            console.error('Error fetching announcements:', error)
        } finally {
            SetIsLoading(false)
            SetIsLoadingMore(false)
            isFetchingRef.current = false
        }
    }

    // Handle scroll event to load more
    const handleScroll = useCallback(() => {
        // Don't fetch if already loading or no more data
        if (isFetchingRef.current || !hasMore || IsLoadingMore) return

        // Calculate if user is near bottom (within 300px)
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight

        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)

        if (distanceFromBottom < 300) {
            const nextPage = Startpage + 1
            SetStartpage(nextPage)
            fetchGetGroupIndiaAnnouncements(nextPage, true)
        }
    }, [Startpage, hasMore, IsLoadingMore, QueryInput])


    useEffect(() => {
        SetStartpage(0)
        setHasMore(true)
        SetAnnouncements([])
        fetchGetGroupIndiaAnnouncements(0, false)
    }, [language])


    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])



    return (
        <div className='flex flex-col gap-4'>
            <Header />
            <Main Announcements={Announcements} IsLoading={IsLoading} QueryInput={QueryInput} />
        </div>
    )
}

export default Announcements