import React, { useContext } from 'react'
import { Announcement } from "@/types"
import HeroAnnoucmentsSkelton from './HeroAnnoucmentsSkelton'
import Image from 'next/image'
import { formatDateInLanguage } from "@/lib/formatDate"
import { LanguageContext } from '@/context/Lan'
import { useRouter } from 'next/navigation'
import EmptyAnnouncements from './EmptyAnnoucments'

type Props = {
    announcements: Announcement[],
    IsLoading: boolean
}

const HeroAnnoucments: React.FC<Props> = ({ announcements, IsLoading }) => {
    const { language } = useContext(LanguageContext)
    const router = useRouter()

    const handleClick = (id: string) => {
        router.push(`/announcement?id=${id}&lan=${language}`)
    }

    if (IsLoading) return <HeroAnnoucmentsSkelton />

    if (!announcements || announcements.length === 0) {
        return <EmptyAnnouncements />
    }

    const featured = announcements[0]
    const sideList = announcements.slice(1, 3)

    return (
        <div className='w-[95%] md:w-[80%] mx-auto hidden md:grid grid-cols-7 mt-7 gap-10'>

            {/* ── Featured article ── */}
            <article
                className='col-span-7  hover:scale-[1.01] xl:col-span-5 flex gap-2 hover:cursor-pointer'
                onClick={() => handleClick(featured.announcementId)}
            >
                <main className='flex-1 flex flex-col gap-2 text-wrap'>
                    <span className='font-literata uppercase red-color'>
                        {featured.category}
                    </span>

                    <span className='font-literata font-semibold line-clamp-4 leading-relaxed text-[1.1rem] lg:text-xl text-color'>
                        {featured.title}
                    </span>

                    <div className='flex gap-3 items-start'>
                        <div className='flex flex-col gap-2 flex-1'>
                            <span className='leading-relaxed line-clamp-4 font-satoshi text-color'>
                                {featured.description}
                            </span>
                            <span className='font-literata flex'>
                                {formatDateInLanguage(featured.date, language)} , {featured.state}
                            </span>
                        </div>

                        {/* Mobile thumbnail */}
                        <div className='md:hidden block relative h-24 w-24 shrink-0'>
                            <Image
                                src={featured.image}
                                alt={featured.title}
                                fill
                                className='object-fill'
                            />
                        </div>
                    </div>
                </main>

                {/* Desktop image */}
                <header className='relative hidden md:block w-[30%] md:w-[40%] h-50 md:h-64'>
                    <Image
                        src={featured.image}
                        alt={featured.title}
                        fill
                        className='object-fill'
                    />
                </header>
            </article>

            {/* ── Side list ── */}
            <div className='col-span-2 hidden xl:flex flex-col gap-5'>
                {sideList.map((announcement) => (
                    <article
                        key={announcement.announcementId}
                        className='flex  hover:scale-[1.01] gap-2 hover:cursor-pointer'
                        onClick={() => handleClick(announcement.announcementId)}
                    >
                        <header className='relative w-24 h-24 shrink-0'>
                            <Image
                                src={announcement.image}
                                alt={announcement.title}
                                fill
                                className='object-fill'
                            />
                        </header>
                        <main className='flex-1 flex flex-col gap-1 text-wrap'>
                            <span className='font-satoshi text-color line-clamp-3'>
                                {announcement.title}
                            </span>
                            {/* ✅ Fixed: was using announcements[0] for all items */}
                            <span className='font-literata flex text-color'>
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