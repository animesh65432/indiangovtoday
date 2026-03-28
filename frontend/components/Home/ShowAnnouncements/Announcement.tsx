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
            className={`flex flex-col hover:scale-[1.01] gap-4 hover:cursor-pointer transition-transform duration-200 ${className}`}
            onClick={handleClick}
        >
            <div className="flex gap-4 w-full lg:w-[80%]">

                {/* ── Text content ── */}
                <div className="flex flex-col gap-2 flex-1">
                    <span className="font-literata uppercase red-color">
                        {Announcement.category}
                    </span>
                    <span className="text-xl line-clamp-3 md:line-clamp-none text-color leading-relaxed font-literata font-semibold">
                        {Announcement.title}
                    </span>

                    {/* Desktop */}
                    <span className="text-color hidden lg:block font-satoshi leading-relaxed lg:line-clamp-4">
                        {Announcement.description}
                    </span>
                    <span className="font-literata hidden lg:block text-color">
                        {formatDateInLanguage(Announcement.date, language)} , {Announcement.state}
                    </span>

                    {/* Mobile */}
                    <div className="lg:hidden flex gap-4 items-start">
                        <div className="flex flex-col gap-2 flex-1">
                            <span className="text-color line-clamp-4 font-satoshi leading-relaxed">
                                {Announcement.description}
                            </span>
                            <span className="font-literata text-color">
                                {formatDateInLanguage(Announcement.date, language)} , {Announcement.state}
                            </span>
                        </div>


                        <div className='relative h-32 w-32 shrink-0'>
                            <SmartImage
                                src={Announcement.image}
                                alt={Announcement.title.substring(0, 20)}
                                category={Announcement.category}
                                fill
                                className='object-fill'
                                transformation={[{ width: 112, height: 112, focus: 'auto', quality: 80 }]}
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block relative w-[25vw] h-[28vh] xl:w-[24vw] xl:h-[24vh] shrink-0">
                    <SmartImage
                        src={Announcement.image}
                        alt={Announcement.title.substring(0, 20)}
                        category={Announcement.category}
                        fill
                        className='object-fill'
                        transformation={[{ width: 700, height: 300, focus: 'auto', quality: 85 }]}
                    />
                </div>
            </div>

            <div className="border border-gray-200 w-full lg:w-[80%]"></div>
        </div>
    )
}

export default AnnouncementCard
