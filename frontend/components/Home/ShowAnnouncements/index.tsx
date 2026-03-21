"use client";
import React, { useContext } from "react";
import { Announcement as AnnouncementTypes } from "@/types/index";
import { Button } from "../../ui/button";
import { LoaderCircle } from "lucide-react";
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
};


export default function ShowAnnouncements({
    Announcements,
    LoadMoreData,
    page,
    totalpage,
    IsLoading,
    IsLoadingMore,
}: Props) {
    const { language } = useContext(LanguageContext);

    if (IsLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 px-5 gap-5">
                {Array.from({ length: 6 }).map((_, index) => (
                    <AnnouncementSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (Announcements.length === 0 && !IsLoading) {
        return (
            <div className="p-8 h-full flex flex-col justify-center items-center gap-3">
                <h3 className="text-white font-satoshi text-base font-semibold ">
                    {TranslateText[language].NO_ANNOUNCEMENTS_FOUND}
                </h3>
                <p className="text-slate-400 font-satoshi text-sm text-center">Try changing your filters or date range</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 px-5 gap-5">
                {Announcements.map((announcement) => (
                    <div key={announcement.announcementId} className="h-full">
                        <AnnouncementCard Announcement={announcement} />
                    </div>
                ))}
            </div>
            {page < totalpage && (
                <div className="w-full flex justify-center mt-6 mb-10">
                    <Button
                        className="w-fit  text-[#FF9933]  p-6 hover:cursor-pointer hover:bg-[#FF9933]/10 font-satoshi  border border-[#FF9933] font-semibold rounded-none"
                        disabled={IsLoadingMore}
                        onClick={LoadMoreData}
                        aria-label={IsLoadingMore ? "Loading more announcements" : "Load more announcements"}
                    >
                        {IsLoadingMore
                            ? <LoaderCircle className="h-5 w-5 animate-spin text-[#FF9933]" />
                            : TranslateText[language].LOAD_MORE
                        }
                    </Button>
                </div>
            )}
        </div>
    );
}