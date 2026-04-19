import React, { useEffect, useState, useContext, useRef } from 'react';
import { getAllAnnouncements, GetBriefAnnouncements } from "@/api/announcements";
import { Announcement as AnnouncementTypes, AnnouncementsResponse, Brief_Announcement } from "@/types";
import { LanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import { GetStateCode } from "@/lib/GetStateCode"
import { LocationContext } from "@/context/LocationProvider"
import { TranslateText } from "@/lib/translatetext"
import { buildCacheKey, withCache } from "@/lib/lsCache";
import ShowAnnouncements from './ShowAnnouncements';
import Header from './Header';
import { Briefing_Announcement_Response } from "@/types";
import MobileHeader from './MobileHeader';
import DataTypes from './DataTypes';
import dynamic from 'next/dynamic'
import User from './User';
import MobileBottomSheet from './MobileBottomSheet';
import { ThemeContext } from '@/context/Theme';

const IndiaMap = dynamic(() => import('../IndiaMap'), { ssr: false });


const Main: React.FC = () => {
    const { language } = useContext(LanguageContext);
    const [BriefAnnouncements, SetBriefAnnouncements] = useState<Brief_Announcement[]>([])
    const [ShowIndiaMap, SetShowIndiaMap] = useState<boolean>(false);
    const [IsMapLoading, SetIsMapLoading] = useState<boolean>(false);
    const [StatesSelected, SetStatesSelected] = useState<string[]>([]);
    const [SearchQuery, SetSearchQuery] = useState<string>("");
    const [CategorySelected, SetCategorySelected] = useState<string>(`${TranslateText[language].ALL_DEPARMENTS}`);
    const [totalPages, settotalPages] = useState<number>(0)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const firstLoad = useRef(true);
    const [sheetOpen, setSheetOpen] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)
    const { startdate, endDate } = useContext(Currentdate)
    const { theme } = useContext(ThemeContext)
    const { state_ut } = useContext(LocationContext)
    const [DefaultsStatesApplied, SetDefaultsStatesApplied] = useState<string[]>([])
    const [trigger, setTrigger] = useState(0);
    const userStateCode = GetStateCode(state_ut, language);
    const [ShowBriefingComponent, SetShowBriefingComponent] = useState<boolean>(true);
    const [CategoriesOptions, SetCategoriesOptions] = useState<string[]>(TranslateText[language].CATEGORIES_OPTIONS || []);
    const IsDark = theme === "dark"

    const fetchGetIndiaAnnouncements = async (
        pageNumber: number,
        append: boolean,
        signal: AbortSignal
    ) => {

        if (append) SetIsLoadingMore(true);
        else SetIsLoading(true);

        try {

            const category = CategorySelected === TranslateText[language].ALL_DEPARMENTS ? "" : CategorySelected;

            const key = buildCacheKey("announcements", { language, startdate, endDate, page, limit, category, SearchQuery });

            const response = await withCache(key, "announcements", async () => (
                await getAllAnnouncements(
                    language, SearchQuery, startdate, endDate, pageNumber, limit, category, StatesSelected, CategoriesOptions, signal
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

    const fetchBriefAnnouncements = async () => {
        try {
            const key = buildCacheKey("announcements", { language, startdate, endDate, StatesSelected: StatesSelected.join("") });

            const response = await withCache(key, "announcements", async () => (
                await GetBriefAnnouncements(language, startdate, endDate, StatesSelected) as Briefing_Announcement_Response
            ));
            if (response.success) {
                SetBriefAnnouncements(response.data);
            }
        } catch (error) {
            console.error("Error fetching brief announcements:", error);
        }
    };

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
        DefaultsStatesApplied,
        CategoriesOptions
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
        if (StatesSelected.length > 0) {
            fetchBriefAnnouncements();
        }
    }, [language, startdate, endDate, StatesSelected, CategoriesOptions]);

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

    useEffect(() => {
        SetShowBriefingComponent(TranslateText[language].ALL_DEPARMENTS === CategorySelected);
    }, [CategorySelected]);

    useEffect(() => {
        SetCategorySelected(TranslateText[language].ALL_DEPARMENTS);
        SetCategoriesOptions(TranslateText[language].CATEGORIES_OPTIONS || []); // add this line
    }, [language]);

    const onStateClick = (state: string | null) => {
        if (!state) return;
        const Options = TranslateText[language].MULTISELECT_OPTIONS
        SetStatesSelected([state, Options[Options.length - 1].value]);
    }

    return (
        <section className="flex h-screen w-screen relative overflow-clip">
            <div className="absolute inset-0">
                <IndiaMap
                    ShowIndiaMap={ShowIndiaMap}
                    SetShowIndiaMap={SetShowIndiaMap}
                    announcements={Announcements}
                    selectedStates={StatesSelected}
                    onStateClick={onStateClick}
                    IsMapLoading={IsMapLoading}
                    SetIsMapLoading={SetIsMapLoading}
                    CategoriesOptions={CategoriesOptions}
                />
                {IsMapLoading && (
                    <div className={`absolute inset-0 z-999  font-satoshi flex items-center justify-center backdrop-blur-[2px] ${IsDark ? "bg-black/40" : "bg-white/40"}`}>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-[#c51057]/20 border-t-[#c51057] animate-spin" />
                            <span className={`text-[0.75rem] font-semibold ${IsDark ? "text-white/70" : "text-[#c51057]"}`}>
                                Loading map...
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute top-0 left-0 right-0 z-500 md:hidden pointer-events-none">
                <div className="pointer-events-auto">
                    <MobileHeader
                        selectedStates={StatesSelected}
                        onStateClick={onStateClick}
                        sheetOpen={sheetOpen}
                        setSheetOpen={setSheetOpen}
                        StatesSelected={StatesSelected}
                        SetStatesSelected={SetStatesSelected}
                        SearchQuery={SearchQuery}
                        SetSearchQuery={SetSearchQuery}
                        handleSearch={handleSearch}
                    />
                </div>
            </div>

            <MobileBottomSheet
                CategorySelected={CategorySelected}
                SetCategorySelected={SetCategorySelected}
                Announcements={Announcements}
                IsLoading={IsLoading}
                IsLoadingMore={IsLoadingMore}
                LoadMoreData={OnLoadMoredata}
                totalpage={totalPages}
                page={page}
                StatesSelected={StatesSelected}
                BriefAnnouncements={BriefAnnouncements}
                ShowBriefingComponent={ShowBriefingComponent}
                setSheetOpen={setSheetOpen}
                sheetOpen={sheetOpen}
                SearchQuery={SearchQuery}
                SetSearchQuery={SetSearchQuery}
                handleClick={handleSearch}
                SetStatesSelected={SetStatesSelected}
                Options={CategoriesOptions}
            />
            <div className="relative z-500 w-[40%] hidden md:flex flex-col gap-3 h-[95vh] shrink-0 m-4 pointer-events-auto overflow-hidden">
                <Header
                    CategoriesOptions={CategoriesOptions}
                    CategorySelected={CategorySelected}
                    SetCategorySelected={SetCategorySelected}
                    selectedStates={StatesSelected}
                    onStateClick={onStateClick}
                    BriefAnnouncements={BriefAnnouncements}
                    StatesSelected={StatesSelected}
                    setSheetOpen={setSheetOpen}
                    SetStatesSelected={SetStatesSelected}
                    sheetOpen={sheetOpen}
                    SearchQuery={SearchQuery}
                    SetSearchQuery={SetSearchQuery}
                    handleClick={handleSearch}
                />
                <ShowAnnouncements
                    Announcements={Announcements}
                    IsLoading={IsLoading}
                    IsLoadingMore={IsLoadingMore}
                    LoadMoreData={OnLoadMoredata}
                    totalpage={totalPages}
                    page={page}
                    StatesSelected={StatesSelected}
                    BriefAnnouncements={BriefAnnouncements}
                    ShowBriefingComponent={ShowBriefingComponent}
                />
            </div>

            <div className="hidden md:block absolute right-8 top-2/3 -translate-y-1/2 z-500">
                <DataTypes
                    CategoriesOptions={CategoriesOptions}
                    SetCategoriesOptions={SetCategoriesOptions}
                />
            </div>
            <div className="hidden md:block absolute right-8 top-8 -translate-y-1/2 z-500">
                <User
                    sheetOpen={sheetOpen}
                    setSheetOpen={setSheetOpen}
                    StatesSelected={StatesSelected}
                    SetStatesSelected={SetStatesSelected}
                    SearchQuery={SearchQuery}
                    SetSearchQuery={SetSearchQuery}
                    handleSearch={handleSearch}
                />
            </div>

            <div className="flex-1 pointer-events-none" />
        </section>
    )
};

export default Main;

