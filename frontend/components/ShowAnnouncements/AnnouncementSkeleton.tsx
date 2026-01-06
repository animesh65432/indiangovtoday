import React from "react";
import { Skeleton } from "../ui/skeleton";


const AnnouncementSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col space-y-3 w-[65%] mx-auto">
            <Skeleton className="h-[20vh] w-full rounded-xl mx-auto" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[200px] sm:w-[250px] mr-auto" />
                <Skeleton className="h-4 w-[150px] sm:w-[200px] mr-auto" />
            </div>
        </div>
    );
};

export default AnnouncementSkeleton;
