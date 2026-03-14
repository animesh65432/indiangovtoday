import React from "react"
import { Announcement } from "@/types"
import { ChevronRight } from "lucide-react"
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
import { formatDateInLanguage } from "@/lib/formatDate"
import { useRouter } from "next/navigation"
import { categoryStyles } from "@/lib/categoryStyles"


type Props = {
    Announcement: Announcement
}

const AnnouncementCard: React.FC<Props> = ({ Announcement }) => {
    const { language } = React.useContext(LanguageContext)
    const router = useRouter()

    return (
        <div className="bg-white  border-l-2  rounded-r-md border-[#ecc55a] overflow-hidden hover:shadow-md transition">

            {/* Image */}
            <div className="relative h-40 w-full">
                <img
                    src={Announcement.image ?? "/default-announcement.jpg"}
                    alt={Announcement.title}
                    className="w-full h-full object-cover"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

                {/* Category */}
                <span
                    className={`absolute top-3 left-3 text-[11px] font-bold tracking-wide px-2 py-[3px] rounded uppercase ${categoryStyles[Announcement.category] || categoryStyles["Other"]
                        }`}
                >
                    {Announcement.category}
                </span>

                {/* Date */}
                <span className="absolute bottom-3 right-3 text-[11px] font-inter bg-black/60 text-white px-2 py-[3px] rounded">
                    {formatDateInLanguage(Announcement.date, language)}
                </span>
            </div>

            <div className="p-4 flex flex-col gap-2">

                {/* Department */}
                <span className="w-fit text-[11px] font-poppins  text-[#92400E] font-semibold border border-[#F2C572] px-2 py-0.5 bg-[#FEF3C7] rounded">
                    {Announcement.department}
                </span>

                {/* Title */}
                <h6 className="font-semibold font-inter text-[15px] leading-snug text-[#1A1A1A]">
                    {Announcement.title}
                </h6>

                {/* Description */}
                <span className="text-[14px] font-poppins text-[#666] line-clamp-3">
                    {Announcement.description}
                </span>

                <button onClick={() => router.push(`announcement?id=${Announcement.announcementId}&lan=${language}`)} className="mt-2 text-[0.7rem] w-fit flex items-center font-poppins gap-1 bg-[#FBBF24] hover:bg-[#EAB308] text-black font-semibold px-3 py-1.5 rounded">
                    {TranslateText[language].SEE_DETAILS}
                    <ChevronRight size={14} />
                </button>

            </div>
        </div>
    )
}

export default AnnouncementCard