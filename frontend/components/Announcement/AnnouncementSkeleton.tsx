import React from "react"
import { Skeleton } from "../ui/skeleton"

const AnnouncementSkeleton: React.FC = () => {
    return (
        <main className="w-[85%] mx-auto flex flex-col gap-6 mt-10 p-8">

            {/* Title + share icon */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-6 w-2/3 rounded-md bg-white/[0.08]" />
                    <Skeleton className="h-6 w-1/2 rounded-md bg-white/[0.05]" />
                </div>
                <Skeleton className="h-7 w-7 rounded-full bg-white/[0.06] flex-shrink-0" />
            </div>

            {/* Meta row: badge + date */}
            <div className="flex items-center gap-3">
                <Skeleton className="h-[20px] w-[80px] rounded-[4px] bg-white/[0.07]" />
                <Skeleton className="h-[12px] w-[90px] rounded bg-white/[0.04]" />
            </div>

            {/* Body paragraphs */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md bg-white/[0.06]" />
                <Skeleton className="h-4 w-5/6 rounded-md bg-white/[0.06]" />
                <Skeleton className="h-4 w-3/4 rounded-md bg-white/[0.05]" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md bg-white/[0.05]" />
                <Skeleton className="h-4 w-5/6 rounded-md bg-white/[0.05]" />
                <Skeleton className="h-4 w-3/4 rounded-md bg-white/[0.04]" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md bg-white/[0.04]" />
                <Skeleton className="h-4 w-5/6 rounded-md bg-white/[0.04]" />
                <Skeleton className="h-4 w-3/4 rounded-md bg-white/[0.03]" />
            </div>

            {/* Footer: source/date */}
            <div className="pt-2 border-t border-white/[0.06]">
                <Skeleton className="h-3 w-1/4 rounded-md bg-white/[0.04]" />
            </div>

        </main>
    )
}

export default AnnouncementSkeleton