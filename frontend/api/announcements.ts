import { Call } from "@/service/call"

export const getAllAnnouncements = (target_lan: string, startdate: Date, endDate: Date, page: number, limit: number, states: string[], department: string, SearchInput: string, signal?: AbortSignal) => {
    const params = new URLSearchParams({
        target_lan,
        startDate: startdate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        page: page.toString(),
        limit: limit.toString(),
        SearchInput: SearchInput.toString(),
        department: department.toString(),
    });

    states.forEach(state => params.append('states', state));


    return Call({
        method: "GET",
        path: `/GetIndiaAnnnouncements?${params.toString()}`,
        signal
    });
};


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

export const GetallAnnoucementsDepartments = (target_lan: string, startdate: Date, endDate: Date, states: string[], signal?: AbortSignal) => {

    const params = new URLSearchParams({
        target_lan,
        startDate: startdate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
    });

    states.forEach(state => params.append('states', state));

    return Call({
        method: "GET",
        path: `/GetallAnnoucementsDepartments?${params.toString()}`,
        signal
    });
}