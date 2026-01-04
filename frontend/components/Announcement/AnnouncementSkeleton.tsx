import React from "react"
import { Skeleton } from "../ui/skeleton"

const AnnouncementSkeleton: React.FC = () => {
    return (
        <div className="w-[85%] mx-auto flex flex-col gap-6 mt-10 p-8  ">

            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-2/3 rounded-md bg-white" />
                <Skeleton className="h-6 w-6 rounded-full bg-white" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md bg-white" />
                <Skeleton className="h-4 w-5/6 rounded-md bg-white" />
                <Skeleton className="h-4 w-3/4 rounded-md bg-white" />
            </div>


            <div>
                <Skeleton className="h-3 w-1/4 rounded-md bg-white" />
            </div>
        </div>
    )
}

export default AnnouncementSkeleton
