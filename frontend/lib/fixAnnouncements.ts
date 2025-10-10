import { AnnouncementsTypes } from "@/types";

export const fixAnnouncements = (
    announcements: AnnouncementsTypes[]
): Record<string, AnnouncementsTypes[]> => {
    return announcements.reduce((acc, announcement) => {
        const { type } = announcement;

        if (!acc[type]) {
            acc[type] = [];
        }

        acc[type].push(announcement);
        return acc;
    }, {} as Record<string, AnnouncementsTypes[]>);
};
