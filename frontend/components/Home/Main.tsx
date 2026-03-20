import React, { useEffect, useState, useContext, useRef } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types";
import { LanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import AnnoucementsHeader from '@/components/AnnoucementsHeader';
import { GetStateCode } from "@/lib/GetStateCode"
import { LocationContext } from "@/context/LocationProvider"
import { TranslateText } from "@/lib/translatetext"
import { toast } from "react-toastify"
import SearchInputBox from './SearchInputbox';
import Hero from './Hero';
import { buildCacheKey, withCache } from "@/lib/lsCache";
import ShowAnnouncements from '../ShowAnnouncements';
import dynamic from "next/dynamic";

const IndiaMap = dynamic(() => import("@/components/IndiaMap"), {
    ssr: false,
});



const Main: React.FC = () => {
    const { language } = useContext(LanguageContext);
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [StatesSelected, SetStatesSelected] = useState<string[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false)
    const [DeparmentsSelected, SetDeparmentsSelected] = useState<string>(``);
    const [CategoriesSelected, SetCategoriesSelected] = useState<string>(``);
    const [totalPages, settotalPages] = useState<number>(0)
    const [categoryOptions, setCategoryOptions] = useState<string[]>([])
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const firstLoad = useRef(true);
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)

    const { startdate, endDate, onChangeEndDate, onChangeStartDate } = useContext(Currentdate)
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

            const DeparMentsPayload = TranslateText[language].ALL_DEPARMENTS === DeparmentsSelected ? "" : DeparmentsSelected;

            const key = buildCacheKey("announcements", { language, startdate, endDate, page, states: StatesSelected, dept: DeparMentsPayload, search: SearchInput })

            const response = await withCache(key, "announcements", async () => (
                await getAllAnnouncements(
                    language, startdate, endDate, pageNumber, limit,
                    StatesSelected, DeparMentsPayload, SearchInput, signal
                ) as AnnouncementsResponse
            ));

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
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        const controller = new AbortController();

        Setpage(1);
        fetchGetIndiaAnnouncements(1, false, controller.signal);

        return () => controller.abort();
    }, [
        CategoriesSelected,
        language,
        state_ut,
        trigger,
        DeparmentsSelected,
        startdate,
        endDate,
        StatesSelected
    ]);

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

    const handleMobileApply = (
        dept: string,
        category: string,
        states: string[],
        startDate: Date | null,
        endDate: Date | null
    ) => {
        SetDeparmentsSelected(dept)
        SetCategoriesSelected(category)
        SetStatesSelected(states)
        if (startDate) onChangeStartDate(startDate)
        if (endDate) onChangeEndDate(endDate)
        setSheetOpen(false)
    }

    const handleMobileReset = () => {
        SetDeparmentsSelected("")
        SetCategoriesSelected("")
        const today = new Date();
        const ThirteenDaysAgo = new Date();
        ThirteenDaysAgo.setDate(today.getDate() - 30);
        onChangeStartDate(ThirteenDaysAgo);
        onChangeEndDate(today);
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
        setSheetOpen(false)
    }


    return (
        <section className="flex flex-col gap-2 pb-2 h-screen w-screen overflow-hidden md:overflow-visible  ">
            <AnnoucementsHeader />
            <div className='flex flex-col md:flex-row'>
                <div>
                    <IndiaMap
                        ShowIndiaMap={ShowIndiaMap}
                        SetShowIndiaMap={SetShowIndiaMap}
                        announcements={Announcements}
                        selectedStates={StatesSelected}
                        onStateClick={handleStateClick}
                    />
                </div>
                <div className='flex-1 flex flex-col gap-4'>
                    <Hero />
                    <SearchInputBox
                        StatesSelected={StatesSelected}
                        SetStatesSelected={SetStatesSelected}
                        SearchInput={SearchInput} SetSearchInput={SetSearchInput}
                        onSearch={handleSearch}
                        categoryOptions={categoryOptions}
                        setCategoryOptions={setCategoryOptions}
                        CategoriesSelected={CategoriesSelected} SetCategoriesSelected={SetCategoriesSelected}
                        handleMobileApply={handleMobileApply}
                        handleMobileReset={handleMobileReset}
                        sheetOpen={sheetOpen}
                        setSheetOpen={setSheetOpen}
                    />
                </div>
            </div>
        </section >

    );
};

export default Main;

