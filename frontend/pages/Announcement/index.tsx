import { useRouter } from 'next/router';
import Announcement from '@/components/Announcement';
import React, { useEffect, useState } from 'react';

const AnnouncementPage = () => {
    const router = useRouter();
    const [newsId, setNewsId] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null)

    useEffect(() => {
        const { news_id, title } = router.query;

        if (!news_id || !title) {
            router.push("/");
            return;
        }


        setNewsId(Array.isArray(news_id) ? news_id[0] : news_id);
        setTitle(Array.isArray(title) ? title[0] : title)
    }, [router.query, router]);


    if (!newsId || !title) return null;

    return <Announcement news_id={newsId} title={title} />;
};

export default AnnouncementPage;
