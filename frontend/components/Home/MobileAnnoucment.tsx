import React, { useContext } from 'react'
import { Announcement as AnnouncementTypes } from "@/types";
import Image from 'next/image';
import { categoryStyles } from "@/lib/categoryStyles"
import { formatDateInLanguage } from "@/lib/formatDate"
import { LanguageContext } from '@/context/Lan';
import { TranslateText } from '@/lib/translatetext';
import { useRouter } from "next/navigation"

type Props = {
    announcement: AnnouncementTypes
}

const MobileAnnoucment: React.FC<Props> = ({ announcement }) => {
    const { language } = useContext(LanguageContext)
    const router = useRouter()
    return (
        <div className=' mx-auto my-2 flex gap-1 bg-white border border-[#E5E2D8] rounded-md'>

            <div className='relative shrink-0 w-24 h-full overflow-hidden'>
                {announcement.image ? (
                    <Image
                        src={announcement.image}
                        alt={announcement.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className={`w-full h-full ${categoryStyles[announcement.category] || categoryStyles["Other"]}`} />
                )}
                <span
                    className={`absolute top-[80%] w-full  text-[11px] font-bold tracking-wide px-2 py-0.75 text-center rounded uppercase ${categoryStyles[announcement.category] || categoryStyles["Other"]
                        }`}
                >
                    {announcement.category}
                </span>
            </div>

            <div className='flex flex-col justify-between flex-1  p-2'>
                <div className='flex flex-col gap-y-1'>
                    <div className='flex flex-wrap items-center justify-between pb-1'>
                        <span className='text-[10px] font-poppins font-semibold text-[#B45309] bg-[#FEF3C7] border border-[#e2680a] px-2 py-[2px] '>
                            {announcement.department}
                        </span>
                        <span className='text-[11px] text-[#888] font-poppins'>{formatDateInLanguage(announcement.date, language)}</span>
                    </div>

                    {/* Title */}
                    <span className='text-[13px] font-poppins font-bold text-[#1a1a1a] leading-snug line-clamp-2'>
                        {announcement.title}
                    </span>

                    {/* Description */}
                    <span className='text-[12px] text-[#555] font-poppins leading-snug line-clamp-1'>
                        {announcement.description}
                    </span>
                </div>

                {/* Read details link */}
                <span onClick={() => router.push(`announcement?id=${announcement.announcementId}&lan=${language}`)} className='text-[12px] font-poppins font-semibold text-[#D97706] flex items-center gap-1 mt-1'>
                    {TranslateText[language].SEE_DETAILS} <span>›</span>
                </span>
            </div>
        </div>
    )
}

export default MobileAnnoucment