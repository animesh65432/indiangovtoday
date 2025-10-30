import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { GroupedAnnouncements, GroupAnnouncementsresponse } from "@/types";
import { UseLanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import Image from 'next/image';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TranslateText } from "@/lib/translatetext"
import { DateRangePicker } from "@/components/ui/DateRangePicker"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { optionsforLanguages } from '@/lib/lan';
import GroupofAnnouncement from './GroupofAnnouncement';
import { useRouter } from "next/router"
import { useWindowDimensions } from '@/hooks/useWindowDimensions';


const Main: React.FC = () => {
    const latestrequest = useRef<symbol | null>(null);
    const [GroupAnnouncements, SetGroupAnnouncements] = useState<GroupedAnnouncements[]>([])
    const [IsLoading, SetIsLoading] = useState<boolean>(true);
    const [SearchInput, SetSearchInput] = useState<string>("")
    const LanguageContext = UseLanguageContext();
    const [page, setPage] = useState<number>(1);
    const [limit, setlimit] = useState<number>(2);
    const [pageSize, setPageSize] = useState<number>(0)
    const { startdate, endDate, onChangeDate } = useContext(Currentdate);
    const router = useRouter()
    const { width } = useWindowDimensions()

    if (!LanguageContext) return null;

    const { language, onSelectLanguage } = LanguageContext;

    const fetchAnnouncements = useCallback(() => {
        let isLatest = true;
        const requestId = Symbol();
        latestrequest.current = requestId;

        const fetchData = async () => {
            SetIsLoading(true);
            try {
                const GroupAnnouncementsresponse = await getAllAnnouncements(language, startdate, endDate, page, limit) as GroupAnnouncementsresponse;

                if (latestrequest.current === requestId) {
                    SetGroupAnnouncements(GroupAnnouncementsresponse.data)
                    SetSearchInput("");
                    setPageSize(GroupAnnouncementsresponse.pagination.totalPages)
                }

            } catch (error) {
                console.error("Error fetching announcements:", error);
            } finally {
                if (latestrequest.current === requestId) {
                    SetIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isLatest = false;
        };
    }, [language, startdate, endDate, page, limit]);


    useEffect(() => {
        fetchAnnouncements();
    }, [language, startdate, endDate, page, limit]);

    const goToNextPage = () => {
        if (page < pageSize) {
            setPage(page + 1);
        }
    };

    const goToPrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    useEffect(() => {
        if (width <= 768) {
            setlimit(5)
        }
        else {
            setlimit(2)
        }
    }, [width])


    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);

            SetSearchInput("");
        }
    };

    return (
        <div className='pt-35 sm:pt-15 md:pt-18  [@media(min-width:900px)]:pt-16  lg:pt-14 xl:pt-7 [@media(min-width:1600px)]:pt-14 [@media(min-width:1700px)]:pt-16 [@media(min-width:1900px)]:pt-22 [@media(min-width:2000px)]:pt-22 [@media(min-width:2100px)]:pt-26 [@media(min-width:2300px)]:pt-32 [@media(min-width:2600px)]:pt-38 [@media(min-width:2800px)]:pt-44 [@media(min-width:3000px)]:pt-48 flex flex-col gap-5'>
            <div className=' block sm:hidden relative h-[47px] w-[150px] mx-auto'>
                <Image src="/Logo.png" alt='logo' fill />
            </div>
            <div className="flex items-start sm:items-center justify-center gap-1 sm:gap-3">
                <div className="  relative w-[30px] h-[16px] sm:h-[20px] lg:h-[25px] pt-8 sm:pt-0">
                    <Image alt="logo" fill src="/indiaIcon.svg" />
                </div>
                <h1 className="text-center text-[#E0614B] text-[1.2rem] sm:text-[1.3rem] lg:text-[1.6rem] whitespace-normal break-normal max-w-[70vw] sm:max-w-none">
                    {TranslateText[language].ALL_GOVERNMENT_ANNOUNCEMENTS_IN_ONE_PLACE}
                </h1>
            </div>

            <div className='bg-[#F9F9F9] border flex flex-col justify-center sm:justify-start sm:flex-row gap-5 sm:gap-2 items-center border-[#EDEDED] w-[85vw]  sm:w-[70vw] md:w-[50vw] lg:w-[528px] mx-auto  sm:h-[10vh] p-4 sm:p-0 rounded-md'>
                <Input
                    value={SearchInput}
                    onChange={(e) => SetSearchInput(e.target.value)}
                    className="w-[90%] sm:w-[70%] lg:w-[346px] bg-[#FFFFFF] rounded-xl ml-4 text-[#2B2B2B]"
                    placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                />
                <div className='flex flex-col [@media(min-width:450px)]:flex-row gap-4 sm:hidden items-center'>
                    <DateRangePicker
                        onUpdate={OnChangeDateRangePicker}
                        initialDateFrom={startdate}
                        initialDateTo={endDate}
                        align="start"
                        locale="en-GB"
                        showCompare={false}
                    />

                    <Select
                        onValueChange={(value) => {
                            onSelectLanguage(value);
                        }}
                        value={language}
                    >
                        <SelectTrigger className="mx-auto [@media(min-width:450px)]:mx-0  border border-[#E0614B] self-end  bg-[#FFFFFF] rounded-lg   font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
                            <SelectValue className="" />
                        </SelectTrigger>
                        <SelectContent className="text-[#E0614B]">
                            {optionsforLanguages.map((lan) => (
                                <SelectItem
                                    key={lan.label}
                                    value={lan.label}
                                    className="font-medium hover:text-[#E0614B] "
                                >
                                    {lan.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    onClick={() => router.push(`/announcements?SearchInput=${SearchInput}`)}
                    className='bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'
                >
                    {TranslateText[language].SEARCH}
                </Button>
            </div>
            <div className='min-w-[250px]  border rounded-lg h-[30vh] p-6 hidden lg:hidden flex-col justify-between '>
                <div className='text-lg font-semibold flex flex-col'>
                    <span className='text-gray-600'>{TranslateText[language].DISCOVER_MORE}</span>
                    <span className='text-[#E0614B]'>{TranslateText[language].INDIAN_ANNOUNCEMENTS}</span>
                </div>
                <Button onClick={() => router.push("/announcements")} className='bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'>
                    {TranslateText[language].SEE_MORE}
                </Button>
            </div>

            <div className='w-[65vw] mx-auto  border rounded-lg h-[30vh] p-6  lg:hidden flex flex-col justify-between '>
                <div className='text-lg font-semibold flex flex-col'>
                    <span className='text-gray-600'>{TranslateText[language].DISCOVER_MORE}</span>
                    <span className='text-[#E0614B]'>{TranslateText[language].INDIAN_ANNOUNCEMENTS}</span>
                </div>
                <Button onClick={() => router.push("/announcements")} className='bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'>
                    {TranslateText[language].SEE_MORE}
                </Button>
            </div>

            <GroupofAnnouncement
                announcements={GroupAnnouncements}
                onNextPage={goToNextPage}
                onPrevPage={goToPrevPage}
                currentPage={page}
                totalPages={pageSize}
                IsLoading={IsLoading}
            />

        </div>
    );
};

export default Main;