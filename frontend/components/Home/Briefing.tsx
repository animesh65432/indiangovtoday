import React, { useMemo } from 'react'
import { Brief_Announcement } from "@/types/index";
import { Mail, Sparkles } from "lucide-react"
import { categoryStyles } from "@/lib/categoryStyles";
import { timeAgo } from "@/lib/timeAgo";

type Props = {
    BriefAnnouncements: Brief_Announcement[];
    userStateCode: string;
}

const Briefing: React.FC<Props> = ({ userStateCode, BriefAnnouncements = [] }) => {
    const userAnnouncement = BriefAnnouncements.find(a => a.state === userStateCode)

    const latestDate = useMemo(() => {
        const dates = BriefAnnouncements
            .filter(a => a.latest?.date)
            .map(a => new Date(a.latest!.date).getTime())
        if (!dates.length) return null
        return new Date(Math.max(...dates)).toISOString()
    }, [BriefAnnouncements])

    const StatesCount = BriefAnnouncements.filter(a => a.state !== userStateCode).length

    const userStateData = BriefAnnouncements.find(
        a => a.state === userStateCode
    );

    const indiaData = BriefAnnouncements.find(
        a => a.state !== userStateCode
    );

    console.log(indiaData, BriefAnnouncements)

    return <div className='px-4 pt-3 pb-2 font-satoshi border-b border-slate-100 bg-white'>

        <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-1.5'>
                <span className='text-[0.82rem] font-bold flex items-center gap-1 tracking-tight text-black'>
                    <Sparkles size={14} className='inline' />
                    Briefing
                </span>
                <span className='text-slate-300 text-[0.75rem]'>·</span>
                <span className='text-[0.75rem] text-slate-500 font-medium'>
                    {userStateCode || "India"}
                </span>
            </div>

            <span className='text-[0.68rem] text-slate-400 font-medium'>
                {StatesCount} states
            </span>
        </div>

        <div className='flex items-center justify-between mt-3 pt-2 border-t border-slate-100'>
            <span className='text-[0.65rem] text-slate-400'>
                {latestDate ? `Updated ${timeAgo(latestDate)}` : 'No recent updates'}
            </span>

            <button className='flex items-center gap-1 text-slate-500 hover:text-black transition-colors'>
                <Mail size={11} />
                <span className='text-[0.65rem] font-medium'>Get alerts</span>
            </button>
        </div>

    </div>
}

export default Briefing