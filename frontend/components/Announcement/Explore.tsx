import React, { useState, useEffect } from 'react'
import { getAllAnnouncements } from "@/api/announcements"
import { useContext } from 'react'
import { LanguageContext } from "@/context/Lan"
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types"
import ShowAnnouncements from '../ShowAnnouncements'

type Props = {
    id: string
}

const Explore: React.FC<Props> = ({ id }) => {
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const { language } = useContext(LanguageContext)
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])


    useEffect(() => {
        let isCancelled = false;

        async function fetchExploreAnnouncements() {
            SetIsLoading(true)
            try {
                const end = new Date()
                const start = new Date()
                start.setDate(end.getDate() - 7)

                const response = await getAllAnnouncements(language, start, end, 1, 5) as AnnouncementsResponse


                if (!isCancelled) {
                    const filteredAnnouncements = response.data.filter(announcement => announcement.announcementId !== id);
                    SetAnnouncements(filteredAnnouncements)
                }
            } finally {
                if (!isCancelled) {
                    SetIsLoading(false)
                }
            }
        }

        fetchExploreAnnouncements()

        return () => {
            isCancelled = true
        }
    }, [language])
    return (
        <ShowAnnouncements
            Announcements={Announcements}
            IsLoading={IsLoading}
            page={1}
            totalpage={1}
            IsLoadingMore={false}
            LoadMoreData={() => { }}
            ShowBackButtom={false}
            IsItExplore={true}
        />
    )
}

export default Explore