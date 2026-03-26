import { Call } from "@/service/call"

export const getAllAnnouncements = (target_lan: string, startdate: Date, endDate: Date, page: number, limit: number, category: string, states: string[], signal?: AbortSignal) => {
    const params = new URLSearchParams({
        target_lan,
        startDate: startdate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        page: page.toString(),
        limit: limit.toString(),
        category: category.toString()
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

export const GetTrendingIndiaAnnnouncements = (target_lan: string, signal?: AbortSignal) => {

    const params = new URLSearchParams({
        target_lan,
    });

    return Call({
        method: "GET",
        path: `/GetTrendingIndiaAnnnouncements?${params.toString()}`,
        signal
    });
}

export const GetAllCountAnnouncements = (target_lan: string, startdate: Date, endDate: Date) => {

    const params = new URLSearchParams({
        target_lan,
        startDate: startdate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
    });

    return Call({
        method: "GET",
        path: `/GetAllCountAnnouncements?${params.toString()}`,
    });
}

export const GetAllCategoriesAnnouncements = (target_lan: string, startdate: Date, endDate: Date, signal?: AbortSignal) => {

    const params = new URLSearchParams({
        target_lan,
        startDate: startdate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
    });

    return Call({
        method: "GET",
        path: `/GetAllCategoriesAnnouncements?${params.toString()}`
    });
}