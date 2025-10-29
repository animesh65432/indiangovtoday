"use client"
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react'
import Header from '@/components/Home/Header'
import { GetallGroupsIndiaAnnouncements } from "@/api/announcements"
import { Currentdate } from "@/context/Currentdate"
import { LanguageContext } from "@/context/Lan"
import { GetallGroupsIndiaAnnouncementsResponse, GetallGroupsIndiaAnnouncements as AnnouncementsTyps } from "@/types"
import Main from './Main'
import { LoaderCircle } from "lucide-react"

const Announcements = () => {
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
                limit
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

        // Trigger fetch when within 300px of bottom
        if (distanceFromBottom < 300) {
            const nextPage = Startpage + 1
            SetStartpage(nextPage)
            fetchGetGroupIndiaAnnouncements(nextPage, true)
        }
    }, [Startpage, hasMore, IsLoadingMore])


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
        <div>
            <Header />

            {/* Initial loading state */}
            {IsLoading && Announcements.length === 0 && (
                <div className='h-[60vh] flex items-center justify-center'>
                    <LoaderCircle className='h-8 w-8 animate-spin text-[#E0614B]' />
                </div>
            )}

            {/* Main content */}
            {Announcements.length > 0 && (
                <Main Announcements={Announcements} />
            )}

            {/* Loading more indicator */}
            {IsLoadingMore && (
                <div className='py-8 flex items-center justify-center'>
                    <LoaderCircle className='h-5 w-5 animate-spin mr-2' />
                    <span className='text-sm text-gray-600'>Loading more...</span>
                </div>
            )}


            {!hasMore && Announcements.length > 0 && (
                <div className='py-8 text-center text-sm text-gray-500'>
                    No more announcements to load
                </div>
            )}


            {!IsLoading && Announcements.length === 0 && (
                <div className='py-16 text-center text-gray-500'>
                    No announcements found
                </div>
            )}
        </div>
    )
}

export default Announcements