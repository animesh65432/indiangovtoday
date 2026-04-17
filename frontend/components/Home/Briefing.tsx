import React, { useContext, useMemo } from 'react'
import { Brief_Announcement } from "@/types/index";
import { Mail, Sparkles } from "lucide-react"
import { timeAgo } from "@/lib/timeAgo";
import { ThemeContext } from '@/context/Theme';
import { TranslateText } from '@/lib/translatetext';
import { LanguageContext } from '@/context/Lan';
import { CheckIfUserStateInBriefing } from '@/lib/CheckIfUserStateInBriefing';

type Props = {
    BriefAnnouncements: Brief_Announcement[];
    StatesSelected: string[];
}

const Briefing: React.FC<Props> = ({ StatesSelected = [], BriefAnnouncements = [] }) => {
    const { theme } = useContext(ThemeContext)
    const { language } = useContext(LanguageContext)

    const isDark = theme === "dark"

    const latestDate = useMemo(() => {
        const dates = BriefAnnouncements
            .filter(a => a.latest?.date)
            .map(a => new Date(a.latest!.date).getTime())
        if (!dates.length) return null
        return new Date(Math.max(...dates)).toISOString()
    }, [BriefAnnouncements])

    const userStateCode = CheckIfUserStateInBriefing(StatesSelected, language)

    const StatesCount = BriefAnnouncements.filter(a => a.state !== userStateCode).length

    const userStateData = BriefAnnouncements.find(a => a.state === userStateCode);

    const indiaData = BriefAnnouncements.find(
        a => a.state === TranslateText[language].MULTISELECT_OPTIONS[TranslateText[language].MULTISELECT_OPTIONS.length - 1].value || ""
    );

    return (
        <div className={`px-4 rounded-md  pt-3 pb-2 font-satoshi md:border border-[#c51057] ${isDark ? "bg-[#050505]" : "bg-white"}`}>

            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-1.5'>
                    <span className={`text-[0.82rem] font-bold flex items-center gap-1 tracking-tight ${isDark ? "text-white" : "text-[#3b0a1f]"} `}>
                        <Sparkles size={14} className='inline text-[#c51057]' />
                        Briefing
                    </span>
                    <span className='text-[#a8a4a3] text-[0.75rem]'>·</span>
                    <span className='text-[0.75rem] text-[#a8a4a3] font-medium'>
                        {userStateCode}
                    </span>
                </div>

                <span className={`text-[0.7rem] ${isDark ? "text-white bg-white/10" : "text-black"} font-semibold bg-[#e4e4e4] px-2 py-0.5 rounded-full`}>
                    {StatesCount} states
                </span>
            </div>

            <div className='flex flex-col gap-3 ml-4'>
                <div className='flex flex-col gap-1'>
                    {!userStateData?.latest &&
                        <div className='text-[0.9rem] font-semibold text-[#a8a4a3]'>
                            No Announcements in your State
                        </div>
                    }
                    {userStateData?.total && userStateData.total > 0 ?
                        <div className={`text-[0.7rem] font-semibold ${isDark ? "text-white" : "text-black"} uppercase tracking-wide`}>
                            {userStateData.total} Announcements
                        </div>
                        : null}
                    {userStateData?.latest &&
                        <div className={`text-[0.9rem] underline ${isDark ? "text-white" : "text-black"} font-medium leading-snug`}>
                            {userStateData.latest?.title}
                        </div>
                    }
                </div>

                <div className='flex flex-col gap-1'>
                    {indiaData?.latest &&
                        <div className={`text-[0.7rem] font-semibold ${isDark ? "text-white" : "text-black"} uppercase tracking-wide`}>
                            {indiaData.state}
                        </div>
                    }
                    {!indiaData?.latest &&
                        <div className='text-[0.75rem] ml-4 font-semibold text-[#a8a4a3]'>
                            No Announcements in India
                        </div>
                    }
                    {indiaData?.total && indiaData.total > 0 ?
                        <div className={`text-[0.7rem] font-semibold ${isDark ? "text-white" : "text-black"} uppercase tracking-wide`}>
                            {indiaData.total} Announcements
                        </div>
                        : null}
                    {indiaData?.latest &&
                        <div className={`text-[0.8rem] underline hover:cursor-pointer ${isDark ? "text-white underline" : "text-black"} font-medium leading-snug`}>
                            {indiaData.latest?.title}
                        </div>
                    }
                </div>
            </div>

            <div className=' ml-2 md:ml-0 flex items-center justify-between mt-3 pt-2 md:border-t border-[#fad0de]'>
                <span className='text-[0.65rem] text-[#a8a4a3] font-medium'>
                    {latestDate ? `Updated ${timeAgo(latestDate)}` : 'No recent updates'}
                </span>

                <button className={`flex items-center gap-1 ${isDark ? "text-white/70" : "text-[#424241]"} hover:underline transition-colors`}>
                    <Mail size={11} />
                    <span className='text-[0.65rem] font-medium'>Get alerts</span>
                </button>
            </div>

        </div>
    )
}

export default Briefing