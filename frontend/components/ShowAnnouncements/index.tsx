import React, { useContext } from 'react'
import { Announcement as AnnouncementTypes } from "@/types/index"
import Announcement from './Announcement'
import { Button } from '../ui/button'
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { LoaderCircle } from "lucide-react"
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"

type Props = {
    Announcements: AnnouncementTypes[],
    LoadMoreData: () => void,
    page: number,
    totalpage: number,
    IsLoading: boolean,
    IsLoadingMore: boolean
}

const ShowAnnouncements: React.FC<Props> = ({
    Announcements,
    LoadMoreData,
    page,
    totalpage,
    IsLoading,
    IsLoadingMore
}) => {

    const { language } = useContext(LanguageContext)

    if (IsLoading && Announcements.length === 0) {
        return (
            <div className='w-[85%] mx-auto flex flex-col gap-8 '>
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
            </div>
        )
    }

    if (!IsLoading && Announcements.length === 0) {
        return (
            <div className=' h-[56vh] sm:h-[67vh] md:h-[70vh] flex justify-center '>
                <h3 className='text-black mt-30 text-xl  text-center'>{TranslateText[language].NO_ANNOUNCEMENTS_FOUND}</h3>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-6 pb-10'>
            <div className='w-[85%] flex flex-col gap-12 mx-auto'>
                {Announcements.map((ann) => (
                    <Announcement Announcement={ann} key={ann.announcementId} />
                ))}
            </div>
            {page < totalpage - 1 && (
                <Button
                    className='mx-auto  rounded-xl shadow-[4px_4px_0_0_#00000029]'
                    disabled={IsLoadingMore}
                    onClick={LoadMoreData}
                >
                    {IsLoadingMore ? <LoaderCircle className='h-5 animate-spin' /> : `${TranslateText[language].LOAD_MORE}`}
                </Button>
            )}
        </div>
    )
}

export default ShowAnnouncements