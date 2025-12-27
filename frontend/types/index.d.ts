import { Announcement, AnnouncementsResponse } from "./AnnouncementsTypes"
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
    original_type?: string
};

export type GroupedAnnouncements = {
    type: string;
    announcements: GroupedAnnouncement[];
};

export type GroupAnnouncementsresponse = {
    data: Announcement[],
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

type SummarySection = {
    type: "summary";
    heading: string;
    content: string;
};

type DetailsSection = {
    type: "details";
    heading: string;
    content: string;
};

type KeyPointsSection = {
    type: "keypoints";
    heading: string;
    points: string[];
};

export type SectionTypes =
    | SummarySection
    | DetailsSection
    | KeyPointsSection;

export type ShowAnnouncementsTypes = {
    announcementId: string,
    source_link: string,
    state: string,
    title: string,
    date: string,
    category: string,
    department: string,
    sections: SectionTypes[]

}

export { Announcement, AnnouncementsResponse }