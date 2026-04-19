import React, { useContext } from "react"
import { Skeleton } from "../ui/skeleton"
import { ThemeContext } from "@/context/Theme"

const AnnouncementSkeleton: React.FC = () => {
    const { theme } = useContext(ThemeContext)
    const isDark = theme === "dark"

    const skeletonClass = isDark ? "bg-white/10" : "bg-slate-200"

    return (
        <main className={`w-[85%] mx-auto flex flex-col gap-6  p-8`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className={`h-6 w-2/3 rounded-md ${skeletonClass}`} />
                    <Skeleton className={`h-6 w-1/2 rounded-md ${skeletonClass}`} />
                </div>
                <Skeleton className={`h-7 w-7 rounded-full ${skeletonClass} flex-shrink-0`} />
            </div>

            <div className="flex items-center gap-3">
                <Skeleton className={`h-[20px] w-[80px] rounded-[4px] ${skeletonClass}`} />
                <Skeleton className={`h-[12px] w-[90px] rounded ${skeletonClass}`} />
            </div>

            <div className="space-y-2">
                <Skeleton className={`h-4 w-full rounded-md ${skeletonClass}`} />
                <Skeleton className={`h-4 w-5/6 rounded-md ${skeletonClass}`} />
                <Skeleton className={`h-4 w-3/4 rounded-md ${skeletonClass}`} />
            </div>

            <div className="space-y-2">
                <Skeleton className={`h-4 w-full rounded-md ${skeletonClass}`} />
                <Skeleton className={`h-4 w-5/6 rounded-md ${skeletonClass}`} />
                <Skeleton className={`h-4 w-3/4 rounded-md ${skeletonClass}`} />
            </div>

            <div className={`pt-2 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
                <Skeleton className={`h-3 w-1/4 rounded-md ${skeletonClass}`} />
            </div>
        </main>
    )
}

export default AnnouncementSkeleton