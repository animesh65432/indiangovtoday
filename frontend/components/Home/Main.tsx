import React, { useEffect, useState, useContext } from 'react';
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
import { toast } from "react-toastify"
import dynamic from 'next/dynamic';
import RightSide from './RightSide';

const IndiaMap = dynamic(() => import("../IndiaMap"), {
    ssr: false,
});

const Main: React.FC = () => {
    const { language } = useContext(LanguageContext);
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [StatesSelected, SetStatesSelected] = useState<string[]>([]);
    const [DeparmentsSelected, SetDeparmentsSelected] = useState<string>(``);

    const [totalPages, settotalPages] = useState<number>(0)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)

    const { startdate, endDate } = useContext(Currentdate)
    const { state_ut } = useContext(LocationContext)

    const [DefaultsStatesApplied, SetDefaultsStatesApplied] = useState<string[]>([])

    const [trigger, setTrigger] = useState(0);

    const userStateCode = useStateCode(state_ut, language);

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

            const DeparMentsPayload = TranslateText[language].ALL_DEPARMENTS === DeparmentsSelected ? "" : DeparmentsSelected;

            const response = await getAllAnnouncements(
                language, startdate, endDate, pageNumber, limit,
                StatesSelected, DeparMentsPayload, SearchInput, signal
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
    }, [language, state_ut, trigger, DefaultsStatesApplied, DeparmentsSelected]);

    useEffect(() => {
        if (state_ut) {
            const INDIA_GOVT_CODE = TranslateText[language]["MULTISELECT_OPTIONS"][TranslateText[language]["MULTISELECT_OPTIONS"].length - 1].value;
            SetStatesSelected([INDIA_GOVT_CODE, userStateCode]);
            SetDefaultsStatesApplied([INDIA_GOVT_CODE, userStateCode]);
        }
        else {
            const INDIA_GOVT_CODE = TranslateText[language]["MULTISELECT_OPTIONS"][TranslateText[language]["MULTISELECT_OPTIONS"].length - 1].value;
            SetStatesSelected([INDIA_GOVT_CODE]);
            SetDefaultsStatesApplied([INDIA_GOVT_CODE]);
        }
        SetDeparmentsSelected("")
    }, [state_ut, language]);

    useEffect(() => {
        if (page > 1) {
            const controller = new AbortController();
            fetchGetIndiaAnnouncements(page, true, controller.signal);
            return () => controller.abort();
        }
    }, [page]);

    const handleSearch = () => {
        if (StatesSelected.length === 0) {
            toast.error(`${TranslateText[language].NO_STATE_SELECTED}`);
        }
        else {
            Setpage(1);
            setTrigger(prev => prev + 1);
        }
    };

    const OnLoadMoredata = () => {
        if (page < totalPages) {
            Setpage(prev => prev + 1);
        }
    }

    const handleStateClick = (state: string | null) => {
        console.log("State clicked:", state);
    }


    return (

        <section className="flex flex-col md:flex-row w-screen h-screen ">

            <div className="w-full h-full md:w-[40vw] xl:w-[25vw] md:shrink-0">
                <IndiaMap
                    announcements={Announcements}
                    selectedStates={["Mizoram", "Delhi", "West Bengal"]}
                    onStateClick={handleStateClick}
                />
            </div>

            <div className="flex-1">
                <RightSide
                    StatesSelected={StatesSelected}
                    SetStatesSelected={SetStatesSelected}
                    DeparmentsSelected={DeparmentsSelected}
                    SetDeparmentsSelected={SetDeparmentsSelected}
                    SearchInput={SearchInput}
                    SetSearchInput={SetSearchInput}
                    onSearch={handleSearch}
                    announcements={Announcements}
                    IsLoading={IsLoading}
                    IsLoadingMore={IsLoadingMore}
                    LoadMoreData={OnLoadMoredata}
                    page={page}
                    totalpages={totalPages}
                />
            </div>
        </section>

    );
};

export default Main;