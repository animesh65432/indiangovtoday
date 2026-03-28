import React from "react"
import { Announcement } from "@/types"
import { LanguageContext } from "@/context/Lan"
import { formatDateInLanguage } from "@/lib/formatDate"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
        <div className={`flex flex-col hover:scale-[1.01]  gap-4 hover:cursor-pointer ${className}`} onClick={handleClick}>
            <div className="flex gap-2 w-full lg:w-[80%]">
                <div className="flex flex-col gap-2 ">
                    <span className="font-literata uppercase red-color ">{Announcement.category}</span>
                    <span className="text-xl line-clamp-3 md:line-clamp-none text-color leading-relaxed font-literata font-semibold  ">
                        {Announcement.title}
                    </span>
                    <span className="text-color hidden lg:block font-satoshi leading-relaxed lg:line-clamp-4">
                        {Announcement.description}
                    </span>
                    <span className="font-literata hidden lg:block">{formatDateInLanguage(Announcement.date, language)} , {Announcement.state}</span>
                    <div className="lg:hidden flex gap-10 items-center">
                        <div className="flex flex-col gap-2">
                            <span className="text-color line-clamp-4 md:line-clamp-none font-satoshi leading-relaxed lg:line-clamp-4">
                                {Announcement.description}
                            </span>
                            <span className="font-literata">{formatDateInLanguage(Announcement.date, language)} , {Announcement.state}</span>
                        </div>
                        <div className='lg:hidden block relative h-24 w-24 shrink-0'>
                            <Image
                                src={Announcement.image}
                                alt={Announcement.title.substring(0, 20)}
                                fill
                                className='object-fill'
                            />
                        </div>
                    </div>
                </div>
                <div className=" hidden lg:block relative w-[55vw] h-[30vh] xl:w-[35vw] xl:h-[25vh]">
                    <Image
                        src={Announcement.image}
                        alt={Announcement.title.substring(0, 20)}
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
            <div className="border border-gray-200 w-full lg:w-[80%]"></div>
        </div>
    )
}

export default AnnouncementCard