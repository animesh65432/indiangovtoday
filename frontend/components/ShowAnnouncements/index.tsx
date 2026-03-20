"use client";
import React, { useContext } from "react";
import { Announcement as AnnouncementTypes } from "@/types/index";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { LanguageContext } from "@/context/Lan";
import { TranslateText } from "@/lib/translatetext";
import BentoSkeleton from "../Home/BentoSkeleton";
import BentoTile from "../Home/BentoTile";

type Props = {
    Announcements: AnnouncementTypes[];
    LoadMoreData: () => void;
    page: number;
    totalpage: number;
    IsLoading: boolean;
    IsLoadingMore: boolean;
};

/*
  Mobile  → 2-col grid, big/wide tiles span both cols
  Desktop → 4-col grid, auto-rows minmax so rows expand with content
*/
const GRID = "grid grid-cols-2 md:grid-cols-4 md:auto-rows-[minmax(160px,auto)] gap-3 w-[90%] mx-auto";

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
            <div className={`${GRID} py-4 md:py-6`}>
                {Array.from({ length: 7 }).map((_, i) => (
                    <BentoSkeleton key={i} idx={i} />
                ))}
            </div>
        );
    }

    if (Announcements.length === 0) {
        return (
            <div className="p-8 h-full flex flex-col justify-center items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 20 20" fill="none">
                        <path d="M9 13h2m0 0h2m-2 0v2m0-2V11M4 5h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
                <h3 className="text-slate-600 font-satoshi text-base font-semibold ">
                    {TranslateText[language].NO_ANNOUNCEMENTS_FOUND}
                </h3>
                <p className="text-slate-400 font-satoshi text-sm text-center">Try changing your filters or date range</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-x-auto">
            <div className={GRID}>
                {Announcements.map((ann, i) => (
                    <BentoTile key={ann.announcementId} ann={ann} idx={i} />
                ))}
            </div>

            {page < totalpage && (
                <div className="w-full flex justify-center mt-6 mb-10">
                    <Button
                        className="w-fit  text-multiselect  p-6 hover:cursor-pointer  bg-white/50 font-satoshi  border border-[#a8c0e0]/40 font-semibold rounded-none"
                        disabled={IsLoadingMore}
                        onClick={LoadMoreData}
                        aria-label={IsLoadingMore ? "Loading more announcements" : "Load more announcements"}
                    >
                        {IsLoadingMore
                            ? <LoaderCircle className="h-5 w-5 animate-spin text-[#2D4870]" />
                            : TranslateText[language].LOAD_MORE
                        }
                    </Button>
                </div>
            )}
        </div>
    );
}