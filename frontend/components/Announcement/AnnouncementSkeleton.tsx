import React from "react"
import { Skeleton } from "../ui/skeleton"

const AnnouncementSkeleton: React.FC = () => {
    return (
        <main className="w-[85%] mx-auto flex flex-col gap-6 mt-10 p-8  ">

            <ul className="flex items-center justify-between">
                <Skeleton className="h-6 w-2/3 rounded-md bg-slate-400" />
                <Skeleton className="h-6 w-6 rounded-full bg-slate-400" />
            </ul>

            <ul className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md bg-slate-300" />
                <Skeleton className="h-4 w-5/6 rounded-md bg-slate-300" />
                <Skeleton className="h-4 w-3/4 rounded-md bg-slate-300" />
            </ul>
            <ul className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md bg-slate-200" />
                <Skeleton className="h-4 w-5/6 rounded-md bg-slate-200" />
                <Skeleton className="h-4 w-3/4 rounded-md bg-slate-200" />
            </ul>
            <ul className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md bg-slate-200" />
                <Skeleton className="h-4 w-5/6 rounded-md bg-slate-200" />
                <Skeleton className="h-4 w-3/4 rounded-md bg-slate-200" />
            </ul>


            <div>
                <Skeleton className="h-3 w-1/4 rounded-md bg-slate-100" />
            </div>
        </main>
    )
}

export default AnnouncementSkeleton
