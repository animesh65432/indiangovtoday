import React from "react"
import { Skeleton } from "../ui/skeleton"

const AnnouncementSkeleton: React.FC = () => {
    return (
        <div className="w-[85%] mx-auto flex flex-col gap-6 pt-10 bg-white rounded-md ">

            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-2/3 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>


            <div>
                <Skeleton className="h-3 w-1/4 rounded-md" />
            </div>
        </div>
    )
}

export default AnnouncementSkeleton
