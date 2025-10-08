import { createContext, ReactNode, useState } from "react"
import { AnnouncementsTypes } from "@/types"

const AnnouncementsContext = createContext<{
    Announcements: AnnouncementsTypes[],
    OntoggleAnnouncements: (Announcements: AnnouncementsTypes[]) => void
}>({
    Announcements: [],
    OntoggleAnnouncements: (Announcements) => { }
})

type Props = {
    children: ReactNode
}

export const AnnouncementsProvider = ({ children }: Props) => {
    const [Announcements, SetAnnouncements] = useState<AnnouncementsTypes[]>([])

    const OntoggleAnnouncements = (Announcements: AnnouncementsTypes[]) => {
        SetAnnouncements(Announcements)
    }

    return (
        <AnnouncementsContext.Provider value={{ Announcements, OntoggleAnnouncements }}>
            {children}
        </AnnouncementsContext.Provider>
    )
}

