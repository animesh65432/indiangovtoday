export type Announcement = {
    announcementId: string
    date: string
    description: string
    state: string
    title: string
    category: string
    department: string,
    image: string
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

export type TrendingAnnouncementTypes = {
    announcementId: string
    title: string
}

export type ResponseTrendingAnnouncementTypes = {
    data: TrendingAnnouncementTypes[],
}

export type CountAnnouncementTypes = {
    state: string,
    count: number
}
export type ResponseCountAnnouncementTypes = {
    data: CountAnnouncementTypes[],
}