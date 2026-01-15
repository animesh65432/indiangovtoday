import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types";
import { LanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import { useRouter } from "next/router"
import ShowAnnouncements from '../ShowAnnouncements';
import AnnoucementsHeader from '@/components/AnnoucementsHeader';
import { toast } from 'react-toastify';
import { useStateCode } from "@/lib/useStateCode"
import { LocationContext } from "@/context/LocationProvider"
import SerchInputbox from './SearchInputbox';

const Main: React.FC = () => {
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [totalPages, settotalPages] = useState<number>(0)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const { startdate, endDate } = useContext(Currentdate)
    const { language } = useContext(LanguageContext)
    const { state_ut } = useContext(LocationContext)
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)
    const paramsRef = useRef({ language, startdate, endDate, limit, page })
    const router = useRouter()

    useEffect(() => {
        paramsRef.current = { language, startdate, endDate, limit, page }
    }, [language, startdate, endDate, limit, page])

    const fetchGetIndiaAnnouncements = useCallback(async (
        pageNumber: number,
        append: boolean,
        signal: AbortSignal
    ) => {

        if (append) SetIsLoadingMore(true);
        else SetIsLoading(true);

        try {

            const response = await getAllAnnouncements(
                language, startdate, endDate, pageNumber, limit, [useStateCode(state_ut, language), useStateCode("IndianGovt", language)], signal
            ) as AnnouncementsResponse;


            if (!signal.aborted) {
                settotalPages(response.pagination.totalPages);
                if (append) {
                    SetAnnouncements(prev => [...prev, ...response.data]);
                } else {
                    SetAnnouncements(response.data);
                }
            }
        } catch (error: unknown) {
            if (
                error instanceof Error &&
                (error.name === 'AbortError' ||
                    (error as { code?: string }).code === 'ERR_CANCELED')
            ) {
                return;
            }
        }
        finally {
            if (!signal.aborted) {
                SetIsLoading(false);
                SetIsLoadingMore(false);
            }
        }
    }, [language, startdate, endDate, limit, state_ut]);


    useEffect(() => {
        const controller = new AbortController();
        Setpage(1);
        fetchGetIndiaAnnouncements(1, false, controller.signal);

        return () => controller.abort();
    }, [language, startdate, endDate, fetchGetIndiaAnnouncements]);


    useEffect(() => {
        if (page > 1) {
            const controller = new AbortController();
            fetchGetIndiaAnnouncements(page, true, controller.signal);
            return () => controller.abort();
        }
    }, [page, fetchGetIndiaAnnouncements]);

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
            if (SearchInput.trim() === "" || SearchInput.length < 3) {
                toast.info("Please enter at least 3 characters to search.");
                return;
            }
            router.push(`/announcements?SearchInput=${SearchInput}`);
        }
    };

    return (
        <section
            className='flex bg-[#E6E6E6] flex-col'
        >
            <AnnoucementsHeader />
            <SerchInputbox />
            <ShowAnnouncements
                LoadMoreData={OnLoadMoredata}
                Announcements={Announcements}
                IsLoading={IsLoading}
                page={page}
                totalpage={totalPages}
                IsLoadingMore={IsLoadingMore}
                ShowBackButtom={false}
            />

        </section>
    );
};

export default Main;