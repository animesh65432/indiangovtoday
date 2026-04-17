import React from "react"
import { Announcement } from "@/types"
import { LanguageContext } from "@/context/Lan"
import { formatDateInLanguage } from "@/lib/formatDate"
import { useRouter } from "next/navigation"
import { ThemeContext } from "@/context/Theme"
import { TranslateText } from "@/lib/translatetext"
import { categoryStyles } from "@/lib/categoryStyles"

type Props = {
    Announcement: Announcement,
    className?: string
}

const AnnouncementCard: React.FC<Props> = ({ Announcement, className }) => {
    const { language } = React.useContext(LanguageContext)
    const { theme } = React.useContext(ThemeContext)
    const router = useRouter()

    const isDark = theme === "dark"

    const handleClick = () => {
        router.push(`/announcement?id=${Announcement.announcementId}&lan=${language}`)
    }

    return (
        <div
            className={`relative flex gap-3 px-3 py-3 border-b transition-all duration-200 ${isDark ? "hover:bg-white/5" : "bg-white"}
            ${isDark ? "border-gray-800 text-gray-200" : "border-gray-200 text-gray-900"}
            ${className}`}
        >

            <div className="mt-2">
                <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: categoryStyles[Announcement.category]?.dot }}
                />
            </div>

            <div className="flex flex-col gap-1 flex-1">


                <div className="flex items-center gap-2 text-[0.7rem] font-satoshi text-gray-500">
                    <span className="uppercase tracking-wide font-medium">
                        {Announcement.category}
                    </span>

                    <span>•</span>

                    <span>
                        {formatDateInLanguage(Announcement.date, language)}
                    </span>
                </div>

                <span
                    className={`font-literata text-[0.9rem] md:text-[0.95rem] leading-snug line-clamp-2
                    ${isDark ? "text-gray-100" : "text-gray-900"}`}
                >
                    {Announcement.title}
                </span>

                <span className="text-[0.8rem] text-gray-500 line-clamp-4 font-satoshi">
                    {Announcement.description}
                </span>

                <div className="flex items-center justify-end mt-1">


                    <span className="text-[0.7rem] font-satoshi text-blue-500 hover:underline font-medium">
                        {TranslateText[language].SEE_DETAILS}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AnnouncementCard