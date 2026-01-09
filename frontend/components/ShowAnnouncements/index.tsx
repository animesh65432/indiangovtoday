import React, { useContext } from 'react'
import { Announcement as AnnouncementTypes } from "@/types/index"
import Announcement from './Announcement'
import { Button } from '../ui/button'
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { LoaderCircle } from "lucide-react"
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import Image from 'next/image'
import { useRouter } from "next/navigation"

type Props = {
    Announcements: AnnouncementTypes[],
    LoadMoreData: () => void,
    page: number,
    totalpage: number,
    IsLoading: boolean,
    IsLoadingMore: boolean,
    ShowBackButtom: boolean,
    IsItExplore?: boolean

}

const ShowAnnouncements: React.FC<Props> = ({
    Announcements,
    LoadMoreData,
    page,
    totalpage,
    IsLoading,
    IsLoadingMore,
    ShowBackButtom,
    IsItExplore = false
}) => {

    const { language } = useContext(LanguageContext)
    const router = useRouter()

    if (IsLoading) {
        return (
            <div className='flex flex-col p-8 gap-8 '>
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
            </div>
        )
    }

    if (!IsLoading && Announcements.length === 0) {
        return (
            <div className='min-h-[60vh] flex justify-center items-center '>
                <h3 className='text-black  text-xl  text-center'>{TranslateText[language].NO_ANNOUNCEMENTS_FOUND}</h3>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-6 pb-20'>
            {ShowBackButtom && (
                <nav className='w-[90%] sm:w-[90%] mx-auto hidden sm:block sticky top-50  z-50 py-4'>
                    <Button
                        onClick={() => router.push("/#announcements")}
                        className='text-[#2C3143] border border-[#000000] rounded-none font-poppins'
                    >
                        <Image src="/Left.svg" alt='arrow' width={14} height={14} />
                        {TranslateText[language].BACK}
                    </Button>
                </nav>
            )}

            <div className='w-[95%] sm:w-[85%] flex flex-col gap-6 pt-2 mx-auto '>
                {Announcements.map((ann) => (
                    <Announcement Announcement={ann} key={ann.title} />
                ))}
            </div>
            {page < totalpage && (
                <Button
                    className='mx-auto hover:bg-gray-100 rounded-none border border-black text-black'
                    disabled={IsLoadingMore}
                    onClick={LoadMoreData}
                >
                    {IsLoadingMore ? <LoaderCircle className='h-5 animate-spin text-black' /> : `${TranslateText[language].LOAD_MORE}`}
                </Button>
            )}
            {IsItExplore && <Button
                className='mx-auto hover:bg-gray-100 rounded-none border border-black text-black'
            >
                {IsLoadingMore ? <LoaderCircle className='h-5 animate-spin text-black' /> : `${TranslateText[language].VIEW_MORE_ANNOUNCEMENTS}`}
            </Button>}
        </div>
    )
}

export default ShowAnnouncements