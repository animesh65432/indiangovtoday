import React, { useContext } from 'react'
import { Announcement as AnnouncementTypes } from "@/types";
import AnnouncementSkeleton from '../ShowAnnouncements/AnnouncementSkeleton';
import MobileAnnoucment from './MobileAnnoucment';
import { TranslateText } from '@/lib/translatetext';
import { LanguageContext } from '@/context/Lan';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';

type Props = {
    announcements: AnnouncementTypes[]
    IsLoading: boolean
    IsLoadingMore: boolean
    LoadMoreData: () => void
    page: number
    totalpages: number
}

const MobileShowAnnoucments = ({ announcements, IsLoading, IsLoadingMore, LoadMoreData, page, totalpages }: Props) => {
    const { language } = useContext(LanguageContext)
    if (IsLoading) {
        return (
            <div className='flex-1 flex flex-col gap-2 md:hidden overflow-x-auto bg-[#f8f7f2] p-4'>
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
            </div>
        )
    }

    if (announcements.length === 0) {
        return <div className='flex-1 flex md:hidden flex-col items-center justify-center'>
            <span className='text-center text-black font-inter'>{TranslateText[language].NO_ANNOUNCEMENTS_FOUND}</span>
        </div>
    }

    return (
        <div className='flex-1 flex flex-col gap-2 md:hidden overflow-y-auto bg-[#f8f7f2] p-4'>
            {announcements.map((announcement, index) => (
                <MobileAnnoucment
                    key={index}
                    announcement={announcement}
                />
            ))}
            <div className='w-full flex justify-center mt-5 mb-9'>
                {page < totalpages && (
                    <Button
                        className='mx-auto font-poppins font-bold rounded-md bg-[#FBBF24] hover:bg-[#EAB308] p-4 text-black text-[13px]'
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

export default MobileShowAnnoucments