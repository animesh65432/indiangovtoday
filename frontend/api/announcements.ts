import { Call } from "@/service/call"

export const getAllAnnouncements = (target_lan: string) => Call({
    method: "GET",
    path: `/GetIndiaAnnnouncements?target_lan=${target_lan}`
})

export const getAnnouncement = (target_lan: string, id: string) => Call({
    method: "GET",
    path: `/GetIndiaAnnouncement?target_lan=${target_lan}&id=${id}`,

})