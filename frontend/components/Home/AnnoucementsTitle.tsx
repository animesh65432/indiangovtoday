import React, { useContext } from 'react'
import { LanguageContext } from '@/context/Lan'
import { TranslateText } from '@/lib/translatetext'

type Props = {
    totalPages: number;
    page: number;
}

const AnnoucementsTitle: React.FC<Props> = ({ totalPages, page }) => {
    const { language } = useContext(LanguageContext)
    return (
        <div className=' hidden md:flex items-center gap-10  w-[85%] sm:w-full lg:w-[85%] mx-auto p-6'>
            <h2>{TranslateText[language].LATEST_ANNOUNCEMENTS}</h2>
            <span className='text-sm text-gray-800'>{TranslateText[language].PAGE} {page} {TranslateText[language].OF} {totalPages}</span>
        </div>
    )
}

export default AnnoucementsTitle