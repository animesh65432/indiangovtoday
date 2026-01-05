import { Call } from "@/service/call"

export const getAllAnnouncements = (target_lan: string, startdate: Date, endDate: Date, page: number, limit: number) => Call({
    method: "GET",
    path: `/GetIndiaAnnnouncements?target_lan=${target_lan}&startDate=${startdate.toString()}&endDate=${endDate.toString()}&page=${page}&limit=${limit}`
})

export const getAnnouncement = (target_lan: string, id: string) => Call({
    method: "GET",
    path: `/GetIndiaAnnnouncement?target_lan=${target_lan}&id=${id}`,

})

export const SerachallIndiaAnnouncements = (target_lan: string, startdate: Date, endDate: Date, page: number, limit: number, SearchInput: string) => Call({
    method: "GET",
    path: `/SerachallIndiaAnnouncements?target_lan=${target_lan}&startdate=${startdate}&endDate=${endDate}&page=${page}&limit=${limit}&SearchInput=${SearchInput}`
})


export const GetGroupIndiaAnnouncements = (target_lan: string, startdate: Date, endDate: Date, typeofGroup: string) => Call({
    method: "GET",
    path: `/GetGroupIndiaAnnouncements?target_lan=${target_lan}&startdate=${startdate}&endDate=${endDate}&typeofGroup=${typeofGroup}`
})