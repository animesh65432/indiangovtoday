import React from "react";
import { Skeleton } from "../ui/skeleton";


const AnnouncementSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col space-y-3 w-full mx-auto">
            <Skeleton className="h-[20vh] w-full rounded-xl mx-auto bg-white" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[90%] mr-auto bg-slate-50" />
                <Skeleton className="h-4 w-[90%] mr-auto bg-slate-100" />
            </div>
        </div>
    );
};

export default AnnouncementSkeleton;
