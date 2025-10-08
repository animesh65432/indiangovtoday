import React, { useEffect, useState, useContext } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { AnnouncementsTypes } from "@/types";
import Announcement from './Announcement';
import AnnouncementSkeleton from './AnnouncementSkeleton';
import { UseLanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import { AnnouncementsContext } from "@/context/AnnouncementsProvider"
import GroupofAnnouncement from './GroupofAnnouncement';
import { Inbox } from "lucide-react";
import { fixAnnouncements } from "@/lib/fixAnnouncements"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const Main: React.FC = () => {
    const { Announcements, OntoggleAnnouncements } = useContext(AnnouncementsContext)
    const [IsLoading, SetIsLoading] = useState<boolean>(false);

    const LanguageContext = UseLanguageContext();
    const { date } = useContext(Currentdate);

    if (!LanguageContext) return null;

    const { language } = LanguageContext;

    const fetchAnnouncements = async () => {
        SetIsLoading(true);
        try {
            const data = await getAllAnnouncements(language, date) as AnnouncementsTypes[];
            const Groupdata = fixAnnouncements(data)
            OntoggleAnnouncements(Groupdata);
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
            <div>loading</div>
        );
    }

    const AnnouncementsEntries = Object.entries(Announcements);

    if (AnnouncementsEntries.length === 0) {
        return (
            <div className="flex-1 w-full h-[40vh] flex flex-col justify-center items-center text-center text-gray-500">
                <Inbox className="w-10 h-10 mb-2" />
                <p className="text-base lg:text-lg">No announcements found for today</p>
            </div>
        );
    }

    return (
        <div className='flex'>
            {
                AnnouncementsEntries.map(([type, items]) => (
                    <Card key={type}>
                        <CardHeader>{type}</CardHeader>
                        {items.map(a => <div key={a._id}>{a.title}</div>)}
                    </Card>
                ))
            }
        </div>
    );
};

export default Main;
