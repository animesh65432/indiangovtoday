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
import { TranslateText } from "@/lib/translatetext"

const Main: React.FC = () => {
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [totalPages, settotalPages] = useState<number>(0)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const { startdate, endDate } = useContext(Currentdate)
    const { language } = useContext(LanguageContext)
    const { state_ut } = useContext(LocationContext)
    const [DeparmentsSelected, SetDeparmentsSelected] = useState<string[]>([]);
    const [StatesSelected, SetStatesSelected] = useState<string[]>([]);
    const [page, Setpage] = useState<number>(1)
    const defaultsApplied = useRef(false);
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

        console.log(StatesSelected)

        if (append) SetIsLoadingMore(true);
        if (StatesSelected.length === 0) return;
        else SetIsLoading(true);
        try {

            const response = await getAllAnnouncements(
                language, startdate, endDate, pageNumber, limit, StatesSelected, signal
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
    }, [language, startdate, endDate, limit, StatesSelected]);


    useEffect(() => {
        const controller = new AbortController();
        Setpage(1);
        fetchGetIndiaAnnouncements(1, false, controller.signal);

        return () => controller.abort();
    }, [language, startdate, endDate, fetchGetIndiaAnnouncements, state_ut]);


    useEffect(() => {
        if (!state_ut || defaultsApplied.current) return;

        const userStateCode = useStateCode(state_ut, language);
        const INDIA_GOVT_CODE = TranslateText[language]["MULTISELECT_OPTIONS"][TranslateText[language]["MULTISELECT_OPTIONS"].length - 1].value;


        console.log("Applying default state selections:", INDIA_GOVT_CODE);

        console.log(TranslateText[language]["MULTISELECT_OPTIONS"])

        SetStatesSelected([
            INDIA_GOVT_CODE,
            userStateCode,
        ]);

        defaultsApplied.current = true;
    }, [state_ut, language]);


    useEffect(() => {
        if (page > 1) {
            const controller = new AbortController();
            fetchGetIndiaAnnouncements(page, true, controller.signal);
            return () => controller.abort();
        }
    }, [page, fetchGetIndiaAnnouncements, state_ut]);

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
            <SerchInputbox
                SetStatesSelected={SetStatesSelected}
                StatesSelected={StatesSelected}
                DeparmentsSelected={DeparmentsSelected}
                SetDeparmentsSelected={SetDeparmentsSelected}
            />
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