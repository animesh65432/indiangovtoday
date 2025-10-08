import React, { useEffect, useState, useContext } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { AnnouncementsTypes } from "@/types";
import Announcement from './Announcement';
import AnnouncementSkeleton from './AnnouncementSkeleton';
import { UseLanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import { Inbox } from "lucide-react";
import { fixAnnouncements } from "@/lib/fixAnnouncements"

const Main: React.FC = () => {
    const [Announcements, setAnnouncements] = useState<AnnouncementsTypes[]>([]);
    const [IsLoading, SetIsLoading] = useState<boolean>(false);

    const LanguageContext = UseLanguageContext();
    const { date } = useContext(Currentdate);

    if (!LanguageContext) return null;

    const { language } = LanguageContext;

    const fetchAnnouncements = async () => {
        SetIsLoading(true);
        try {
            const data = await getAllAnnouncements(language, date) as AnnouncementsTypes[];
            setAnnouncements(data);
        } catch (error) {
            console.error(error);
        } finally {
            SetIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, [language, date]);

    if (IsLoading) {
        return (
            <div className="flex flex-col gap-4 w-[85%] mx-auto pt-7">
                {Array.from({ length: 5 }).map((_, i) => (
                    <AnnouncementSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (Announcements.length === 0) {
        return (
            <div className="flex-1 w-full h-[40vh] flex flex-col justify-center items-center text-center text-gray-500">
                <Inbox className="w-10 h-10 mb-2" />
                <p className="text-base lg:text-lg">No announcements found for today</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[75vh] overflow-y-auto pt-8 pb-8">
            <div className="flex flex-col items-center gap-4">
                {Announcements.map((announcement) => (
                    <div className="w-full" key={announcement._id}>
                        <Announcement Announcement={announcement} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;
