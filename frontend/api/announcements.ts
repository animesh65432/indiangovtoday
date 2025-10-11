import { Call } from "@/service/call"

export const getAllAnnouncements = (target_lan: string, startdate: Date, endDate: Date, StartPage: number, EndPage: number) => Call({
    method: "GET",
    path: `/GetIndiaAnnnouncements?target_lan=${target_lan}&startdate=${startdate}&endDate=${endDate}&StartPage=${StartPage}&EndPage=${EndPage}`
})

export const getAnnouncement = (target_lan: string, id: string) => Call({
    method: "GET",
    path: `/GetIndiaAnnouncement?target_lan=${target_lan}&id=${id}`,

})