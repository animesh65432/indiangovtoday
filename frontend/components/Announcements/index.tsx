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

    const fetchGetIndiaAnnouncements = useCallback(async (page: number = 0, append: boolean = false, query: string) => {
        if (append) {
            SetIsLoadingMore(true)
        } else {
            SetIsLoading(true)
        }

        try {
            if (!query || query.trim() === "") {
                SetAnnouncements([])
                settotalPages(0)
                SetPreviousSearchInput("")
                return
            }

            const IndiaAnnouncementsResponse = await SerachallIndiaAnnouncements(
                language,
                startdate,
                endDate,
                page,
                limit,
                query
            ) as AnnouncementsResponse

            const newAnnouncements = IndiaAnnouncementsResponse.data
            settotalPages(IndiaAnnouncementsResponse.pagination.totalPages)

            if (append) {
                SetAnnouncements(prev => [...prev, ...newAnnouncements])
            } else {
                SetAnnouncements(newAnnouncements)
            }

            SetPreviousSearchInput(query)
        } catch (error) {
            console.error("Error fetching announcements:", error)
        } finally {
            SetIsLoading(false)
            SetIsLoadingMore(false)
        }
    }, [language, startdate, endDate, limit])


    useEffect(() => {
        if (QueryInput !== previousSearchInput || IsButtomClicked) {
            Setpage(1)
            SetAnnouncements([])
            fetchGetIndiaAnnouncements(1, false, QueryInput)
        }
    }, [language, startdate, endDate, IsButtomClicked])

    useEffect(() => {
        if (page > 1 && QueryInput) {
            fetchGetIndiaAnnouncements(page, true, QueryInput)
        }
    }, [page])

    const OnLoadMoredata = () => {
        if (page < totalPages) {
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