import { Call } from "@/service/call"

export const getAllAnnouncements = (target_lan: string) => Call({
    method: "GET",
    path: `/indian-announcements?target_lan=${target_lan}`
})

export const getAnnouncement = (target_lan: string, id: string) => Call({
    method: "GET",
    path: `/indian-announcement?target_lan=${target_lan}&id=${id}`,

})