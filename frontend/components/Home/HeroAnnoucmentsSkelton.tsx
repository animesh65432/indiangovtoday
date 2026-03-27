import React from 'react'
import { Skeleton } from '../ui/skeleton'

const HeroAnnoucmentsSkelton = () => {
    return (
        <div className="w-[95%] md:w-[80%] mx-auto hidden md:grid grid-cols-7 mt-7 gap-10">

            {/* ── Main featured article (col-span-5) ── */}
            <article className="col-span-7 xl:col-span-5 flex gap-2">
                {/* Left: text */}
                <main className="flex-1 flex flex-col gap-2">
                    {/* Category */}
                    <Skeleton className="h-[14px] w-[90px] rounded bg-slate-300" />

                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-[22px] w-[95%] rounded bg-slate-300" />
                        <Skeleton className="h-[22px] w-[80%] rounded bg-slate-300" />
                        <Skeleton className="h-[22px] w-[60%] rounded bg-slate-300" />
                    </div>

                    <div className="flex gap-3 items-start">
                        <div className="flex flex-col gap-2 flex-1">
                            {/* Description */}
                            <Skeleton className="h-[14px] w-full rounded bg-slate-300" />
                            <Skeleton className="h-[14px] w-[93%] rounded bg-slate-300" />
                            <Skeleton className="h-[14px] w-[85%] rounded bg-slate-300" />
                            <Skeleton className="h-[14px] w-[70%] rounded bg-slate-300" />

                            {/* Date + state */}
                            <Skeleton className="h-[13px] w-[180px] rounded bg-slate-300 mt-1" />
                        </div>

                        {/* Mobile thumbnail (md:hidden) */}
                        <Skeleton className="md:hidden shrink-0 h-24 w-24 rounded bg-slate-300" />
                    </div>
                </main>

                {/* Right: large image (hidden md:block) */}
                <Skeleton className="hidden md:block w-[30%] md:w-[40%] h-50 md:h-64 rounded bg-slate-300" />
            </article>

            {/* ── Side list (col-span-2, xl only) ── */}
            <div className="col-span-2 hidden xl:flex flex-col gap-5">
                {[...Array(2)].map((_, i) => (
                    <article key={i} className="flex gap-2">
                        {/* Thumbnail */}
                        <Skeleton className="shrink-0 w-24 h-24 rounded bg-slate-300" />

                        {/* Text */}
                        <main className="flex-1 flex flex-col gap-1.5">
                            <Skeleton className="h-[13px] w-full rounded bg-white/[0.07]" />
                            <Skeleton className="h-[13px] w-[85%] rounded bg-white/[0.06]" />
                            <Skeleton className="h-[13px] w-[65%] rounded bg-white/[0.05]" />
                            {/* Date */}
                            <Skeleton className="h-[12px] w-[130px] rounded bg-white/[0.05] mt-1" />
                        </main>
                    </article>
                ))}
            </div>

        </div>
    )
}

export default HeroAnnoucmentsSkelton