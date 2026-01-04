import React from "react";
import { Skeleton } from "../ui/skeleton";

const AnnouncementSkeleton: React.FC = () => {
    return (
        <div className="p-4 rounded-2xl ">
            <div className="space-y-4">
                <Skeleton className="h-6 w-3/4 rounded-md bg-white" />
                <Skeleton className="h-4 w-1/2 rounded-md bg-white" />
                <Skeleton className="h-4 w-1/3 rounded-md bg-white" />
                <Skeleton className="h-4 w-2/3 rounded-md bg-white" />
            </div>
            <Skeleton className="h-10 w-1/2 rounded-md mt-4 bg-white" />
        </div>
    );
};

export default AnnouncementSkeleton;
