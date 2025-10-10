import React, { useEffect, useState, useContext } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { AnnouncementsTypes } from "@/types";
import Announcement from './Announcement';
import AnnouncementSkeleton from './AnnouncementSkeleton';
import { UseLanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import { AnnouncementsContext } from "@/context/AnnouncementsProvider"
import Image from 'next/image';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Inbox } from 'lucide-react';

const Main: React.FC = () => {
    const { Announcements, OntoggleAnnouncements } = useContext(AnnouncementsContext)
    const [IsLoading, SetIsLoading] = useState<boolean>(true);

    const LanguageContext = UseLanguageContext();
    const { date } = useContext(Currentdate);

    if (!LanguageContext) return null;

    const { language } = LanguageContext;

    const fetchAnnouncements = async () => {
        SetIsLoading(true);
        try {
            const data = await getAllAnnouncements(language, date) as AnnouncementsTypes[];
            OntoggleAnnouncements(data);
        } catch (error) {
            console.error(error);
        } finally {
            SetIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, [language, date]);


    return (
        <div className='pt-22 sm:pt-30 xl:pt-37 [@media(min-width:1600px)]:pt-40  [@media(min-width:1700px)]:pt-46 [@media(min-width:1900px)]:pt-48 [@media(min-width:2000px)]:pt-52  [@media(min-width:2100px)]:pt-60 [@media(min-width:2300px)]:pt-72 [@media(min-width:2600px)]:pt-80  [@media(min-width:2800px)]:pt-88 [@media(min-width:3000px)]:pt-96 flex flex-col gap-5'>
            <div className="flex items-start sm:items-center justify-center gap-1 sm:gap-3">
                <div className="relative w-[30px] h-[16px] sm:h-[20px] lg:h-[25px] pt-8 sm:pt-0">
                    <Image alt="logo" fill src="/indiaIcon.svg" />
                </div>
                <h1 className="text-center text-[#E0614B] text-[1.2rem] sm:text-[1.3rem] lg:text-[1.6rem]
                 whitespace-normal break-normal max-w-[70vw] sm:max-w-none">
                    ALL GOVERNMENT ANNOUNCEMENTS, IN ONE PLACE
                </h1>
            </div>

            <div className='bg-[#F9F9F9] border flex flex-col justify-center sm:justify-start sm:flex-row gap-2 items-center border-[#EDEDED] w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-[528px] mx-auto h-[15vh] sm:h-[10vh] rounded-md'>
                <Input className='w-[90%] sm:w-[70%] lg:w-[346px] bg-[#FFFFFF] rounded-xl ml-4 ' placeholder='Search by...' />
                <Button className='bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'>Search</Button>
            </div>
            <div className="bg-[#C8C8C833] w-[83vw] sm:w-[69vw] md:w-[60vw] xl:w-[50%] h-[43vh] xl:h-[38vh] mx-auto rounded-md p-2 sm:p-6">
                <div className="flex flex-col gap-3 p-1 h-[38vh] xl:h-[32vh] overflow-y-auto custom-scroll">

                    {IsLoading ? (
                        <div className="flex flex-col gap-4">
                            {[...Array(3)].map((_, index) => (
                                <AnnouncementSkeleton key={index} />
                            ))}
                        </div>
                    ) : Announcements.length > 0 ? (
                        Announcements.map((announcement) => (
                            <Announcement Announcement={announcement} key={announcement._id} />
                        ))
                    ) : (
                        <div className='mx-auto flex justify-center items-center gap-2 h-full w-full'>
                            <div className='flex items-center gap-2'>
                                <Inbox className="w-10 h-10 mb-2 text-[#E0614B]" />
                                <p className="text-[1rem] sm:text-lg text-[#2B2B2B]">
                                    No announcements found for today
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
