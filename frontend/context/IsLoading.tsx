"use client"

import React from 'react'
import { createContext, useState } from 'react'

type IsLoadingContextType = {
    IsLoading: boolean
    SetIsLoading: (val: boolean) => void
}

export const IsLoadingContext = createContext<IsLoadingContextType>({
    IsLoading: false,
    SetIsLoading: () => { }
})

type Props = {
    children: React.ReactNode
}

const IsLoadingProvider: React.FC<Props> = ({ children }) => {
    const [loadingCount, setLoadingCount] = useState(0);

    const IsLoading = loadingCount > 0;

    const SetIsLoading = (val: boolean) => {
        setLoadingCount(prev => val ? prev + 1 : Math.max(0, prev - 1));
    };

    return (
        <IsLoadingContext.Provider value={{ IsLoading, SetIsLoading }}>
            {children}
        </IsLoadingContext.Provider>
    )
}

export default IsLoadingProvider