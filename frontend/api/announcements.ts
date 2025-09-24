import { Call } from "@/service/call"

export const getAllAnnouncements = (target_lan: string) => Call({
    method: "GET",
    path: `/indian-announcements?target_lan=${target_lan}`
})

export const getAnnouncement = (target_lan: string, link: string) => Call({
    method: "POST",
    path: `/indian-announcement?target_lan=${target_lan}&link=${link}`,
    request: {
        target_lan,
        link
    }
})