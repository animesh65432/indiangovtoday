import React from "react"
import { Skeleton } from "../ui/skeleton"

const AnnouncementSkeleton: React.FC = () => {
    return (
        <div className="p-3 rounded-2xl  bg-white w-full">
            <div className="space-y-3">

                <Skeleton className="h-5 w-3/4 rounded-md" />

                <Skeleton className="h-4 w-1/2 rounded-md" />

                <Skeleton className="h-3 w-1/3 rounded-md" />
            </div>
        </div>
    )
}

export default AnnouncementSkeleton
