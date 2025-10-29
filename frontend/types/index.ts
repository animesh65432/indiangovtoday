export type AnnouncementsTypes = {
    _id: string,
    title: string,
    link: string,
    type: string,
    content: string,
    summary: string
}

export type GroupedAnnouncement = {
    _id: string;
    title: string;
    type: string;
    created_at: string
};

export type GroupedAnnouncements = {
    type: string;
    announcements: GroupedAnnouncement[];
};

export type GroupAnnouncementsresponse = {
    data: GroupedAnnouncements[],
    languageCode: string,
    pagination: {
        page: number,
        totalPages: number,
        totalCount: number,
        pageSize: number
    }
}

export type GetallGroupsIndiaAnnouncement = {
    _id: string,
    title: string,
    created_at: string,
    type: string,
    summary: string,
    original_type: string
}

export type GetallGroupsIndiaAnnouncements = {
    type: string,
    announcements: GetallGroupsIndiaAnnouncement[]
}

export type GetallGroupsIndiaAnnouncementsResponse = {
    data: GetallGroupsIndiaAnnouncements[]
}


export type ShowAnnouncementsTypes = {
    _id: string,
    title: string,
    content: string,
    source: string
}