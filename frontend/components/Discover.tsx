import React, { useContext } from 'react'
import { Button } from './ui/button'
import { useRouter } from "next/router"
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
const Discover: React.FC = () => {
    const router = useRouter()
    const { language } = useContext(LanguageContext)
    return (
        <div className='min-w-[250px]  border rounded-lg h-[30vh] p-6 hidden lg:flex flex-col justify-between '>
            <div className='text-lg font-semibold flex flex-col'>
                <span className='text-gray-600'>{TranslateText[language].DISCOVER_MORE}</span>
                <span className='text-[#E0614B]'>{TranslateText[language].INDIAN_ANNOUNCEMENTS}</span>
            </div>
            <Button onClick={() => router.push("/announcements")} className='bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'>
                {TranslateText[language].SEE_MORE}
            </Button>
        </div>
    )
}

export default Discover