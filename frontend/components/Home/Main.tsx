import React, { useEffect, useState, useContext, useCallback } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { AnnouncementsTypes } from "@/types";
import Announcement from './Announcement';
import AnnouncementSkeleton from './AnnouncementSkeleton';
import { UseLanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import { FilterAnnouncementsContext } from "@/context/FilterAnnoucements"
import { AnnouncementsContext } from "@/context/AnnouncementsProvider"
import { PageNationContext } from "@/context/PageNationProvider"
import Image from 'next/image';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { TranslateText } from "@/lib/translatetext"
import { useWindowDimensions } from "@/hooks/useWindowDimensions"
import { DateRangePicker } from "@/components/ui/DateRangePicker"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { OnChangeDateRangePicker } from "@/lib/OnChangeDateRangePicker"
import { optionsforLanguages } from '@/lib/lan';

const Main: React.FC = () => {
    const { FilterAnnouncements, SetFilterAnnouncements } = useContext(FilterAnnouncementsContext)
    const { Announcements, OntoggleAnnouncements, } = useContext(AnnouncementsContext)
    const { SetPageIndexs, StartPage, EndPage, itemsPerPage } = useContext(PageNationContext)
    const [IsLoading, SetIsLoading] = useState<boolean>(true);
    const [TotalAnnouncements, SetTotalAnnouncements] = useState<number>(0)
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [IsSearchActive, SetIsSearchActive] = useState<boolean>(false)
    const LanguageContext = UseLanguageContext();
    const { startdate, endDate } = useContext(Currentdate);


    const displayTotal = IsSearchActive ? FilterAnnouncements.length : TotalAnnouncements;
    const totalPages = Math.ceil(displayTotal / itemsPerPage);
    const currentPage = Math.floor(StartPage / itemsPerPage);

    if (!LanguageContext) return null;

    const { language, onSelectLanguage } = LanguageContext;

    const fetchAnnouncements = async () => {
        SetIsLoading(true);
        try {
            const response = await getAllAnnouncements(language, startdate, endDate, StartPage, EndPage) as {
                data: AnnouncementsTypes[],
                pagination: {
                    total: number,
                    startPage: number,
                    endPage: number,
                    hasMore: boolean
                }
            };

            SetFilterAnnouncements(response.data)
            OntoggleAnnouncements(response.data)
            SetTotalAnnouncements(response.pagination.total)
            SetIsSearchActive(false)
        } catch (error) {
            console.error("Error fetching announcements:", error);
        } finally {
            SetIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAnnouncements();
    }, [language, startdate, endDate, StartPage, EndPage]);

    const OnSearchAnnouncement = () => {
        SetPageIndexs({ StartPage: 0, EndPage: itemsPerPage });

        if (SearchInput.length === 0 || SearchInput.toLowerCase() === "all") {
            SetFilterAnnouncements(Announcements)
            SetIsSearchActive(false)
            return
        }

        const Filter = Announcements.filter((announcement) =>
            announcement.title.toLowerCase().includes(SearchInput.toLowerCase()) ||
            announcement.type.toLowerCase().includes(SearchInput.toLowerCase())
        );

        SetFilterAnnouncements(Filter)
        SetIsSearchActive(true)
    };

    const handleNextPage = () => {
        if (EndPage < TotalAnnouncements) {
            SetPageIndexs((prev) => ({
                StartPage: prev.StartPage + itemsPerPage,
                EndPage: prev.EndPage + itemsPerPage
            }));
        }
    };

    const handlePrevPage = () => {
        if (StartPage > 0) {
            SetPageIndexs((prev) => ({
                StartPage: Math.max(0, prev.StartPage - itemsPerPage),
                EndPage: prev.EndPage - itemsPerPage
            }));
        }
    };

    const isNextDisabled = EndPage >= TotalAnnouncements || IsSearchActive;
    const isPrevDisabled = StartPage === 0;


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
                    onKeyDown={(e) => e.key === 'Enter' && OnSearchAnnouncement()}
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
                    onClick={OnSearchAnnouncement}
                    className='bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'
                >
                    {TranslateText[language].SEARCH}
                </Button>
            </div>

            <div className="bg-[#C8C8C833] w-[83vw] flex flex-col gap-4 sm:w-[95vw] md:w-[85vw] [@media(min-width:900px)]:w-[70%] lg:w-[75%] xl:w-[70%] [@media(min-width:1600px)]:w-[65%]   mx-auto rounded-md p-2 sm:p-6 xl:p-3">
                <div className='w-full flex items-center gap-4 justify-end'>
                    <ChevronLeft
                        className={`text-[#E0614B] cursor-pointer ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={!isPrevDisabled ? handlePrevPage : undefined}
                    />
                    <span className="text-sm text-[#2B2B2B]">
                        {TranslateText[language].PAGE} {currentPage + 1} {TranslateText[language].OF} {totalPages || 1}
                        {IsSearchActive && ' (filtered)'}
                    </span>
                    <ChevronRight
                        className={`text-[#E0614B] cursor-pointer ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={!isNextDisabled ? handleNextPage : undefined}
                    />
                </div>

                <div className="flex flex-col gap-2 ">
                    {IsLoading ? (
                        <div className="flex flex-col gap-4">
                            {[...Array(itemsPerPage)].map((_, index) => (
                                <AnnouncementSkeleton key={index} />
                            ))}
                        </div>
                    ) : FilterAnnouncements.length > 0 ? (
                        FilterAnnouncements.map((announcement) => (
                            <Announcement Announcement={announcement} key={announcement._id} />
                        ))
                    ) : (
                        <div className='mx-auto flex justify-center items-center gap-2 h-full w-full'>
                            <div className='flex items-center gap-2'>
                                <Inbox className="w-10 h-10 mb-2 text-[#E0614B]" />
                                <p className="text-[1rem] sm:text-lg text-[#2B2B2B]">
                                    {TranslateText[language].No_announcements_found}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Main;