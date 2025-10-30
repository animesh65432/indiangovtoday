"use client"
import React, { useEffect, useState } from 'react'
import Announcements from '@/components/Announcements'
import { useRouter } from 'next/router';

const Announcementspage: React.FC = () => {
    const [QueryInput, SetQueryInput] = useState<string>("")
    const router = useRouter();
    const { SearchInput } = router.query as { SearchInput: string }

    useEffect(() => {
        if (SearchInput) {
            SetQueryInput(SearchInput)
        }
    }, [SearchInput])

    return (
        <div className='bg-[#FFFFFF] flex flex-col h-[100vh] w-[100vw] '>
            <Announcements QueryInput={QueryInput} />
        </div>
    )
}

export default Announcementspage
