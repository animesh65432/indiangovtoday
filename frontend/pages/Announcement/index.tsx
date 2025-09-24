import { useRouter } from 'next/router';
import Announcement from '@/components/Announcement';
import React, { useEffect, useState } from 'react';

const AnnouncementPage = () => {
    const router = useRouter();
    const [newsId, setNewsId] = useState<string>("");

    useEffect(() => {
        const { news_id } = router.query;

        if (!news_id) {
            router.push("/");
            return;
        }


        setNewsId(Array.isArray(news_id) ? news_id[0] : news_id);
    }, [router.query, router]);


    if (!newsId) return null;

    return <Announcement news_id={newsId} />;
};

export default AnnouncementPage;
