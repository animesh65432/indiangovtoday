export type Announcement = {
    announcementId: string
    date: string
    description: string
    state: string
    title: string
};

export type AnnouncementsResponse = {
    data: Announcement[],
    languageCode: string,
    pagination: {
        page: number,
        totalPages: number,
        totalCount: number,
        pageSize: number
    }
}