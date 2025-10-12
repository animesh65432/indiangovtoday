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
}

export const PageNationContext = createContext<PageNationContextType>({
    StartPage: 0,
    EndPage: 3,
    SetPageIndexs: () => { }
})

type Props = {
    children: ReactNode
}

export const PageNationProvider = ({ children }: Props) => {
    const { width, height } = useWindowDimensions()

    const getInitialEndPage = () => {
        if (width >= 1600 && height <= 800) {
            return 4
        } else if (width >= 1600 && height >= 800 && width < 1900 && height < 1000) {
            return 5
        }
        else if (width >= 1900 && height >= 1000 && width < 2100 && height < 1181) {
            return 6
        }
        else if (width >= 2100 && height >= 1181 && width < 2600 && height < 1463) {
            return 7
        }
        else if (width >= 2600 && height >= 1463 && width < 2800 && height < 1575) {
            return 8
        } else if (width >= 2800 && height >= 1575 && width < 3000 && height < 1688) {
            return 9
        }
        else if (width >= 3000 && height >= 1688) {
            return 10
        }
        else if (width <= 1280 && width >= 1024) {
            return 3
        }
        else if (width >= 767 && width <= 1025) {
            return 3
        }
        else {
            return 4
        }
    }


    const [PageIndexs, SetPageIndexs] = useState<PageIndexsType>({
        StartPage: 0,
        EndPage: getInitialEndPage()
    })


    useEffect(() => {
        const newEndPage = getInitialEndPage()
        SetPageIndexs(prev => ({
            ...prev,
            EndPage: newEndPage
        }))
    }, [width, height])

    return (
        <PageNationContext.Provider value={{
            StartPage: PageIndexs.StartPage,
            EndPage: PageIndexs.EndPage,
            SetPageIndexs
        }}>
            {children}
        </PageNationContext.Provider>
    )
}

export default PageNationProvider
