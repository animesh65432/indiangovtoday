import { createContext, ReactNode, useState } from "react";
import { AnnouncementsTypes } from "@/types";

export const FilterAnnouncementsContext = createContext<{
    FilterAnnouncements: AnnouncementsTypes[],
    SetFilterAnnouncements: (Announcements: AnnouncementsTypes[]) => void
}>({
    FilterAnnouncements: [],
    SetFilterAnnouncements: () => { }
});

type Props = {
    children: ReactNode;
};

export const FilterAnnouncementsProvider = ({ children }: Props) => {
    const [FilterAnnouncements, SetFilterAnnouncements] = useState<AnnouncementsTypes[]>([]);

    return (
        <FilterAnnouncementsContext.Provider value={{ FilterAnnouncements, SetFilterAnnouncements }}>
            {children}
        </FilterAnnouncementsContext.Provider>
    );
};


