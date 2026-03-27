import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import StickyNav from './StickyNav'
import { useHeroScroll } from '@/hooks/useHeroScroll'
import InputBox from '../Home/InputBox'
import { motion } from 'framer-motion'
import { Currentdate } from '@/context/Currentdate'
import { Announcement, AnnouncementsResponse } from "@/types"
import { LanguageContext } from '@/context/Lan'
import { SerachallIndiaAnnouncements } from "@/api/announcements"
import ShowAnnouncements from '../Home/ShowAnnouncements'
import { buildCacheKey, withCache } from '@/lib/lsCache'

type Props = {
    query: string
    startdate: string
    enddate: string
    states: string[]
}

const Search: React.FC<Props> = ({ query, startdate, enddate, states }) => {
    const [sheetOpen, setSheetOpen] = useState(false)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<Announcement[]>([])
    const { onChangeEndDate, onChangeStartDate, startdate: contextStartDate,
        endDate: contextEndDate, } = useContext(Currentdate)
    const [SearchQuery, SetSearchQuery] = useState<string>(query ?? "")
    const [statesSelected, setStatesSelected] = useState<string[]>(states ?? [])
    const { inputY, scrolled, inputOpacity } = useHeroScroll()
    const { language } = useContext(LanguageContext);
    const [DefaultsFilters, SetDefaultFilters] = useState<{
        startDate: Date;
        endDate: Date;
        states: string[];
        query: string;
    }>({
        startDate: contextStartDate,
        endDate: contextEndDate,
        states: [],
        query: "",
    })
    const [page, Setpage] = useState<number>(1)
    const [trigger, setTrigger] = useState(0)
    const [totalPages, settotalPages] = useState<number>(0)
    const [limit] = useState<number>(10)
    const firstLoad = useRef<boolean>(true)

    useEffect(() => {
        if (query && typeof query === "string" && query.length > 0) {
            SetDefaultFilters((prev) => ({ ...prev, query }))
            SetSearchQuery(query);
        }

        if (states?.length) {
            SetDefaultFilters((prev) => ({ ...prev, states: states }));
            setStatesSelected(states);
        }

        const handleDate = (
            date: string | undefined,
            setter: (d: Date) => void,
            label: string
        ): void => {
            if (!date) return;

            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                setter(parsedDate);
            } else {
                console.error(`Invalid ${label}:`, date);
            }

            if (label === "start date") {
                onChangeStartDate(parsedDate);
            }
            else {
                onChangeEndDate(parsedDate);
            }
        };

        handleDate(startdate, onChangeStartDate, "start date");
        handleDate(enddate, onChangeEndDate, "end date");


    }, [query, states, startdate, enddate]);


    const OnLoadMoredata = useCallback(() => {
        if (page < totalPages) {
            Setpage(prev => prev + 1);
        }
    }, [page, totalPages]);

    async function SearchInit(page: number, append: boolean, signal: AbortSignal) {
        if (append) SetIsLoadingMore(true);
        else SetIsLoading(true);

        if (firstLoad) { }
        try {
            const key = buildCacheKey("Searchannouncements", { language, contextStartDate, contextEndDate, page, limit, SearchQuery, statesSelected });
            const response = await withCache(key, "announcements", async () => (
                await SerachallIndiaAnnouncements(language, contextStartDate, contextEndDate, page, 10, SearchQuery, statesSelected, signal) as AnnouncementsResponse
            ));
            if (!signal.aborted) {
                settotalPages(response.pagination.totalPages);
                SetAnnouncements(prev => append ? [...prev, ...response.data] : response.data);
            }
        }
        catch (error: unknown) {
            if (error instanceof Error &&
                (error.name === 'AbortError' || (error as { code?: string }).code === 'ERR_CANCELED')) {
                return;
            }
        }
        finally {
            if (!signal.aborted) {
                SetIsLoading(false);
                SetIsLoadingMore(false);
            }
        }
    }

    useEffect(() => {
        const controller = new AbortController();

        Setpage(1);
        SearchInit(1, false, controller.signal);

        return () => controller.abort();
    }, [trigger, language]);


    useEffect(() => {
        if (page > 1) {
            const controller = new AbortController();
            SearchInit(page, true, controller.signal);
            return () => controller.abort();
        }
    }, [page]);

    const handleClick = () => {
        setTrigger((prev) => prev + 1)
    }

    console.log(Announcements, trigger)

    return (
        <section className="w-full flex flex-col pt-20 gap-16">
            <StickyNav
                scrolled={scrolled}
                StatesSelected={statesSelected}
                setSheetOpen={setSheetOpen}
                SetStatesSelected={setStatesSelected}
                sheetOpen={sheetOpen}
                SearchQuery={SearchQuery}
                SetSearchQuery={SetSearchQuery}
                IsBackButton={true}
            />
            <motion.div
                style={{ opacity: inputOpacity, y: inputY }}
                className="px-6"
            >
                <InputBox
                    StatesSelected={statesSelected}
                    setSheetOpen={setSheetOpen}
                    SetStatesSelected={setStatesSelected}
                    sheetOpen={sheetOpen}
                    SearchQuery={SearchQuery}
                    SetSearchQuery={SetSearchQuery}
                    handleClick={handleClick}
                />
            </motion.div>

            <ShowAnnouncements
                Announcements={Announcements}
                IsLoading={IsLoading}
                IsLoadingMore={IsLoadingMore}
                LoadMoreData={OnLoadMoredata}
                page={page}
                totalpage={limit}
                IsItHomePage={false}
            />
        </section>
    )
}

export default Search