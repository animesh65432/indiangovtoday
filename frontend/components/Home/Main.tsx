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

const Main: React.FC = () => {
    const { FilterAnnouncements, SetFilterAnnouncements } = useContext(FilterAnnouncementsContext)
    const { Announcements, OntoggleAnnouncements } = useContext(AnnouncementsContext)
    const { SetPageIndexs, StartPage, EndPage } = useContext(PageNationContext)
    const [IsLoading, SetIsLoading] = useState<boolean>(true);
    const [TotalAnnouncements, SetTotalAnnouncements] = useState<number>(0)
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [IsSearchActive, SetIsSearchActive] = useState<boolean>(false)

    const LanguageContext = UseLanguageContext();
    const { startdate, endDate } = useContext(Currentdate);

    const itemsPerPage = 10;


    const displayTotal = IsSearchActive ? FilterAnnouncements.length : TotalAnnouncements;
    const totalPages = Math.ceil(displayTotal / itemsPerPage);
    const currentPage = Math.floor(StartPage / itemsPerPage);

    if (!LanguageContext) return null;

    const { language } = LanguageContext;

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
        <div className='pt-22 sm:pt-30 xl:pt-37 [@media(min-width:1600px)]:pt-40 [@media(min-width:1700px)]:pt-46 [@media(min-width:1900px)]:pt-48 [@media(min-width:2000px)]:pt-52 [@media(min-width:2100px)]:pt-60 [@media(min-width:2300px)]:pt-72 [@media(min-width:2600px)]:pt-80 [@media(min-width:2800px)]:pt-88 [@media(min-width:3000px)]:pt-96 flex flex-col gap-5'>
            <div className="flex items-start sm:items-center justify-center gap-1 sm:gap-3">
                <div className="relative w-[30px] h-[16px] sm:h-[20px] lg:h-[25px] pt-8 sm:pt-0">
                    <Image alt="logo" fill src="/indiaIcon.svg" />
                </div>
                <h1 className="text-center text-[#E0614B] text-[1.2rem] sm:text-[1.3rem] lg:text-[1.6rem] whitespace-normal break-normal max-w-[70vw] sm:max-w-none">
                    ALL GOVERNMENT ANNOUNCEMENTS, IN ONE PLACE
                </h1>
            </div>

            <div className='bg-[#F9F9F9] border flex flex-col justify-center sm:justify-start sm:flex-row gap-2 items-center border-[#EDEDED] w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-[528px] mx-auto h-[15vh] sm:h-[10vh] rounded-md'>
                <Input
                    value={SearchInput}
                    onChange={(e) => SetSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && OnSearchAnnouncement()}
                    className="w-[90%] sm:w-[70%] lg:w-[346px] bg-[#FFFFFF] rounded-xl ml-4 text-[#2B2B2B]"
                    placeholder="Search by title or type..."
                />

                <Button
                    onClick={OnSearchAnnouncement}
                    className='bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'
                >
                    Search
                </Button>
            </div>

            <div className="bg-[#C8C8C833] w-[83vw] flex flex-col gap-4 sm:w-[69vw] md:w-[60vw] xl:w-[50%] h-[43vh] xl:h-[35vh] mx-auto rounded-md p-2 sm:p-6 xl:p-3">
                <div className='w-full flex items-center gap-4 justify-end'>
                    <ChevronLeft
                        className={`text-[#E0614B] cursor-pointer ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={!isPrevDisabled ? handlePrevPage : undefined}
                    />
                    <span className="text-sm text-[#2B2B2B]">
                        Page {currentPage + 1} of {totalPages || 1}
                        {IsSearchActive && ' (filtered)'}
                    </span>
                    <ChevronRight
                        className={`text-[#E0614B] cursor-pointer ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={!isNextDisabled ? handleNextPage : undefined}
                    />
                </div>

                <div className="flex flex-col gap-3 p-1 h-[38vh] xl:h-[28vh] overflow-y-auto custom-scroll">
                    {IsLoading ? (
                        <div className="flex flex-col gap-4">
                            {[...Array(3)].map((_, index) => (
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
                                    No announcements found
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