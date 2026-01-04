import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types";
import { LanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import HeroSection from './HeroSection';
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
import AnnoucementsHeader from './AnnoucementsHeader';
import AnimatedHeading from '../AnimatedHeading';


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
    const { isScrolled } = useDidUserScroll(900)
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
        Setpage(1)
        setHasMore(true)
        isFetchingRef.current = false
        SetAnnouncements([])
        fetchGetIndiaAnnouncements(1, false)
    }, [language, startdate, endDate, fetchGetIndiaAnnouncements])

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

    const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            router.push(`/announcements?SearchInput=${SearchInput}`);
        }
    };

    return (
        <section id='announcements' className='flex flex-col p-4'>
            <StickyHeader
                isVisible={isScrolled}
                SearchInput={SearchInput}
                SetSearchInput={SetSearchInput}
                route='/'
            />
            <div className='flex flex-col gap-14 md:gap-20'>
                <AnnoucementsHeader />
                <ShowAnnouncements
                    LoadMoreData={OnLoadMoredata}
                    Announcements={Announcements}
                    IsLoading={IsLoading}
                    page={page}
                    totalpage={totalPages}
                    IsLoadingMore={IsLoadingMore}
                />
            </div>
        </section>
    );
};

export default Main;