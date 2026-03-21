import React from "react"
import { Announcement } from "@/types"
import { ChevronRight } from "lucide-react"
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
import { formatDateInLanguage } from "@/lib/formatDate"
import { useRouter } from "next/navigation"
import { getCat } from "@/lib/categoryStyles"
import { cn } from "@/lib/utils"

type Props = {
    Announcement: Announcement
}

const AnnouncementCard: React.FC<Props> = ({ Announcement }) => {
    const { language } = React.useContext(LanguageContext)
    const router = useRouter()
    const { SEE_DETAILS } = TranslateText[language]

    const cat = getCat(Announcement.category)

    const handleClick = () => {
        router.push(`/announcement?id=${Announcement.announcementId}&lan=${language}`)
    }

    return (
        <div
            className={cn(
                "group relative hover:-translate-y-[2px] flex flex-col overflow-hidden rounded-lg cursor-pointer",
                "bg-[#1A1A1A] border border-white/[0.07]",
                "transition-all duration-150 hover:border-[#FF9933]/40 hover:bg-[#1f1f1f]",
                "h-full"
            )}
            onClick={handleClick}
        >
            {/* Body */}
            <div className="flex flex-1 flex-col gap-[6px] md:gap-[8px] p-[14px] md:p-[18px]">

                {/* Row 1: category badge + state */}
                <div className="flex items-center justify-between gap-2">
                    <span
                        className="font-satoshi inline-flex items-center gap-[5px] rounded-[4px] px-[8px] py-[3px] text-[10px] md:text-[11px] font-bold tracking-[0.06em] uppercase whitespace-nowrap"
                        style={{
                            color: cat.dot,
                            background: `${cat.dot}15`,
                            border: `1px solid ${cat.dot}30`,
                        }}
                    >
                        <span
                            className="inline-block h-[5px] w-[5px] flex-shrink-0 rounded-full"
                            style={{ background: cat.dot }}
                        />
                        {Announcement.category || "Other"}
                    </span>

                    <span className="font-satoshi text-[10px] md:text-[11px] text-white/25 truncate max-w-[110px] md:max-w-[140px] text-right">
                        {Announcement.state}
                    </span>
                </div>

                {/* Row 2: Department */}
                <p className="font-satoshi text-[10.5px] md:text-[12px] font-medium text-white/35 truncate leading-none">
                    {Announcement.department}
                </p>

                {/* Row 3: Title — always fully shown, no clamp */}
                <p className="font-satoshi font-semibold text-white leading-[1.45] text-[13px] md:text-[15.5px]">
                    {Announcement.title}
                </p>

                {/* Row 4: Description — clamped to 4 lines so cards stay balanced */}
                {Announcement.description && (
                    <p className="font-satoshi leading-[1.55] text-white/40 text-[11.5px] md:text-[13px] line-clamp-4">
                        {Announcement.description}
                    </p>
                )}

                {/* Footer pinned to bottom */}
                <div className="mt-auto flex items-center justify-between pt-[8px] md:pt-[10px] border-t border-white/[0.06]">
                    <span className="font-satoshi text-[10px] md:text-[11.5px] text-white/20">
                        {formatDateInLanguage(Announcement.date, language)}
                    </span>

                    <button
                        className={cn(
                            "font-satoshi flex items-center gap-[2px]",
                            "text-[10.5px] md:text-[12px] font-semibold text-[#FF9933]",
                            "border border-[#FF9933]/25 rounded-[4px] px-[9px] md:px-[11px] py-[4px] md:py-[5px]",
                            "bg-transparent hover:cursor-pointer transition",
                            "hover:bg-[#FF9933]/10 hover:border-[#FF9933]/50"
                        )}
                        onClick={(e) => { e.stopPropagation(); handleClick() }}
                    >
                        {SEE_DETAILS}
                        <ChevronRight className="h-[11px] w-[11px] md:h-[13px] md:w-[13px]" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AnnouncementCard