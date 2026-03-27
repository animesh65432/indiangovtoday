import React from "react"
import { Skeleton } from "../ui/skeleton"

const AnnouncementSkeleton: React.FC = () => {
    return (
        <main className="w-[85%] mx-auto flex flex-col gap-6 mt-10 p-8">

            {/* Title + share icon */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-6 w-2/3 rounded-md bg-slate-300" />
                    <Skeleton className="h-6 w-1/2 rounded-md bg-slate-300" />
                </div>
                <Skeleton className="h-7 w-7 rounded-full bg-slate-300 flex-shrink-0" />
            </div>

            {/* Meta row: badge + date */}
            <div className="flex items-center gap-3">
                <Skeleton className="h-[20px] w-[80px] rounded-[4px] bg-slate-300" />
                <Skeleton className="h-[12px] w-[90px] rounded bg-slate-300" />
            </div>

            {/* Body paragraphs */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md bg-slate-300" />
                <Skeleton className="h-4 w-5/6 rounded-md bg-slate-300" />
                <Skeleton className="h-4 w-3/4 rounded-md bg-slate-300" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md bg-slate-300" />
                <Skeleton className="h-4 w-5/6 rounded-md bg-slate-300" />
                <Skeleton className="h-4 w-3/4 rounded-md bg-slate-300" />
            </div>

            {/* Footer: source/date */}
            <div className="pt-2 border-t border-slate-300">
                <Skeleton className="h-3 w-1/4 rounded-md bg-slate-300" />
            </div>

        </main>
    )
}

export default AnnouncementSkeleton