"use client"
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react'
import { SerachallIndiaAnnouncements } from "@/api/announcements"
import { Currentdate } from "@/context/Currentdate"
import { LanguageContext } from "@/context/Lan"
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types"
import Main from './Main'
import AnnoucementsHeader from '../AnnoucementsHeader'

type Props = {
    QueryInput: string,
    SetQueryInput: React.Dispatch<React.SetStateAction<string>>
    previousSearchInput: string,
    SetPreviousSearchInput: React.Dispatch<React.SetStateAction<string>>
}

const Announcements = ({ QueryInput, SetQueryInput, previousSearchInput, SetPreviousSearchInput }: Props) => {
    const [totalPages, settotalPages] = useState<number>(0)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const { startdate, endDate } = useContext(Currentdate)
    const { language } = useContext(LanguageContext)
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)
    const [IsButtomClicked, SetIsButtomClicked] = useState<boolean>(false)
    const requestIdRef = useRef(0)
    const currentRequestIdRef = useRef(0)
    const isFetchingRef = useRef(false)
    const paramsRef = useRef({ language, startdate, endDate, limit, page })


    useEffect(() => {
        paramsRef.current = { language, startdate, endDate, limit, page }
    }, [language, startdate, endDate, limit, page])

    const fetchGetIndiaAnnouncements = useCallback(async (page: number = 0, append: boolean = false) => {
        const requestId = ++requestIdRef.current;
        currentRequestIdRef.current = requestId;

        if (append) {
            SetIsLoadingMore(true)
        } else {
            SetIsLoading(true)
            isFetchingRef.current = true
        }

        try {

            if (!QueryInput || QueryInput.trim() === "") {
                SetAnnouncements([])
                settotalPages(0)
                return
            }

            if (QueryInput === previousSearchInput) {
                return
            }

            const { language, startdate, endDate, limit } = paramsRef.current

            const IndiaAnnouncementsResponse = await SerachallIndiaAnnouncements(
                language,
                startdate,
                endDate,
                page,
                limit,
                QueryInput
            ) as AnnouncementsResponse

            console.log(IndiaAnnouncementsResponse)

            if (requestId !== currentRequestIdRef.current) {
                console.log('Discarding outdated request', requestId, 'current is', currentRequestIdRef.current)
                return
            }

            const newAnnouncements = IndiaAnnouncementsResponse.data

            settotalPages(IndiaAnnouncementsResponse.pagination.totalPages)

            if (append) {
                SetAnnouncements(prev => [...prev, ...newAnnouncements])
            } else {
                SetAnnouncements(newAnnouncements)
            }

        } catch (error) {
            if (requestId === currentRequestIdRef.current) {
                console.error('Error fetching announcements:', error)
            }
        } finally {
            if (requestId === currentRequestIdRef.current) {
                SetIsLoading(false)
                SetIsLoadingMore(false)
                SetPreviousSearchInput(QueryInput)
                isFetchingRef.current = false
            }
        }
    }, [])


    useEffect(() => {
        requestIdRef.current++
        Setpage(1)
        isFetchingRef.current = false
        SetAnnouncements([])
        fetchGetIndiaAnnouncements(1, false)
    }, [language, startdate, endDate, fetchGetIndiaAnnouncements, IsButtomClicked])

    useEffect(() => {
        if (page > 1) {
            fetchGetIndiaAnnouncements(page, true)
        }
    }, [page, fetchGetIndiaAnnouncements])


    const OnLoadMoredata = () => {
        if (page >= totalPages) {
            return;
        }
        else {
            Setpage((prev) => prev + 1)
        }
    }

    const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            SetIsButtomClicked((prev) => !prev)
        }
    };

    return (
        <div className='flex flex-col gap-4 p-3 sm:p-0'>
            <AnnoucementsHeader
                handleEnterKeyPress={handleEnterKeyPress}
                SearchInput={QueryInput}
                SetSearchInput={SetQueryInput}
                dontRedirect={true}
                SetIsButtomClicked={SetIsButtomClicked}
            />
            <Main
                Announcements={Announcements}
                IsLoading={IsLoading}
                SearchInput={QueryInput}
                SetSearchInput={SetQueryInput}
                OnLoadMoredata={OnLoadMoredata}
                limit={totalPages}
                page={page}
                IsLoadingMore={IsLoadingMore}
            />
        </div>
    )
}

export default Announcements