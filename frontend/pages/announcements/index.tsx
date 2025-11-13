"use client"
import React, { useEffect, useState } from 'react'
import Announcements from '@/components/Announcements'
import { useRouter } from 'next/router';
import { LoaderCircle } from "lucide-react"

const Announcementspage: React.FC = () => {
    const [QueryInput, SetQueryInput] = useState<string>("")
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
            <div className='flex flex-col items-center justify-center min-h-dvh w-[100vw] bg-[url(/Annoucementsbackgroundimage.png)]'>
                <LoaderCircle className='animate-spin h-8 w-8 text-black' />
            </div>
        )
    }

    return (
        <div className='flex flex-col min-h-dvh w-[100vw] bg-[url(/Annoucementsbackgroundimage.png)]'>
            <Announcements
                QueryInput={QueryInput}
                SetQueryInput={SetQueryInput}
            />
        </div>
    )
}

export default Announcementspage