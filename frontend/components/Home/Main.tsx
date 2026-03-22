import React, { useEffect, useState, useContext, useRef } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types";
import { LanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import AnnoucementsHeader from '@/components/AnnoucementsHeader';
import { GetStateCode } from "@/lib/GetStateCode"
import { LocationContext } from "@/context/LocationProvider"
import { TranslateText } from "@/lib/translatetext"
import SearchInputBox from './SearchInputbox';
import Hero from './Hero';
import { buildCacheKey, withCache } from "@/lib/lsCache";
import ShowAnnouncements from './ShowAnnouncements';
import dynamic from "next/dynamic";
import Loading from "./Loading"

const IndiaMap = dynamic(() => import("@/components/IndiaMap"), {
    ssr: false,
});

const Main: React.FC = () => {
    const { language } = useContext(LanguageContext);
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [StatesSelected, SetStatesSelected] = useState<string[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false)
    const [CategorySelected, SetCategorySelected] = useState<string>(`${TranslateText[language].ALL_DEPARMENTS}`);
    const [totalPages, settotalPages] = useState<number>(0)
    const [categoryOptions, setCategoryOptions] = useState<string[]>([])
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const firstLoad = useRef(true);
    const [IsMapLoading, SetIsMapLoading] = useState(true);
    const [IsAnnouncementsLoading, SetIsAnnouncementsLoading] = useState(true);
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
            SetIsAnnouncementsLoading(false);
            return;
        }

        try {

            const key = buildCacheKey("announcements", { language, startdate, endDate, page, states: StatesSelected, search: SearchInput, category: CategorySelected });

            const SelectedCategory = CategorySelected === TranslateText[language].ALL_DEPARMENTS ? "" : CategorySelected;

            console.log(SelectedCategory, "SelectedCategory", TranslateText[language].ALL_DEPARMENTS)


            const response = await withCache(key, "announcements", async () => (
                await getAllAnnouncements(
                    language, startdate, endDate, pageNumber, limit,
                    StatesSelected, SelectedCategory, SearchInput, signal
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
                SetIsAnnouncementsLoading(false);
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
        CategorySelected,
        language,
        state_ut,
        trigger,
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
    }, [state_ut, language]);

    useEffect(() => {
        if (page > 1) {
            const controller = new AbortController();
            fetchGetIndiaAnnouncements(page, true, controller.signal);
            return () => controller.abort();
        }
    }, [page]);

    useEffect(() => {
        SetIsAnnouncementsLoading(true);
        SetIsMapLoading(true);
    }, [language])

    const handleSearch = () => {
        if (StatesSelected.length === 0 && DefaultsStatesApplied.length === 0) {
            return;
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
        SetCategorySelected(TranslateText[language].ALL_DEPARMENTS);
    }, [language]);

    useEffect(() => {
        if (firstLoad.current) return;
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
        SetCategorySelected(category)
        SetStatesSelected(states)
        if (startDate) onChangeStartDate(startDate)
        if (endDate) onChangeEndDate(endDate)
        setSheetOpen(false)
    }

    const handleMobileReset = () => {
        SetSearchInput("")
        SetCategorySelected("")
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

    const isGlobalLoading = IsAnnouncementsLoading && IsMapLoading && StatesSelected.length > 0;

    if (isGlobalLoading) {
        return <Loading />
    }

    return (
        <section className="flex flex-col gap-0 h-screen w-screen overflow-hidden">
            <AnnoucementsHeader />
            <div className='md:hidden block'>
                <Hero />
            </div>
            <div className='md:hidden block mt-2 md:mt-0'>
                <SearchInputBox
                    StatesSelected={StatesSelected}
                    SetStatesSelected={SetStatesSelected}
                    SearchInput={SearchInput}
                    SetSearchInput={SetSearchInput}
                    onSearch={handleSearch}
                    categoryOptions={categoryOptions}
                    setCategoryOptions={setCategoryOptions}
                    CategorySelected={CategorySelected}
                    SetCategorySelected={SetCategorySelected}
                    handleMobileApply={handleMobileApply}
                    handleMobileReset={handleMobileReset}
                    sheetOpen={sheetOpen}
                    setSheetOpen={setSheetOpen}
                />
            </div>


            <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden mt-2 md:mt-0">

                <div className={`flex-shrink-0 w-[98%] mx-auto md:0 md:w-[380px] ${ShowIndiaMap ? "h-[35vh] md:h-full" : "h-auto"}  overflow-hidden`}>
                    <IndiaMap
                        ShowIndiaMap={ShowIndiaMap}
                        SetShowIndiaMap={SetShowIndiaMap}
                        announcements={Announcements}
                        selectedStates={StatesSelected}
                        onStateClick={handleStateClick}
                        IsMapLoading={IsMapLoading}
                        SetIsMapLoading={SetIsMapLoading}
                    />
                </div>


                <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
                    <div className='md:block hidden'>
                        <Hero />
                    </div>
                    <div className='md:block hidden'>
                        <SearchInputBox
                            StatesSelected={StatesSelected}
                            SetStatesSelected={SetStatesSelected}
                            SearchInput={SearchInput}
                            SetSearchInput={SetSearchInput}
                            onSearch={handleSearch}
                            categoryOptions={categoryOptions}
                            setCategoryOptions={setCategoryOptions}
                            CategorySelected={CategorySelected}
                            SetCategorySelected={SetCategorySelected}
                            handleMobileApply={handleMobileApply}
                            handleMobileReset={handleMobileReset}
                            sheetOpen={sheetOpen}
                            setSheetOpen={setSheetOpen}
                        />
                    </div>

                    {/* ── Only this div scrolls ── */}
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <ShowAnnouncements
                            Announcements={Announcements}
                            LoadMoreData={OnLoadMoredata}
                            page={page}
                            totalpage={totalPages}
                            IsLoading={IsLoading}
                            IsLoadingMore={IsLoadingMore}
                            handleMobileReset={handleMobileReset}
                        />
                    </div>

                </div>
            </div>
        </section>

    );
};

export default Main;

