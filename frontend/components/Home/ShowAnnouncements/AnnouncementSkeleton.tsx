import React from "react";
import { Skeleton } from "../../ui/skeleton";

const AnnouncementCardSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            {/* Card body */}
            <div className="flex gap-2 w-full p-4 ">
                {/* Left: text content */}
                <div className="flex flex-col gap-2 flex-1">
                    {/* Category badge */}
                    <Skeleton className="h-[14px] w-[90px] rounded bg-slate-200" />

                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-[22px] w-[90%] rounded bg-slate-200" />
                        <Skeleton className="h-[22px] w-[70%] rounded bg-slate-200" />
                        <Skeleton className="h-[22px] w-[50%] rounded bg-slate-200 hidden lg:block" />
                    </div>

                    {/* Description (desktop) */}
                    <div className="hidden lg:flex flex-col gap-1.5 mt-1">
                        <Skeleton className="h-[14px] w-full rounded bg-slate-200" />
                        <Skeleton className="h-[14px] w-[93%] rounded bg-slate-200" />
                        <Skeleton className="h-[14px] w-[80%] rounded bg-slate-200" />
                        <Skeleton className="h-[14px] w-[65%] rounded bg-slate-200" />
                    </div>

                    {/* Date + state (desktop) */}
                    <Skeleton className="h-[13px] w-[160px] rounded bg-slate-200 hidden lg:block mt-1" />

                    {/* Mobile: description only (image removed) */}
                    <div className="lg:hidden flex flex-col gap-1.5">
                        <Skeleton className="h-[13px] w-full rounded bg-slate-200" />
                        <Skeleton className="h-[13px] w-[88%] rounded bg-slate-200" />
                        <Skeleton className="h-[13px] w-[72%] rounded bg-slate-200" />
                        <Skeleton className="h-[13px] w-[55%] rounded bg-slate-200" />
                        {/* Date */}
                        <Skeleton className="h-[12px] w-[140px] rounded bg-slate-200 mt-1" />
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border border-gray-200/20 w-full lg:w-[80%]" />
        </div>
    );
};

export default AnnouncementCardSkeleton;