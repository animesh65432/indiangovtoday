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
        if (width <= 500) {
            return 10;
        }

        // Tablet range
        if (width >= 767 && width <= 1025) {
            return 3;
        }

        // Small desktop
        if (width >= 1024 && width <= 1280) {
            return 3;
        }

        if (width >= 1600) {
            if (height <= 800) return 4;
            if (width < 1900 && height < 1000) return 5;
            if (width < 2100 && height < 1181) return 6;
            if (width < 2600 && height < 1463) return 7;
            if (width < 2800 && height < 1575) return 8;
            if (width < 3000 && height < 1688) return 9;
            return 10; // 3000+ width and 1688+ height
        }

        return 4;
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
