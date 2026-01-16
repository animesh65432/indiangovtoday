import React, { useEffect, useState, useContext, useRef } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types";
import { LanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import ShowAnnouncements from '../ShowAnnouncements';
import AnnoucementsHeader from '@/components/AnnoucementsHeader';
import { useStateCode } from "@/lib/useStateCode"
import { LocationContext } from "@/context/LocationProvider"
import SerchInputbox from './SearchInputbox';
import { TranslateText } from "@/lib/translatetext"

const Main: React.FC = () => {
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [StatesSelected, SetStatesSelected] = useState<string[]>([]);
    const [DeparmentsSelected, SetDeparmentsSelected] = useState<string>("");

    const [totalPages, settotalPages] = useState<number>(0)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)

    const { startdate, endDate } = useContext(Currentdate)
    const { language } = useContext(LanguageContext)
    const { state_ut } = useContext(LocationContext)

    const [DefaultsStatesApplied, SetDefaultsStatesApplied] = useState<string[]>([])

    const [trigger, setTrigger] = useState(0);

    const fetchGetIndiaAnnouncements = async (
        pageNumber: number,
        append: boolean,
        signal: AbortSignal
    ) => {

        if (append) SetIsLoadingMore(true);

        else SetIsLoading(true);

        if (StatesSelected.length === 0) {
            SetIsLoading(false);
            return;
        }

        try {
            const response = await getAllAnnouncements(
                language, startdate, endDate, pageNumber, limit,
                StatesSelected, DeparmentsSelected, SearchInput, signal
            ) as AnnouncementsResponse;

            if (!signal.aborted) {
                settotalPages(response.pagination.totalPages);
                SetAnnouncements(prev => append ? [...prev, ...response.data] : response.data);
            }
        } catch (error: unknown) {
            if (error instanceof Error &&
                (error.name === 'AbortError' || (error as { code?: string }).code === 'ERR_CANCELED')) {
                return;
            }
        } finally {
            if (!signal.aborted) {
                SetIsLoading(false);
                SetIsLoadingMore(false);
            }
        }
    }


    useEffect(() => {
        const controller = new AbortController();
        Setpage(1);
        fetchGetIndiaAnnouncements(1, false, controller.signal);
        return () => controller.abort();
    }, [language, state_ut, trigger, DefaultsStatesApplied]);


    useEffect(() => {
        if (state_ut) {
            const userStateCode = useStateCode(state_ut, language);
            const INDIA_GOVT_CODE = TranslateText[language]["MULTISELECT_OPTIONS"][TranslateText[language]["MULTISELECT_OPTIONS"].length - 1].value;
            SetStatesSelected([INDIA_GOVT_CODE, userStateCode]);
            SetDefaultsStatesApplied([INDIA_GOVT_CODE, userStateCode]);
        }
        else {
            const INDIA_GOVT_CODE = TranslateText[language]["MULTISELECT_OPTIONS"][TranslateText[language]["MULTISELECT_OPTIONS"].length - 1].value;
            SetStatesSelected([INDIA_GOVT_CODE]);
            SetDefaultsStatesApplied([INDIA_GOVT_CODE]);
        }
    }, [state_ut, language]);

    useEffect(() => {
        if (page > 1) {
            const controller = new AbortController();
            fetchGetIndiaAnnouncements(page, true, controller.signal);
            return () => controller.abort();
        }
    }, [page]);

    const handleSearch = () => {
        Setpage(1);
        setTrigger(prev => prev + 1);
    };

    const OnLoadMoredata = () => {
        if (page < totalPages) {
            Setpage(prev => prev + 1);
        }
    }

    return (
        <section className='flex bg-[#E6E6E6] flex-col'>
            <AnnoucementsHeader />
            <SerchInputbox
                StatesSelected={StatesSelected}
                SetStatesSelected={SetStatesSelected}
                DeparmentsSelected={DeparmentsSelected}
                SetDeparmentsSelected={SetDeparmentsSelected}
                SearchInput={SearchInput}
                SetSearchInput={SetSearchInput}
                onSearch={handleSearch}
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