import React, { useContext } from 'react'
import { Announcement } from "@/types"
import Image from 'next/image'
import { formatDateInLanguage } from "@/lib/formatDate"
import { LanguageContext } from '@/context/Lan';

// type Props = {
//     announcements: Announcement[]
// }
const announcements = [
    {
        announcementId: "69c3a8fa8f35d1afd4772aad",
        category: "Education",
        date: "2026-03-25T00:00:00.000Z",
        department: "Ministry of Environment, Forest and Climate Change",
        description: "The National Biodiversity Authority has launched a short-term internship program for college students in biodiversity conservation and natural resource management to build capacity among youth and create biodiversity ambassadors.",
        image: "https://takatakkhabre.com/wp-content/uploads/2024/05/IMG-20240518-WA0036-1024x768.jpg",
        state: "IndianGovt",
        title: "National Biodiversity Authority Launches Short-term Internship Programme for College Students in Biodiversity Conservation and Natural Resource Management"
    },
    {
        announcementId: "69c3a8fa8f35d1afd4772aac",
        category: "Scheme",
        date: "2026-03-25T00:00:00.000Z",
        department: "Ministry of Fisheries, Animal Husbandry and Dairying",
        description: "The Ministry of Fisheries, Animal Husbandry and Dairying approved projects worth Rs 544.86 crore to establish 2195 FFPOs across India, including 64 in Karnataka, under PMMSY between 2020-21 and 2024-25.",
        image: "https://hindibusinessstandard.imagibyte.sortdcdn.net/wp-content/uploads/2025/06/nirmala-sitharaman-1.jpg",
        state: "IndianGovt",
        title: "FPOs in the Country"
    },
    {
        announcementId: "69c2e577632db60a6c4f3bc3",
        category: "Scheme",
        date: "2026-03-24T00:00:00.000Z",
        department: "Ministry of Agriculture and Farmers Welfare",
        description: "The government has launched the National Mission on DDKY and Natural Farming to promote productivity, sustainability, and farmer welfare, aiming to increase farmers' income, ensure food security, and promote environmental sustainability.",
        image: "https://newspotli.com/wp-content/uploads/2025/07/%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B0%E0%A4%BE%E0%A4%B7%E0%A5%8D%E0%A4%9F%E0%A5%8D%E0%A4%B0-.png",
        state: "IndianGovt",
        title: "Government Launches DDKY and National Mission on Natural Farming"
    }
];

const HeroAnnoucments: React.FC = () => {
    const { language } = useContext(LanguageContext)
    return (
        <div className='w-[95%] md:w-[80%] mx-auto hidden md:grid  grid-cols-7 mt-7 gap-10'>
            <article className='col-span-7 hover:cursor-pointer xl:col-span-5 flex  gap-2'>
                <main className='flex-1 flex flex-col gap-2 text-wrap'>
                    <span className='font-literata uppercase red-color'>
                        {announcements[0].category}
                    </span>

                    <span className='font-literata font-semibold line-clamp-4 leading-relaxed text-[1.1rem] lg:text-xl text-color'>
                        {announcements[0].title}
                    </span>

                    <div className='flex gap-3 items-start'>

                        <div className='flex flex-col gap-2 flex-1'>
                            <span className='leading-relaxed line-clamp-4 font-satoshi text-color'>
                                {announcements[0].description}
                            </span>

                            <span className='font-literata flex'>
                                {formatDateInLanguage(announcements[0].date, language)} , {announcements[0].state}
                            </span>
                        </div>

                        <div className='md:hidden block relative h-24 w-24 shrink-0'>
                            <Image
                                src={announcements[0].image}
                                alt={announcements[0].title}
                                fill
                                className='object-fill'
                            />
                        </div>

                    </div>
                </main>
                <header className="relative  hidden md:block w-[30%] md:w-[40%] h-50 md:h-64">
                    <Image
                        src={announcements[0].image}
                        alt={announcements[0].title}
                        fill
                        className='object-fill'
                    />
                </header>
            </article>
            <div className='col-span-2  hidden xl:flex flex-col gap-5'>
                {announcements.slice(1).map((announcement) =>
                    <article key={announcement.announcementId} className='flex gap-2 hover:cursor-pointer'>
                        <header className='relative w-24 h-24'>
                            <Image
                                src={announcement.image}
                                alt={announcement.title}
                                fill
                                className='object-fill'
                            />
                        </header>
                        <main className='flex-1 flex flex-col gap-1 text-wrap'>
                            <span className='font-satoshi text-color line-clamp-3'>{announcement.title}</span>
                            <span className='font-literata flex text-color'>{formatDateInLanguage(announcements[0].date, language)} , {announcements[0].state}</span>
                        </main>
                    </article>
                )
                }
            </div>
        </div>
    )
}

export default HeroAnnoucments