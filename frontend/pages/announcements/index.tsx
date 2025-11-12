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
        <div className='flex flex-col w-[100vw] bg-[url(/Annoucementsbackgroundimage.png)]'>
            <Announcements QueryInput={QueryInput} />
        </div>
    )
}

export default Announcementspage
