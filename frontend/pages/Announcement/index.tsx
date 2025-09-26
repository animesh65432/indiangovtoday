import { useRouter } from 'next/router';
import Announcement from '@/components/Announcement';
import React from 'react';

const AnnouncementPage = () => {
    const router = useRouter();
    const { id } = router.query as { id: string }

    if (!id) {
        return
    }


    return <Announcement
        id={id}
    />

};

export default AnnouncementPage;
