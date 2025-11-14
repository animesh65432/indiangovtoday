"use client"
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react'
import Header from '@/components/Home/Header'
import { SerachallIndiaAnnouncements } from "@/api/announcements"
import { Currentdate } from "@/context/Currentdate"
import { LanguageContext } from "@/context/Lan"
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types"
import StickyHeader from '../StickyHeader'
import Main from './Main'
import useDidUserScroll from "@/hooks/useDidUserScroll"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { TranslateText } from "@/lib/translatetext"
import Image from 'next/image'
import { DateRangePicker } from '../ui/DateRangePicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { optionsforLanguages } from '@/lib/lan'
import { useRouter } from "next/router"

type Props = {
    QueryInput: string,
    SetQueryInput: React.Dispatch<React.SetStateAction<string>>
}

const Announcements = ({ QueryInput, SetQueryInput }: Props) => {
    const [totalPages, settotalPages] = useState<number>(0)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const { startdate, endDate, onChangeDate } = useContext(Currentdate)
    const { language, onSelectLanguage } = useContext(LanguageContext)
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [IsButtomClicked, SetIsButtomClicked] = useState<boolean>(false)
    const requestIdRef = useRef(0)
    const currentRequestIdRef = useRef(0)
    const isFetchingRef = useRef(false)
    const paramsRef = useRef({ language, startdate, endDate, limit, page })
    const { isScrolled } = useDidUserScroll()
    const router = useRouter()

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
            const { language, startdate, endDate, limit } = paramsRef.current

            const IndiaAnnouncementsResponse = await SerachallIndiaAnnouncements(
                language,
                startdate,
                endDate,
                page,
                limit,
                QueryInput
            ) as AnnouncementsResponse

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
                isFetchingRef.current = false
            }
        }
    }, [])


    useEffect(() => {
        requestIdRef.current++
        Setpage(1)
        setHasMore(true)
        isFetchingRef.current = false
        SetAnnouncements([])
        fetchGetIndiaAnnouncements(1, false)
    }, [language, startdate, endDate, fetchGetIndiaAnnouncements, IsButtomClicked])

    useEffect(() => {
        if (page > 1) {
            fetchGetIndiaAnnouncements(page, true)
        }
    }, [page, fetchGetIndiaAnnouncements])



    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
            SetQueryInput("");
        }
    };

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
            <StickyHeader
                route="/announcements"
                isVisible={isScrolled}
                SearchInput={QueryInput}
                SetSearchInput={SetQueryInput}
                SetIsButtomClicked={SetIsButtomClicked}
            />

            <Header />
            <div className='flex flex-col bg-white w-[80%] rounded-md mx-auto sm:mx-0 sm:w-[100%] sm:bg-transparent'>
                <div className='block sm:hidden w-[85%] mx-auto p-4'>
                    <div className={`relative h-[47px] w-[150px] mx-auto`} onClick={() => router.push("/")}>
                        <Image src="/Logo.png" alt='logo' fill />
                    </div>
                </div>
                <div className='flex gap-2 flex-col sm:flex-row items-center sm:items-start pb-3 sm:p-0'>
                    <Input
                        className=' w-[80%] sm:w-[50%]  bg-white sm:ml-[20%] text-black'
                        placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                        onKeyDown={handleEnterKeyPress}
                        value={QueryInput}
                        onChange={(e) => SetQueryInput(e.target.value)}
                    />
                    <div className=' block mx-auto sm:hidden'>
                        <DateRangePicker
                            onUpdate={OnChangeDateRangePicker}
                            initialDateFrom={startdate}
                            initialDateTo={endDate}
                            align="start"
                            locale="en-GB"
                            showCompare={false}
                        />
                    </div>
                    <div className=' block sm:hidden'>
                        <Select
                            onValueChange={(value) => {
                                onSelectLanguage(value);
                            }}
                            value={language}
                        >
                            <SelectTrigger className="[@media(min-width:450px)]:mx-0  border border-[#E0614B] self-end  bg-[#FFFFFF] rounded-lg   font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
                                <SelectValue className="" />
                            </SelectTrigger>
                            <SelectContent className="text-[#E0614B]">
                                {optionsforLanguages.map((lan) => (
                                    <SelectItem
                                        key={lan.label}
                                        value={lan.label}
                                        className="font-medium hover:text-[#E0614B] "
                                    >
                                        {lan.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => SetIsButtomClicked((prev) => !prev)} className='bg-[#E0614B] w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'>{TranslateText[language].SEARCH}</Button>
                </div>
            </div>
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