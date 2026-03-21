import React from "react"
import { Announcement } from "@/types"
import { ChevronRight } from "lucide-react"
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
import { formatDateInLanguage } from "@/lib/formatDate"
import { useRouter } from "next/navigation"
import { getCat, TileSize } from "@/lib/categoryStyles"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Props = {
    Announcement: Announcement
    size?: TileSize
}

const AnnouncementCard: React.FC<Props> = ({ Announcement, size = "small" }) => {
    const { language } = React.useContext(LanguageContext)
    const router = useRouter()
    const { SEE_DETAILS } = TranslateText[language]

    const cat = getCat(Announcement.category)
    const isBig = size === "big"
    const isWide = size === "wide"

    const handleClick = () => {
        router.push(`/announcement?id=${Announcement.announcementId}&lan=${language}`)
    }

    return (
        <div
            onClick={handleClick}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-lg cursor-pointer",
                "bg-[#1A1A1A] border border-white/[0.07]",
                "transition-all duration-150 hover:border-[#FF9933]/40 hover:bg-[#1f1f1f]",
                isBig ? "min-h-[210px]" : "min-h-[140px]"
            )}
        >
            {/* Image — big tiles only */}
            {isBig && Announcement.image && (
                <div className="relative w-full h-[100px] flex-shrink-0 bg-black overflow-hidden">
                    <Image
                        src={Announcement.image}
                        alt={Announcement.title}
                        fill
                        className="object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-200"
                        sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-[#1A1A1A]" />
                </div>
            )}

            {/* Body */}
            <div className="flex flex-1 flex-col gap-[6px] p-[14px]">

                {/* Row 1: category badge + state */}
                <div className="flex items-center justify-between gap-2">
                    <span
                        className="font-satoshi inline-flex items-center gap-[5px] rounded-[4px] px-[8px] py-[3px] text-[10px] font-bold tracking-[0.06em] uppercase whitespace-nowrap"
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

                    <span className="font-satoshi text-[10px] text-white/25 truncate max-w-[110px] text-right">
                        {Announcement.state}
                    </span>
                </div>

                {/* Row 2: Department */}
                <p className="font-satoshi text-[10.5px] font-medium text-white/35 truncate leading-none">
                    {Announcement.department}
                </p>

                {/* Row 3: Title — more lines on big, fewer on small */}
                <p
                    className={cn(
                        "font-satoshi font-semibold text-white leading-[1.45]",
                        isBig ? "text-[14px]" : "text-[13px]"
                    )}
                >
                    {Announcement.title}
                </p>

                {/* Row 4: Description — shown on all cards, fewer lines on small */}
                {Announcement.description && (
                    <p
                        className={cn(
                            "font-satoshi leading-[1.55] text-white/40",
                            isBig ? "text-[12px]" : "text-[11.5px]"
                        )}
                    >
                        {Announcement.description}
                    </p>
                )}

                {/* Footer: date + button */}
                <div className="mt-auto flex items-center justify-between pt-[8px] border-t border-white/[0.06]">
                    <span className="font-satoshi text-[10px] text-white/20">
                        {formatDateInLanguage(Announcement.date, language)}
                    </span>

                    <button
                        className={cn(
                            "font-satoshi flex items-center gap-[2px]",
                            "text-[10.5px] font-semibold text-[#FF9933]",
                            "border border-[#FF9933]/25 rounded-[4px] px-[9px] py-[4px]",
                            "bg-transparent hover:cursor-pointer transition",
                            "hover:bg-[#FF9933]/10 hover:border-[#FF9933]/50"
                        )}
                        onClick={(e) => { e.stopPropagation(); handleClick() }}
                    >
                        {SEE_DETAILS}
                        <ChevronRight className="h-[11px] w-[11px]" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AnnouncementCard