import React from "react"
import { Announcement } from "@/types"
import { LanguageContext } from "@/context/Lan"
import { formatDateInLanguage } from "@/lib/formatDate"
import { useRouter } from "next/navigation"
import { ThemeContext } from "@/context/Theme"

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
            className={`flex flex-col hover:scale-[1.01] gap-4 hover:cursor-pointer w-full transition-transform duration-200
                ${isDark ? "bg-[#050505] text-white" : "bg-white text-gray-900"}
                ${className}`}
            onClick={handleClick}
        >
            <div className="flex gap-4 w-full p-4">

                <div className="flex flex-col gap-2 flex-1">
                    <span className={`text-[1rem] line-clamp-3 md:line-clamp-none leading-relaxed font-literata font-semibold
                        ${isDark ? "text-white" : "text-gray-900"}`}>
                        {Announcement.title}
                    </span>

                    <div className="flex gap-4 items-start">
                        <div className="flex flex-col gap-2 flex-1">
                            <span className={`text-[0.9rem] line-clamp-4 font-satoshi leading-relaxed
                                ${isDark ? "text-zinc-300" : "text-gray-600"}`}>
                                {Announcement.description}
                            </span>
                            <span className={`font-literata text-[0.9rem]
                                ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                                {formatDateInLanguage(Announcement.date, language)} , {Announcement.state}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`border w-full ${isDark ? "border-zinc-700" : "border-gray-200"}`}></div>
        </div>
    )
}

export default AnnouncementCard