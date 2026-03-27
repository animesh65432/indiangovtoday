import React from "react";
import { Skeleton } from "../../ui/skeleton";

const AnnouncementCardSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            {/* Card body */}
            <div className="flex gap-2 w-full lg:w-[80%]">
                {/* Left: text content */}
                <div className="flex flex-col gap-2 flex-1">
                    {/* Category badge */}
                    <Skeleton className="h-[14px] w-[90px] rounded bg-slate-200" />

                    {/* Title — 2 lines on mobile, full on desktop */}
                    <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-[22px] w-[90%] rounded bg-slate-200" />
                        <Skeleton className="h-[22px] w-[70%] rounded bg-slate-200" />
                        <Skeleton className="h-[22px] w-[50%] rounded bg-slate-200 hidden lg:block" />
                    </div>

                    {/* Description — hidden on mobile via lg:hidden / hidden lg:block pattern */}
                    <div className="hidden lg:flex flex-col gap-1.5 mt-1">
                        <Skeleton className="h-[14px] w-full rounded bg-slate-200" />
                        <Skeleton className="h-[14px] w-[93%] rounded bg-slate-200" />
                        <Skeleton className="h-[14px] w-[80%] rounded bg-slate-200" />
                        <Skeleton className="h-[14px] w-[65%] rounded bg-slate-200" />
                    </div>

                    {/* Date + state (desktop) */}
                    <Skeleton className="h-[13px] w-[160px] rounded bg-slate-200 hidden lg:block mt-1" />

                    {/* Mobile: description + image row */}
                    <div className="lg:hidden flex gap-10 items-center">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <Skeleton className="h-[13px] w-full rounded bg-slate-200" />
                            <Skeleton className="h-[13px] w-[88%] rounded bg-slate-200" />
                            <Skeleton className="h-[13px] w-[72%] rounded bg-slate-200" />
                            <Skeleton className="h-[13px] w-[55%] rounded bg-slate-200" />
                            {/* Date */}
                            <Skeleton className="h-[12px] w-[140px] rounded bg-slate-200 mt-1" />
                        </div>
                        {/* Thumbnail image — h-24 w-24 shrink-0 */}
                        <Skeleton className="h-24 w-24 shrink-0 rounded bg-slate-200" />
                    </div>
                </div>

                {/* Right: large image (desktop only) */}
                <Skeleton className="hidden lg:block relative w-[55vw] h-[30vh] xl:w-[35vw] xl:h-[25vh] rounded bg-slate-200" />
            </div>

            {/* Divider */}
            <div className="border border-gray-200/20 w-full lg:w-[80%]" />
        </div>
    );
};

export default AnnouncementCardSkeleton;