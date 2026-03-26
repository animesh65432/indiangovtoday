"use client";
import React, { useContext } from "react";
import { Announcement as AnnouncementTypes } from "@/types/index";
import { Button } from "../../ui/button";
import { LoaderCircle, Megaphone } from "lucide-react";
import { LanguageContext } from "@/context/Lan";
import { TranslateText } from "@/lib/translatetext";
import AnnouncementCard from "./Announcement";
import AnnouncementSkeleton from "./AnnouncementSkeleton";

type Props = {
    Announcements: AnnouncementTypes[];
    LoadMoreData: () => void;
    page: number;
    totalpage: number;
    IsLoading: boolean;
    IsLoadingMore: boolean;
    handleMobileReset: () => void;
};


export default function ShowAnnouncements({
    Announcements,
    LoadMoreData,
    page,
    totalpage,
    IsLoading,
    IsLoadingMore,
    handleMobileReset,
}: Props) {
    const { language } = useContext(LanguageContext);

    return (
        <div className="  mt-8 md:mt-0 w-[95%] md:w-[80%] mx-auto grid grid-cols-1 gap-x-8 gap-y-12">
            {Announcements.map((announcement, index) => {
                return (
                    <AnnouncementCard
                        Announcement={announcement}
                        key={announcement.announcementId}
                    />
                )
            })}
        </div>

    );
}