import { useEffect, useRef, useState } from "react";
import { getAllAnnouncements } from "@/api/announcements";
import { Announcement, AnnouncementsResponse } from "@/types";
import { buildCacheKey, withCache } from "@/lib/lsCache";
import { TranslateText } from "@/lib/translatetext";

type Props = {
    language: string;
    startdate: Date;
    endDate: Date;
    state_ut: string | null;
    userStateCode: string;
};

export const useAnnouncementsController = ({
    language,
    startdate,
    endDate,
    state_ut,
    userStateCode,
}: Props) => {
    const [StatesSelected, SetStatesSelected] = useState<string[]>([]);
    const [DefaultsStatesApplied, SetDefaultsStatesApplied] = useState<string[]>([]);
    const [CategorySelected, SetCategorySelected] = useState<string>(
        TranslateText[language].ALL_DEPARMENTS
    );
    const [Announcements, SetAnnouncements] = useState<Announcement[]>([]);
    const [page, Setpage] = useState(1);
    const [totalPages, settotalPages] = useState(0);
    const [IsLoading, SetIsLoading] = useState(false);
    const [IsLoadingMore, SetIsLoadingMore] = useState(false);
    const [trigger, setTrigger] = useState(0);

    const firstLoad = useRef(true);
    const limit = 10;

    // fetch
    const fetchData = async (
        pageNumber: number,
        append: boolean,
        signal: AbortSignal
    ) => {
        append ? SetIsLoadingMore(true) : SetIsLoading(true);

        try {
            const category =
                CategorySelected === TranslateText[language].ALL_DEPARMENTS
                    ? ""
                    : CategorySelected;

            const key = buildCacheKey("announcements", {
                language,
                startdate,
                endDate,
                page: pageNumber,
                limit,
                category,
            });

            const res = await withCache(key, "announcements", async () => {
                return (await getAllAnnouncements(
                    language,
                    startdate,
                    endDate,
                    pageNumber,
                    limit,
                    category,
                    StatesSelected,
                    signal
                )) as AnnouncementsResponse;
            });

            if (!signal.aborted) {
                settotalPages(res.pagination.totalPages);
                SetAnnouncements(prev =>
                    append ? [...prev, ...res.data] : res.data
                );
            }
        } catch (e: any) {
            if (e?.name === "AbortError") return;
        } finally {
            if (!signal.aborted) {
                SetIsLoading(false);
                SetIsLoadingMore(false);
            }
        }
    };

    // filters change
    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }

        const controller = new AbortController();
        Setpage(1);
        fetchData(1, false, controller.signal);

        return () => controller.abort();
    }, [CategorySelected, language, state_ut, trigger, DefaultsStatesApplied]);

    // default states
    useEffect(() => {
        const INDIA_GOVT_CODE =
            TranslateText[language]["MULTISELECT_OPTIONS"].slice(-1)[0].value;

        if (state_ut) {
            SetStatesSelected([INDIA_GOVT_CODE, userStateCode]);
            SetDefaultsStatesApplied([INDIA_GOVT_CODE, userStateCode]);
        } else {
            SetStatesSelected([INDIA_GOVT_CODE]);
            SetDefaultsStatesApplied([INDIA_GOVT_CODE]);
        }
    }, [state_ut, language, userStateCode]);

    // pagination
    useEffect(() => {
        if (page > 1) {
            const controller = new AbortController();
            fetchData(page, true, controller.signal);
            return () => controller.abort();
        }
    }, [page]);

    // language reset
    useEffect(() => {
        SetCategorySelected(TranslateText[language].ALL_DEPARMENTS);
    }, [language]);

    // actions
    const handleSearch = () => {
        if (!StatesSelected.length && !DefaultsStatesApplied.length) return;
        Setpage(1);
        setTrigger(prev => prev + 1);
    };

    const loadMore = () => {
        if (page < totalPages) {
            Setpage(prev => prev + 1);
        }
    };

    const resetFilters = () => {
        SetCategorySelected("");
        const today = new Date();
        const prev = new Date();
        prev.setDate(today.getDate() - 30);

        return { today, prev };
    };

    return {
        // state
        StatesSelected,
        SetStatesSelected,
        CategorySelected,
        SetCategorySelected,
        Announcements,
        IsLoading,
        IsLoadingMore,
        page,
        totalPages,

        // actions
        handleSearch,
        loadMore,
        resetFilters,
        SetDefaultsStatesApplied,
        DefaultsStatesApplied,
    };
};