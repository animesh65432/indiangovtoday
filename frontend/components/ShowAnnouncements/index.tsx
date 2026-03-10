import React, { useContext } from 'react'
import { Announcement as AnnouncementTypes } from "@/types/index"
import Announcement from './Announcement'
import { Button } from '../ui/button'
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { LoaderCircle } from "lucide-react"
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import Subscribe from './Subscribe'

type Props = {
    Announcements: AnnouncementTypes[]
    LoadMoreData: () => void
    page: number
    totalpage: number
    IsLoading: boolean
    IsLoadingMore: boolean
}

const ShowAnnouncements: React.FC<Props> = ({
    Announcements,
    LoadMoreData,
    page,
    totalpage,
    IsLoading,
    IsLoadingMore,
}) => {
    const { language } = useContext(LanguageContext)

    if (IsLoading) {
        return (
            <div className='grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 w-[85%] mx-auto '>
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
            </div>
        )
    }

    if (Announcements.length === 0) {
        return (
            <div className='flex-1 flex justify-center items-center'>
                <h3 className='text-black text-xl text-center'>
                    {TranslateText[language].NO_ANNOUNCEMENTS_FOUND}
                </h3>
            </div>
        )
    }

    return (
        <div className='flex-1  w-full lg:w-[99%] xl:w-[90%] mx-auto overflow-x-auto pb-20 '>
            <div className='flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-[95%] mx-auto overflow-x-auto'>
                {Announcements.map((ann) => (
                    <Announcement
                        Announcement={ann}
                        key={ann.title}
                    />
                ))}
            </div>
            <Subscribe />
            <div className='w-full flex justify-center mt-5 mb-9'>
                {page < totalpage && (
                    <Button
                        className='mx-auto hover:bg-gray-100 rounded-none border border-black text-black'
                        disabled={IsLoadingMore}
                        onClick={LoadMoreData}
                        aria-label={IsLoadingMore ? 'Loading more announcements' : 'Load more announcements'}
                    >
                        {IsLoadingMore ? (
                            <LoaderCircle className='h-5 w-5 animate-spin text-black' />
                        ) : (
                            TranslateText[language].LOAD_MORE
                        )}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default ShowAnnouncements