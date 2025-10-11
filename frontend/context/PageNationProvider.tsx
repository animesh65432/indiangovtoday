import React, { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react'

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
    EndPage: 10,
    SetPageIndexs: () => { }
})

type Props = {
    children: ReactNode
}

export const PageNationProvider = ({ children }: Props) => {
    const [PageIndexs, SetPageIndexs] = useState<PageIndexsType>({
        StartPage: 0,
        EndPage: 10
    })

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