import React, { useContext } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { LanguageContext } from '@/context/Lan'
import { TranslateText } from "@/lib/translatetext"

const Subscribe: React.FC = () => {
    const { language } = useContext(LanguageContext)
    return (
        <div className='bg-white w-full flex flex-col p-4 gap-5'>
            <div className='flex flex-col gap-2'>
                <h3 className='uppercase'>{TranslateText[language].STAY_INFORMED}</h3>
                <span className='uppercase text-[0.8rem]'>{TranslateText[language].DIRECT_NOTICE_TO_YOUR_INBOX}</span>
            </div>

            <Input
                type='email'
                placeholder={`${TranslateText[language].EMAIL_ADRESS}`}
                className='w-full  p-5 rounded-none border-b border-gray-300 placeholder:uppercase  '
            />

            <Button className='uppercase bg-yellow-600 text-black font-semibold'>{TranslateText[language].SUBSCRIBE_NOW}</Button>

        </div>
    )
}

export default Subscribe