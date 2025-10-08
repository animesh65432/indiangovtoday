import { createContext, ReactNode, useState } from "react"
import { AnnouncementsTypes } from "@/types"

const AnnouncementsContext = createContext<{
    Announcements: Record<string, AnnouncementsTypes[]>,
    OntoggleAnnouncements: (Announcements: Record<string, AnnouncementsTypes[]>) => void
}>({
    Announcements: {},
    OntoggleAnnouncements: (Announcements) => { }
})

type Props = {
    children: ReactNode
}

export const AnnouncementsProvider = ({ children }: Props) => {
    const [Announcements, SetAnnouncements] = useState({})

    const OntoggleAnnouncements = (Announcements: Record<string, AnnouncementsTypes[]>) => {
        SetAnnouncements(Announcements)
    }

    return (
        <AnnouncementsContext.Provider value={{ Announcements, OntoggleAnnouncements }}>
            {children}
        </AnnouncementsContext.Provider>
    )
}

