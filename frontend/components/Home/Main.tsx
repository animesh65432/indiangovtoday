import React, { useEffect, useState, useContext } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types";
import { LanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import AnnoucementsHeader from '@/components/AnnoucementsHeader';
import { GetStateCode, normalizeGeoName } from "@/lib/GetStateCode"
import { LocationContext } from "@/context/LocationProvider"
import SerchInputbox from './SearchInputbox';
import { TranslateText } from "@/lib/translatetext"
import { toast } from "react-toastify"
import dynamic from 'next/dynamic';
import RightSide from './RightSide';
import { ChevronDown, ChevronUp } from "lucide-react"
import MobileShowAnnoucments from './MobileShowAnnoucments';


const IndiaMap = dynamic(() => import("../IndiaMap"), {
    ssr: false,
});

const Main: React.FC = () => {
    const { language } = useContext(LanguageContext);
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [StatesSelected, SetStatesSelected] = useState<string[]>([]);
    const [AnnouncementsType, SetAnnouncementsType] = useState<"All" | "Central Govt" | "States Govt">(`All`);
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

    const [ShowIndiaMap, SetShowIndiaMap] = useState<boolean>(true)

    const userStateCode = GetStateCode(state_ut, language);

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

            const INDIA_GOVT_CODE = TranslateText[language]["MULTISELECT_OPTIONS"][
                TranslateText[language]["MULTISELECT_OPTIONS"].length - 1
            ].value;


            const filteredStates =
                AnnouncementsType === "Central Govt"
                    ? StatesSelected.filter(s => s === INDIA_GOVT_CODE)
                    : AnnouncementsType === "States Govt"
                        ? StatesSelected.filter(s => s !== INDIA_GOVT_CODE)
                        : StatesSelected;

            const DeparMentsPayload = TranslateText[language].ALL_DEPARMENTS === DeparmentsSelected ? "" : DeparmentsSelected;

            const response = await getAllAnnouncements(
                language, startdate, endDate, pageNumber, limit,
                filteredStates, DeparMentsPayload, SearchInput, signal
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
    }, [language, state_ut, trigger, DefaultsStatesApplied, DeparmentsSelected, AnnouncementsType, startdate, endDate, StatesSelected]);

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
        if (!state) return;
        SetStatesSelected((prev) => {
            if (prev.includes(state)) {
                return prev.filter((s) => s !== state);
            } else {
                return [...prev, state];
            }
        })
    }

    useEffect(() => {
        if (!SearchInput) return;
        const timer = setTimeout(() => handleSearch(), 500);
        return () => clearTimeout(timer);
    }, [SearchInput]);

    const shouldShowMap = ShowIndiaMap && AnnouncementsType !== "Central Govt";

    return (

        <section className="flex flex-col md:flex-row w-full h-screen md:min-h-screen overflow-hidden md:overflow-visible  ">
            <div className='block md:hidden'>
                <AnnoucementsHeader />
            </div>
            <div className='block md:hidden'>
                <SerchInputbox
                    SearchInput={SearchInput}
                    SetSearchInput={SetSearchInput}
                    onSearch={handleSearch}
                    DeparmentsSelected={DeparmentsSelected}
                    SetDeparmentsSelected={SetDeparmentsSelected}
                    StatesSelected={StatesSelected}
                    SetStatesSelected={SetStatesSelected}
                    AnnouncementsType={AnnouncementsType}
                    SetAnnouncementsType={SetAnnouncementsType}
                />
            </div>
            {shouldShowMap &&
                <div className="flex mt-2 md:mt-0 items-center justify-between md:hidden px-3 py-1 border border-[#E5E2D8]">
                    <span className="flex items-center gap-1">
                        <span>🗺️ </span>
                        <span className="text-[13px] font-inter font-semibold text-[#555555]">Indian Map</span>
                    </span>
                    {ShowIndiaMap ? (
                        <ChevronUp onClick={() => SetShowIndiaMap(false)} className="w-4 h-4 text-[#555]" />
                    ) : (
                        <ChevronDown onClick={() => SetShowIndiaMap(true)} className="w-4 h-4 text-[#555]" />
                    )}
                </div>
            }
            {shouldShowMap &&
                <div className="h-[30vh] md:w-[40vw] xl:w-[25vw] md:shrink-0">
                    <IndiaMap
                        announcements={Announcements}
                        selectedStates={StatesSelected}
                        onStateClick={handleStateClick}
                        ShowIndiaMap={ShowIndiaMap}
                        SetShowIndiaMap={SetShowIndiaMap}
                    />
                </div>
            }

            <div className="hidden md:flex-1 md:block">
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
                    AnnouncementsType={AnnouncementsType}
                    SetAnnouncementsType={SetAnnouncementsType}
                />
            </div>
            <MobileShowAnnoucments
                announcements={Announcements}
                IsLoading={IsLoading}
                IsLoadingMore={IsLoadingMore}
                LoadMoreData={OnLoadMoredata}
                page={page}
                totalpages={totalPages}
            />
        </section >

    );
};

export default Main;