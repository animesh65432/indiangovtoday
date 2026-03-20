import React from "react"
import { Announcement } from "@/types"
import { ChevronRight } from "lucide-react"
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
import { formatDateInLanguage } from "@/lib/formatDate"
import { useRouter } from "next/navigation"
import { categoryStyles } from "@/lib/categoryStyles"
import Image from "next/image"


type Props = {
    Announcement: Announcement
}

const AnnouncementCard: React.FC<Props> = ({ Announcement }) => {
    const { language } = React.useContext(LanguageContext)
    const router = useRouter()

    return (
        <div className="overflow-hidden hover:shadow-md transition">
            <div>{Announcement.title}</div>
        </div>
    )
}

export default AnnouncementCard