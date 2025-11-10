export type Announcement = {
    _id: string;
    title: string;
    type: string;
    created_at: string;
    summary: string
    original_type: string
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