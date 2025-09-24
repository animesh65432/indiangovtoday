import { Call } from "@/service/call"

export const getAllAnnouncements = () => Call({
    method: "GET",
    path: "/indian-announcements"
})