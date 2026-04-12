import React from "react"
import { Announcement } from "@/types"
import { LanguageContext } from "@/context/Lan"
import { formatDateInLanguage } from "@/lib/formatDate"
import { useRouter } from "next/navigation"
import SmartImage from "../SmartImage"

type Props = {
    Announcement: Announcement,
    className?: string
}

const AnnouncementCard: React.FC<Props> = ({ Announcement, className }) => {
    const { language } = React.useContext(LanguageContext)
    const router = useRouter()

    const handleClick = () => {
        router.push(`/announcement?id=${Announcement.announcementId}&lan=${language}`)
    }

    return (
        <div
            className={`flex flex-col  hover:scale-[1.01] gap-4 hover:cursor-pointer w-full transition-transform duration-200 ${className}`}
            onClick={handleClick}
        >
            <div className="flex gap-4 w-full p-4 ">

                <div className="flex flex-col gap-2 flex-1">
                    <span className="text-[1rem] line-clamp-3 md:line-clamp-none text-color leading-relaxed font-literata font-semibold">
                        {Announcement.title}
                    </span>

                    <div className="flex gap-4 items-start">
                        <div className="flex flex-col gap-2 flex-1">
                            <span className="text-color text-[0.9rem] line-clamp-4 font-satoshi leading-relaxed">
                                {Announcement.description}
                            </span>
                            <span className="font-literata text-color text-[0.9rem]">
                                {formatDateInLanguage(Announcement.date, language)} , {Announcement.state}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border border-gray-200 w-full "></div>
        </div>
    )
}

export default AnnouncementCard
