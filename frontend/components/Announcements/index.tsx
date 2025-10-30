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
    const requestIdRef = useRef(0)
    const currentRequestIdRef = useRef(0)
    const isFetchingRef = useRef(false)
    const paramsRef = useRef({ language, startdate, endDate, QueryInput, limit })

    useEffect(() => {
        paramsRef.current = { language, startdate, endDate, QueryInput, limit }
    }, [language, startdate, endDate, QueryInput, limit])

    const mergeGroupedAnnouncements = (existing: AnnouncementsTyps[], newData: AnnouncementsTyps[]) => {
        const merged = [...existing]

        newData.forEach(newGroup => {
            const existingGroupIndex = merged.findIndex(g => g.type === newGroup.type)

            if (existingGroupIndex !== -1) {
                // Merge announcements into existing group
                merged[existingGroupIndex] = {
                    ...merged[existingGroupIndex],
                    announcements: [
                        ...merged[existingGroupIndex].announcements,
                        ...newGroup.announcements
                    ]
                }
            } else {
                // Add new group
                merged.push(newGroup)
            }
        })

        return merged
    }

    const fetchGetGroupIndiaAnnouncements = useCallback(async (page: number = 0, append: boolean = false) => {
        // Generate a unique request ID for this fetch
        const requestId = ++requestIdRef.current
        currentRequestIdRef.current = requestId

        if (append) {
            SetIsLoadingMore(true)
        } else {
            SetIsLoading(true)
            isFetchingRef.current = true
        }

        try {
            const { language, startdate, endDate, limit, QueryInput } = paramsRef.current

            const IndiaAnnouncementsResponse = await GetallGroupsIndiaAnnouncements(
                language,
                startdate,
                endDate,
                page,
                limit,
                QueryInput
            ) as GetallGroupsIndiaAnnouncementsResponse

            // Check if this request is still valid (not superseded by a newer request)
            if (requestId !== currentRequestIdRef.current) {
                console.log('Discarding outdated request', requestId, 'current is', currentRequestIdRef.current)
                return
            }

            const newAnnouncements = IndiaAnnouncementsResponse.data

            if (append) {
                SetAnnouncements(prev => mergeGroupedAnnouncements(prev, newAnnouncements))
            } else {
                SetAnnouncements(newAnnouncements)
            }

            // Check if we got less data than requested
            const totalNewItems = newAnnouncements.reduce((sum, group) => sum + group.announcements.length, 0)
            setHasMore(totalNewItems >= limit)

        } catch (error) {
            // Only log error if this request is still current
            if (requestId === currentRequestIdRef.current) {
                console.error('Error fetching announcements:', error)
            }
        } finally {
            // Only update loading states if this request is still current
            if (requestId === currentRequestIdRef.current) {
                SetIsLoading(false)
                SetIsLoadingMore(false)
                isFetchingRef.current = false
            }
        }
    }, [])

    // Reset and fetch when key parameters change
    useEffect(() => {
        // Increment request ID to invalidate any in-flight requests
        requestIdRef.current++
        SetStartpage(0)
        setHasMore(true)
        isFetchingRef.current = false
        SetAnnouncements([])
        fetchGetGroupIndiaAnnouncements(0, false)
    }, [language, startdate, endDate, QueryInput])

    // Handle scroll event to load more
    const handleScroll = useCallback(() => {
        if (isFetchingRef.current || !hasMore || IsLoadingMore) return

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight

        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)

        if (distanceFromBottom < 300) {
            SetStartpage(prev => {
                const nextPage = prev + 1
                fetchGetGroupIndiaAnnouncements(nextPage, true)
                return nextPage
            })
        }
    }, [hasMore, IsLoadingMore, fetchGetGroupIndiaAnnouncements])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })
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