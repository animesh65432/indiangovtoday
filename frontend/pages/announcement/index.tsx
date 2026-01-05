"use client"
import { useRouter } from 'next/router';
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
import Announcement from '@/components/Announcement';
import React, { useContext } from 'react';

const AnnouncementPage = () => {
    const router = useRouter();
    const { language } = useContext(LanguageContext);
    const { id, lan } = router.query as { id: string, lan: string }


    if (!id || !lan) {
        return <div className='h-[100vh] w-[100vw] flex  items-center justify-center'>
            <div className='text-red-500'>{TranslateText[language].SOMETHING_WENT_WRONG}</div>
        </div>
    }

    return <Announcement
        id={id}
        lan={lan}
    />

};

export default AnnouncementPage;
