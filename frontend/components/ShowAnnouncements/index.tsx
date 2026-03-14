import React, { useContext } from 'react'
import { Announcement as AnnouncementTypes } from "@/types/index"
import Announcement from './Announcement'
import { Button } from '../ui/button'
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { LoaderCircle } from "lucide-react"
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"

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
            <div className='bg-[#f8f7f2] border border-t border-[#E8E4DA]  h-full  pt-12 flex-1 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8  p-8 mx-auto '>
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
            </div>
        )
    }

    if (Announcements.length === 0) {
        return (
            <div className='bg-[#f8f7f2] border border-t border-[#E8E4DA] p-8 pt-12 h-full flex justify-center items-center'>
                <h3 className='text-black text-xl text-center font-poppins'>
                    {TranslateText[language].NO_ANNOUNCEMENTS_FOUND}
                </h3>
            </div>
        )
    }

    return (
        <div className='bg-[#f8f7f2] border border-t border-[#E8E4DA] p-6 pt-12 flex-1'>
            <div className='overflow-x-auto   grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pt-2'>
                {Announcements.map((ann) => (
                    <Announcement
                        Announcement={ann}
                        key={ann.title}
                    />
                ))}
            </div>
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