import React, { useContext, useState } from 'react'
import { Announcement } from "@/types"
import HeroAnnoucmentsSkelton from './HeroAnnoucmentsSkelton'
import { formatDateInLanguage } from "@/lib/formatDate"
import { LanguageContext } from '@/context/Lan'
import { useRouter } from 'next/navigation'
import EmptyAnnouncements from './EmptyAnnoucments'
import SmartImage from './SmartImage'

type Props = {
    announcements: Announcement[],
    IsLoading: boolean
}


const HeroAnnoucments: React.FC<Props> = ({ announcements, IsLoading }) => {
    const { language } = useContext(LanguageContext)
    const router = useRouter()
    const [featuredIndex, setFeaturedIndex] = useState(0)

    const handleClick = (id: string) => {
        router.push(`/announcement?id=${id}&lan=${language}`)
    }

    if (IsLoading) return <HeroAnnoucmentsSkelton />
    if (!announcements || announcements.length === 0) return <EmptyAnnouncements />

    const featured = announcements[featuredIndex]
    const sideList = announcements
        .filter((_, i) => i !== featuredIndex)
        .slice(0, 2)

    return (
        <div className='w-[95%] md:w-[80%] mx-auto hidden md:grid grid-cols-7 mt-7 gap-10'>

            <article
                className='col-span-7 xl:col-span-5 flex gap-4 hover:scale-[1.01] hover:cursor-pointer transition-transform duration-200'
                onClick={() => handleClick(featured.announcementId)}
            >
                <main className='flex-1 flex flex-col gap-2 text-wrap'>
                    <span className='font-literata uppercase red-color'>
                        {featured.category}
                    </span>
                    <span className='font-literata font-semibold line-clamp-4 leading-relaxed text-[1.1rem] lg:text-xl text-color'>
                        {featured.title}
                    </span>
                    <span className='leading-relaxed line-clamp-4 font-satoshi text-color'>
                        {featured.description}
                    </span>
                    <span className='font-literata text-color'>
                        {formatDateInLanguage(featured.date, language)} , {featured.state}
                    </span>
                </main>


                <header className='relative hidden md:block w-[40%] md:w-[45%] h-64 md:h-80 shrink-0'>
                    <SmartImage
                        src={featured.image}
                        alt={featured.title}
                        category={featured.category}
                        fill
                        className='object-cover rounded-md'
                        transformation={[{ width: 800, height: 400, focus: 'auto', quality: 85 }]}
                        onError={() => {
                            if (featuredIndex + 1 < announcements.length) {
                                setFeaturedIndex(featuredIndex + 1)
                            }
                        }}
                    />
                </header>
            </article>

            <div className='col-span-2 hidden xl:flex flex-col gap-5'>
                {sideList.map((announcement) => (
                    <article
                        key={announcement.announcementId}
                        className='flex gap-3 hover:scale-[1.01] hover:cursor-pointer transition-transform duration-200'
                        onClick={() => handleClick(announcement.announcementId)}
                    >

                        <header className='relative w-32 h-32 shrink-0'>
                            <SmartImage
                                src={announcement.image}
                                alt={announcement.title}
                                category={announcement.category}
                                fill
                                className='object-cover rounded-md'
                                transformation={[{ width: 128, height: 128, focus: 'auto', quality: 80 }]}
                            />
                        </header>

                        <main className='flex-1 flex flex-col gap-1 text-wrap'>
                            <span className='font-literata uppercase red-color text-xs'>
                                {announcement.category}
                            </span>
                            <span className='font-satoshi text-color line-clamp-3 font-medium'>
                                {announcement.title}
                            </span>
                            <span className='font-literata text-color text-sm'>
                                {formatDateInLanguage(announcement.date, language)} , {announcement.state}
                            </span>
                        </main>
                    </article>
                ))}
            </div>

        </div>
    )
}

export default HeroAnnoucments