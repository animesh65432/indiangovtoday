import { useRouter } from 'next/router';
import Announcement from '@/components/Announcement';
import React from 'react';

const AnnouncementPage = () => {
    const router = useRouter();
    const { news_id, title } = router.query as { news_id: string, title: string }

    if (!news_id || !title) {
        return
    }

    console.log(news_id)

    return <Announcement
        news_id={news_id}
        title={title}
    />

};

export default AnnouncementPage;
