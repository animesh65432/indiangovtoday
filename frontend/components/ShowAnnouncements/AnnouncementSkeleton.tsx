import React from "react";
import { Skeleton } from "../ui/skeleton";

const AnnouncementSkeleton: React.FC = () => {
    return (
        <div className="p-4 rounded-2xl bg-white w-[65vw] mx-auto sm:mx-0 md:w-full min-h-[400px] flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
            <Skeleton className="h-10 w-1/2 rounded-md mt-4" />
        </div>
    );
};

export default AnnouncementSkeleton;
