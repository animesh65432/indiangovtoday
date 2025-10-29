"use client"

import React, { createContext, ReactNode, useState, Dispatch, SetStateAction, useEffect } from 'react'
import { useWindowDimensions } from "@/hooks/useWindowDimensions"

type PageIndexsType = {
    StartPage: number;
    EndPage: number;

}



type PageNationContextType = {
    StartPage: number;
    EndPage: number;
    SetPageIndexs: Dispatch<SetStateAction<PageIndexsType>>;
    itemsPerPage: number,
}

export const PageNationContext = createContext<PageNationContextType>({
    StartPage: 0,
    EndPage: 3,
    SetPageIndexs: () => { },
    itemsPerPage: 4,
})

type Props = {
    children: ReactNode
}

export const PageNationProvider = ({ children }: Props) => {
    const { width, height } = useWindowDimensions()
    const [itemsPerPage, SetitemsPerPage] = useState(4)
    const getInitialEndPage = () => {
        if (width >= 767) {
            return 2;
        }
        else {
            return 8;
        }
    };

    const [PageIndexs, SetPageIndexs] = useState<PageIndexsType>({
        StartPage: 0,
        EndPage: getInitialEndPage()
    })


    useEffect(() => {
        const newEndPage = getInitialEndPage()
        SetitemsPerPage(newEndPage)
        SetPageIndexs(prev => ({
            ...prev,
            EndPage: newEndPage
        }))
    }, [width, height])

    return (
        <PageNationContext.Provider value={{
            StartPage: PageIndexs.StartPage,
            EndPage: PageIndexs.EndPage,
            SetPageIndexs,
            itemsPerPage
        }}>
            {children}
        </PageNationContext.Provider>
    )
}

export default PageNationProvider
