import React, { useContext } from "react";
import { Announcement as AnnouncementTypes } from "@/types/index";
import { Brief_Announcement } from "@/types"
import AnnouncementSkeleton from "./AnnouncementSkeleton";
import { ThemeContext } from "@/context/Theme";
import Briefing from "../Briefing";

type Props = {
    Announcements: AnnouncementTypes[];
    LoadMoreData: () => void;
    page: number;
    totalpage: number;
    IsLoading: boolean;
    IsLoadingMore: boolean;
    BriefAnnouncements: Brief_Announcement[];
    userStateCode: string;
};

export default function ShowAnnouncements({
    Announcements,
    LoadMoreData,
    page,
    totalpage,
    IsLoading,
    IsLoadingMore,
    BriefAnnouncements,
    userStateCode,
}: Props) {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";

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

    const containerStyle = `
        mt-8 md:mt-0 rounded-lg min-h-0 overflow-y-auto overflow-x-hidden w-full mx-auto flex flex-col gap-x-8 gap-y-12
        ${isDark ? "bg-[#050505]" : "bg-white"}
    `;

    if (IsLoading) {
        return (
            <div className={containerStyle}>
                {[...Array(10)].map((_, index) => (
                    <AnnouncementSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className={containerStyle}>
            <div className="flex flex-col gap-6 min-h-0 overflow-y-auto overflow-x-hidden">
                <Briefing
                    BriefAnnouncements={BriefAnnouncements}
                    userStateCode={userStateCode}
                />
                {/* {Announcements.map((a) => (
                    <AnnouncementCard
                        key={a.announcementId}
                        Announcement={a}
                    />
                ))} */}
            </div>

            {IsLoadingMore &&
                [...Array(5)].map((_, index) => (
                    <AnnouncementSkeleton key={`more-${index}`} />
                ))}

            {page < totalpage && (
                <div ref={sentinelRef} className="h-1 col-span-1" />
            )}
        </div>
    );
}