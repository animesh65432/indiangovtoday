export type AnnouncementsTypes = {
    _id: string,
    title: string,
    link: string,
    type: string,
    content: string,
    summary: string
}

export type Announcement = {
    _id: string;
    title: string;
    language: string;
    type: string;
    created_at: string
};

export type GroupedAnnouncements = {
    type: string;
    count: number;
    announcements: Announcement[];
};


export type ShowAnnouncementsTypes = {
    _id: string,
    title: string,
    content: string,
    source: string
}