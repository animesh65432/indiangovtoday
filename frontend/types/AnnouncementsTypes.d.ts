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

type announcement = {
    title: string,
    date: string,
    id: string
}

type Category = {
    category: string,
    count: number,
    announcements: announcement[],
}

export type CountAnnouncementTypes = {
    categories: Category[],
    state: string,
    id: string
}
export type ResponseCountAnnouncementTypes = {
    data: CountAnnouncementTypes[],
}

export type BriefingTypes = {
    title: string,
}