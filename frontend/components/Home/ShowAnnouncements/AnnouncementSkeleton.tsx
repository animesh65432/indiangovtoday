import React from "react";
import { Skeleton } from "../../ui/skeleton";

const AnnouncementSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col gap-[6px] w-full rounded-lg overflow-hidden
                        bg-[#1A1A1A] border border-white/[0.07] p-[14px]">

            {/* Row 1: badge + state */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-[20px] w-[80px] rounded-[4px] bg-white/[0.06]" />
                <Skeleton className="h-[12px] w-[60px] rounded bg-white/[0.04]" />
            </div>

            {/* Row 2: department */}
            <Skeleton className="h-[10px] w-[140px] rounded bg-white/[0.04]" />

            {/* Row 3: title */}
            <Skeleton className="h-[14px] w-[85%] rounded bg-white/[0.07]" />
            <Skeleton className="h-[14px] w-[60%] rounded bg-white/[0.05]" />

            {/* Row 4: description lines */}
            <Skeleton className="h-[11px] w-full rounded bg-white/[0.04] mt-1" />
            <Skeleton className="h-[11px] w-[90%] rounded bg-white/[0.04]" />
            <Skeleton className="h-[11px] w-[75%] rounded bg-white/[0.03]" />

            {/* Footer: date + button */}
            <div className="flex items-center justify-between pt-[8px] mt-auto border-t border-white/[0.06]">
                <Skeleton className="h-[10px] w-[70px] rounded bg-white/[0.04]" />
                <Skeleton className="h-[26px] w-[90px] rounded-[4px] bg-white/[0.06]" />
            </div>
        </div>
    );
};

export default AnnouncementSkeleton;