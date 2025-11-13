import React from 'react'
import { Announcement as AnnouncementTypes } from "@/types/index"
import Announcement from './Announcement'
import { Button } from '../ui/button'
import AnnouncementSkeleton from './AnnouncementSkeleton'
import { LoaderCircle } from "lucide-react"

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
    if (IsLoading && Announcements.length === 0) {
        return (
            <div className='w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10'>
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
            </div>
        )
    }

    if (!IsLoading && Announcements.length === 0) {
        return (
            <div className='w-[85%] mx-auto text-center py-10'>
                <p className='text-gray-500'>No announcements found</p>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-6 pb-10'>
            <div className='w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {Announcements.map((ann) => (
                    <Announcement Announcement={ann} key={ann._id} />
                ))}
            </div>
            {page < totalpage - 1 && (
                <Button
                    className='w-[150px] mx-auto bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'
                    disabled={IsLoadingMore}
                    onClick={LoadMoreData}
                >
                    {IsLoadingMore ? <LoaderCircle className='h-5 w-5 animate-spin' /> : 'LOAD MORE'}
                </Button>
            )}
        </div>
    )
}

export default ShowAnnouncements