import React from 'react'
import { Announcement } from "@/types/index"

type Props = {
    Announcements: Announcement[]
}

const ShowAnnouncements: React.FC<Props> = ({ Announcements }) => {
    return (
        <div>Announcements</div>
    )
}

export default ShowAnnouncements