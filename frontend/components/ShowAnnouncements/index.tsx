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

    if (IsLoading) {
        return (
            <div className='flex flex-col p-8 gap-8 overflow-y-scroll'>
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
                <h3 className='text-black  text-xl  text-center'>No Announcements Found</h3>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-6  overflow-y-scroll pb-20'>

            <div className='w-[95%] sm:w-[85%] flex flex-col gap-6 pt-10 mx-auto '>
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
        </div>
    )
}

export default ShowAnnouncements