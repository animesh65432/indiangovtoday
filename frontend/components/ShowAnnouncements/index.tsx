import React, { useContext } from 'react'
import { Announcement as AnnouncementTypes } from "@/types/index"
import Announcement from './Announcement'
import { Button } from '../ui/button'
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { LoaderCircle } from "lucide-react"
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import Subscribe from './Subscribe'
import AnnoucementsTitle from '../Home/AnnoucementsTitle'

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
            <div className='flex-1 w-full lg:w-[90%] mx-auto overflow-hidden'>
                <div className='flex flex-col lg:flex-row gap-8 h-full'>
                    <div className='flex-1 overflow-y-auto px-8 pt-8'>
                        <div className='flex flex-col gap-8 pb-8'>
                            <AnnouncementSkeleton />
                            <AnnouncementSkeleton />
                            <AnnouncementSkeleton />
                            <AnnouncementSkeleton />
                        </div>
                    </div>
                    <div className='hidden lg:block lg:w-[300px] border-0 lg:sticky lg:top-8 lg:self-start'>
                        <Subscribe />
                    </div>
                </div>
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
        <div className='flex-1 w-full lg:w-[90%] mx-auto overflow-hidden'>
            <div className='flex flex-col lg:flex-row gap-8 h-full'>
                <div className='overflow-y-auto px-10 md:pt-2 w-full lg:w-[75%]'>
                    <div className='flex flex-col gap-6 pb-20'>
                        {Announcements.map((ann) => (
                            <Announcement
                                Announcement={ann}
                                key={ann.title}
                            />
                        ))}

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

                <div className='hidden lg:block lg:w-[300px] border-0 lg:sticky lg:top-8 lg:self-start'>
                    <Subscribe />
                </div>
            </div>
        </div>
    )
}

export default ShowAnnouncements