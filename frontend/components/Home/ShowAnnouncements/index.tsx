import React from "react";
import { Announcement as AnnouncementTypes } from "@/types/index";
import AnnouncementCard from "./Announcement";
import AnnouncementSkeleton from "./AnnouncementSkeleton";

type Props = {
    Announcements: AnnouncementTypes[];
    LoadMoreData: () => void;
    page: number;
    totalpage: number;
    IsLoading: boolean;
    IsLoadingMore: boolean;
    IsItHomePage?: boolean;
};


export default function ShowAnnouncements({
    Announcements,
    LoadMoreData,
    page,
    totalpage,
    IsLoading,
    IsLoadingMore,
    IsItHomePage = true
}: Props) {
    const sentinelRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && page < totalpage && !IsLoadingMore) {
                    LoadMoreData();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [page, totalpage, IsLoadingMore, LoadMoreData]);

    if (IsLoading) {
        return (
            <div className="mt-8 md:mt-0 rounded-lg bg-white w-full mx-auto grid grid-cols-1 gap-x-8 gap-y-12">
                {[...Array(10)].map((_, index) => (
                    <AnnouncementSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className="mt-8 overflow-y-auto scrollbar-hide rounded-lg  md:mt-0 bg-white w-full mx-auto grid grid-cols-1 gap-x-8 gap-y-12">
            {
                <div>
                    {Announcements.map((a) => (
                        <AnnouncementCard key={a.announcementId} Announcement={a} />
                    ))}
                </div>
            }
            {IsLoadingMore && (
                [...Array(5)].map((_, index) => (
                    <AnnouncementSkeleton key={`more-${index}`} />
                ))
            )}
            {page < totalpage && (
                <div ref={sentinelRef} className="h-1 col-span-1" />
            )}
        </div>

    );
}