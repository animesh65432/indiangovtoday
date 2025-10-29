"use client"
import { useRouter } from 'next/router';
import Announcement from '@/components/Announcement';
import React from 'react';

const AnnouncementPage = () => {
    const router = useRouter();
    const { id, lan } = router.query as { id: string, lan: string }


    if (!id || !lan) {
        return <div className='h-[100vh] w-[100vw] flex  items-center justify-center'>
            <div className='text-red-500'>Something Went Wrong</div>
        </div>
    }

    return <Announcement
        id={id}
        lan={lan}
    />

};

export default AnnouncementPage;
