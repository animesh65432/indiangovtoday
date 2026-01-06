"use client"
import React, { useEffect, useState } from 'react'
import Announcements from '@/components/Announcements'
import { useRouter } from 'next/router';
import { LoaderCircle } from "lucide-react"

const Announcementspage: React.FC = () => {
    const [QueryInput, SetQueryInput] = useState<string>("")
    const [previousSearchInput, SetPreviousSearchInput] = useState<string>("")
    const [isReady, setIsReady] = useState(false)
    const router = useRouter();
    const { SearchInput } = router.query as { SearchInput: string }

    useEffect(() => {
        if (router.isReady) {
            if (SearchInput) {
                SetQueryInput(SearchInput)
            }
            setIsReady(true)
        }
    }, [router.isReady, SearchInput])

    if (!isReady) {
        return (
            <div className='flex flex-col bg-[#E6E6E6] items-center justify-center min-h-dvh w-[100vw] '>
                <LoaderCircle className='animate-spin h-8 w-8 text-black' />
            </div>
        )
    }

    return (
        <div className='flex flex-col min-h-dvh w-[100vw] bg-[#E6E6E6]'>
            <Announcements
                QueryInput={QueryInput}
                SetQueryInput={SetQueryInput}
                previousSearchInput={previousSearchInput}
                SetPreviousSearchInput={SetPreviousSearchInput}
            />
        </div>
    )
}

export default Announcementspage