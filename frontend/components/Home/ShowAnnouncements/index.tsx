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

/**
 * Bento grid span pattern (cycles every 7 cards):
 *   0 → col-span-2 row-span-2  (featured)
 *   1 → col-span-1 row-span-1
 *   2 → col-span-1 row-span-2  (tall)
 *   3 → col-span-1 row-span-1
 *   4 → col-span-2 row-span-1  (wide)
 *   5 → col-span-1 row-span-1
 *   6 → col-span-1 row-span-1
 */
const BENTO_PATTERN: { col: string; row: string }[] = [
    { col: "lg:col-span-2", row: "lg:row-span-2" },
    { col: "lg:col-span-1", row: "lg:row-span-1" },
    { col: "lg:col-span-1", row: "lg:row-span-2" },
    { col: "lg:col-span-1", row: "lg:row-span-1" },
    { col: "lg:col-span-2", row: "lg:row-span-1" },
    { col: "lg:col-span-1", row: "lg:row-span-1" },
    { col: "lg:col-span-1", row: "lg:row-span-1" },
];

function getBentoSpan(index: number) {
    return BENTO_PATTERN[index % BENTO_PATTERN.length];
}

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

    /* ── Loading skeleton ─────────────────────────────────────── */
    if (IsLoading) {
        return (
            <div className="w-[90%] mx-auto px-4">
                <div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-[180px]"
                    aria-busy="true"
                    aria-label="Loading announcements"
                >
                    {Array.from({ length: 7 }).map((_, i) => {
                        const { col, row } = getBentoSpan(i);
                        return (
                            <div
                                key={i}
                                className={`${col} ${row} rounded-xl overflow-hidden`}
                            >
                                <AnnouncementSkeleton />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    /* ── Empty state ──────────────────────────────────────────── */
    if (Announcements.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 py-24 px-8">
                {/* Decorative icon cell */}
                <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-[#1A1A1A] border border-[#FF9933]/30 shadow-[0_0_40px_#FF993320]">
                    <Megaphone className="w-10 h-10 text-[#FF9933]/60" strokeWidth={1.5} />
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#FF9933] animate-ping" />
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#FF9933]" />
                </div>

                <div className="text-center space-y-1">
                    <h3 className="text-white font-satoshi text-base font-semibold tracking-tight">
                        {TranslateText[language].NO_ANNOUNCEMENTS_FOUND}
                    </h3>
                    <p className="text-white/40 text-sm font-satoshi">
                        Try adjusting your filters to see more results.
                    </p>
                </div>

                <Button
                    onClick={handleMobileReset}
                    className="h-fit px-5 py-2.5 bg-[#1A1A1A] text-[#FF9933] border border-[#FF9933] hover:bg-[#FF9933]/10 text-[13px] font-satoshi font-semibold rounded-xl transition-colors duration-200 hover:cursor-pointer"
                >
                    {TranslateText[language].RESET}
                </Button>
            </div>
        );
    }

    /* ── Bento grid ───────────────────────────────────────────── */
    return (
        <div className="w-[80%] mx-auto ">
            {/* Grid — each row unit is 180 px on lg+, auto on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:auto-rows-[180px]">
                {Announcements.map((announcement, index) => {
                    const { col, row } = getBentoSpan(index);
                    const isFeatured = index % BENTO_PATTERN.length === 0;

                    return (
                        <div
                            key={announcement.announcementId}
                            className={[
                                /* bento spans (desktop only) */
                                col,
                                row,
                                /* shared cell styles */
                                "group relative overflow-hidden rounded-2xl",
                                "border border-white/[0.07] bg-[#111111]",
                                "transition-all duration-300",
                                "hover:border-[#FF9933]/40 hover:shadow-[0_0_28px_#FF993318]",
                                /* subtle inner glow on featured */
                                isFeatured
                                    ? "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-[#FF9933]/[0.05] before:to-transparent before:pointer-events-none"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            {/* Featured badge */}
                            {isFeatured && (
                                <span className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF9933]/15 border border-[#FF9933]/30 text-[10px] text-[#FF9933] font-satoshi font-semibold uppercase tracking-widest select-none">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
                                    Featured
                                </span>
                            )}

                            {/* Card — fills full bento cell */}
                            <div className="h-full w-full">
                                <AnnouncementCard Announcement={announcement} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Load more */}
            {page < totalpage && (
                <div className="flex justify-center mt-10 mb-12">
                    <Button
                        className={[
                            "group relative overflow-hidden",
                            "px-8 py-3 h-fit w-fit",
                            "bg-transparent text-[#FF9933]",
                            "border border-[#FF9933]/60 rounded-xl",
                            "font-satoshi font-semibold text-sm",
                            "transition-all duration-300",
                            "hover:border-[#FF9933] hover:shadow-[0_0_24px_#FF993330] hover:cursor-pointer",
                            "disabled:opacity-40 disabled:cursor-not-allowed",
                        ].join(" ")}
                        disabled={IsLoadingMore}
                        onClick={LoadMoreData}
                        aria-label={
                            IsLoadingMore
                                ? "Loading more announcements"
                                : "Load more announcements"
                        }
                    >
                        {/* Hover fill effect */}
                        <span className="absolute inset-0 bg-[#FF9933]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                        <span className="relative flex items-center gap-2">
                            {IsLoadingMore ? (
                                <LoaderCircle className="h-4 w-4 animate-spin text-[#FF9933]" />
                            ) : (
                                TranslateText[language].LOAD_MORE
                            )}
                        </span>
                    </Button>
                </div>
            )}
        </div>
    );
}