import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types";
import { LanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import Image from 'next/image';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TranslateText } from "@/lib/translatetext"
import { DateRangePicker } from "@/components/ui/DateRangePicker"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { optionsforLanguages } from '@/lib/lan';
import { useRouter } from "next/router"
import useDidUserScroll from "@/hooks/useDidUserScroll"
import ShowAnnouncements from '../ShowAnnouncements';
import StickyHeader from '../StickyHeader';


const Main: React.FC = () => {
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [totalPages, settotalPages] = useState<number>(0)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const { startdate, endDate, onChangeDate } = useContext(Currentdate)
    const { language, onSelectLanguage } = useContext(LanguageContext)
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)
    const [hasMore, setHasMore] = useState<boolean>(true)
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

            const IndiaAnnouncementsResponse = await getAllAnnouncements(
                language,
                startdate,
                endDate,
                page,
                limit,
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
        Setpage(0)
        setHasMore(true)
        isFetchingRef.current = false
        SetAnnouncements([])
        fetchGetIndiaAnnouncements(0, false)
    }, [language, startdate, endDate])

    useEffect(() => {
        if (page > 1) {
            fetchGetIndiaAnnouncements(page, true)
        }
    }, [page])


    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
            SetSearchInput("");
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
    return (
        <div className='pt-35 sm:pt-15 md:pt-18  [@media(min-width:900px)]:pt-16  lg:pt-14 xl:pt-7 [@media(min-width:1600px)]:pt-14 [@media(min-width:1700px)]:pt-16 [@media(min-width:1900px)]:pt-22 [@media(min-width:2000px)]:pt-22 [@media(min-width:2100px)]:pt-26 [@media(min-width:2300px)]:pt-32 [@media(min-width:2600px)]:pt-38 [@media(min-width:2800px)]:pt-44 [@media(min-width:3000px)]:pt-48 flex flex-col gap-7'>
            <StickyHeader
                isVisible={isScrolled}
                SearchInput={SearchInput}
                SetSearchInput={SetSearchInput}
                route='/'
            />
            <div className={`block sm:hidden relative h-[47px] w-[150px] mx-auto transition-all duration-500 ease-in-out 
  ${isScrolled ? "opacity-0 -translate-y-10 pointer-events-none" : "opacity-100 translate-y-0"}`}>
                <Image src="/Logo.png" alt='logo' fill />
            </div>
            <div className={`flex items-start sm:items-center justify-center gap-1 sm:gap-3 transition-all duration-500 ease-in-out 
  ${isScrolled ? "opacity-0 -translate-y-10 pointer-events-none" : "opacity-100 translate-y-0"}`}>
                <div className="  relative w-[30px] h-[16px] sm:h-[20px] lg:h-[25px] pt-8 sm:pt-0">
                    <Image alt="logo" fill src="/indiaIcon.svg" />
                </div>
                <h1 className="text-center text-[#E0614B] text-[1.2rem] sm:text-[1.3rem] lg:text-[1.6rem] whitespace-normal break-normal max-w-[70vw] sm:max-w-none">
                    {TranslateText[language].ALL_GOVERNMENT_ANNOUNCEMENTS_IN_ONE_PLACE}
                </h1>
            </div>

            <div className={`bg-[#F9F9F9] border flex flex-col justify-center sm:justify-start sm:flex-row gap-5 sm:gap-2 items-center border-[#EDEDED] w-[85vw]  sm:w-[70vw] md:w-[50vw] lg:w-[528px] mx-auto  sm:h-[10vh] p-4 sm:p-0 rounded-md transition-all duration-500 ease-in-out 
  ${isScrolled ? "opacity-0 -translate-y-10 pointer-events-none" : "opacity-100 translate-y-0"}`}>
                <Input
                    value={SearchInput}
                    onChange={(e) => SetSearchInput(e.target.value)}
                    className="w-[90%] sm:w-[70%] lg:w-[346px] bg-[#FFFFFF] rounded-xl ml-4 text-[#2B2B2B]"
                    placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                />
                <div className='flex flex-col [@media(min-width:450px)]:flex-row gap-4 sm:hidden items-center'>
                    <DateRangePicker
                        onUpdate={OnChangeDateRangePicker}
                        initialDateFrom={startdate}
                        initialDateTo={endDate}
                        align="start"
                        locale="en-GB"
                        showCompare={false}
                    />

                    <Select
                        onValueChange={(value) => {
                            onSelectLanguage(value);
                        }}
                        value={language}
                    >
                        <SelectTrigger className="mx-auto [@media(min-width:450px)]:mx-0  border border-[#E0614B] self-end  bg-[#FFFFFF] rounded-lg   font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
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


                <Button
                    onClick={() => router.push(`/announcements?SearchInput=${SearchInput}`)}
                    className='bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'
                >
                    {TranslateText[language].SEARCH}
                </Button>
            </div>


            <ShowAnnouncements
                LoadMoreData={OnLoadMoredata}
                Announcements={Announcements}
                IsLoading={IsLoading}
                page={page}
                totalpage={totalPages}
                IsLoadingMore={IsLoadingMore}
            />
        </div>
    );
};

export default Main;