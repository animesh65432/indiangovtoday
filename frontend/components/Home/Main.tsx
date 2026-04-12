import React, { useEffect, useState, useContext, useRef } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types";
import { LanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import { GetStateCode } from "@/lib/GetStateCode"
import { LocationContext } from "@/context/LocationProvider"
import { TranslateText } from "@/lib/translatetext"
import { buildCacheKey, withCache } from "@/lib/lsCache";
import ShowAnnouncements from './ShowAnnouncements';
import Header from './Header';
import { useHeroScroll } from '@/hooks/useHeroScroll';
import dynamic from 'next/dynamic'

const IndiaMap = dynamic(() => import('../IndiaMap'), { ssr: false });


const Main: React.FC = () => {
    const { language } = useContext(LanguageContext);
    const [ShowIndiaMap, SetShowIndiaMap] = useState<boolean>(false);
    const [IsMapLoading, SetIsMapLoading] = useState<boolean>(false);
    const [StatesSelected, SetStatesSelected] = useState<string[]>([]);
    const [SearchQuery, SetSearchQuery] = useState<string>("");
    const [sheetOpen, setSheetOpen] = useState(false)
    const [CategorySelected, SetCategorySelected] = useState<string>(`${TranslateText[language].ALL_DEPARMENTS}`);
    const [totalPages, settotalPages] = useState<number>(0)
    const [categoryOptions, setCategoryOptions] = useState<string[]>([])
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const firstLoad = useRef(true);
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)
    const { scrolled } = useHeroScroll();

    const { startdate, endDate } = useContext(Currentdate)
    const { state_ut } = useContext(LocationContext)

    const [DefaultsStatesApplied, SetDefaultsStatesApplied] = useState<string[]>([])

    const [trigger, setTrigger] = useState(0);
    const userStateCode = GetStateCode(state_ut, language);

    const fetchGetIndiaAnnouncements = async (
        pageNumber: number,
        append: boolean,
        signal: AbortSignal
    ) => {

        if (append) SetIsLoadingMore(true);
        else SetIsLoading(true);

        try {

            const category = CategorySelected === TranslateText[language].ALL_DEPARMENTS ? "" : CategorySelected;

            const key = buildCacheKey("announcements", { language, startdate, endDate, page, limit, category });

            const response = await withCache(key, "announcements", async () => (
                await getAllAnnouncements(
                    language, startdate, endDate, pageNumber, limit, category, StatesSelected, signal
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
        CategorySelected,
        language,
        state_ut,
        trigger,
        DefaultsStatesApplied
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
        SetCategorySelected(TranslateText[language].ALL_DEPARMENTS);
    }, [language]);

    const onStateClick = (state: string | null) => {
        if (!state) return;
        SetStatesSelected([state]);
    }


    return (
        <section className="flex h-screen w-screen relative overflow-hidden">
            <div className="absolute inset-0">
                <IndiaMap
                    ShowIndiaMap={ShowIndiaMap}
                    SetShowIndiaMap={SetShowIndiaMap}
                    announcements={Announcements}
                    selectedStates={StatesSelected}
                    onStateClick={onStateClick}
                    IsMapLoading={IsMapLoading}
                    SetIsMapLoading={SetIsMapLoading}
                />
            </div>
            <div className="relative z-500 w-[40%] flex flex-col gap-3 h-[95vh] shrink-0 m-4 pointer-events-auto">
                <Header
                    categoryOptions={categoryOptions}
                    setCategoryOptions={setCategoryOptions}
                    CategorySelected={CategorySelected}
                    SetCategorySelected={SetCategorySelected}
                    selectedStates={StatesSelected}
                    onStateClick={onStateClick}
                />
                <ShowAnnouncements
                    Announcements={Announcements}
                    IsLoading={IsLoading}
                    IsLoadingMore={IsLoadingMore}
                    LoadMoreData={OnLoadMoredata}
                    totalpage={totalPages}
                    page={page}
                />
            </div>

            <div className="flex-1 pointer-events-none" />
        </section>
    )
};

export default Main;

