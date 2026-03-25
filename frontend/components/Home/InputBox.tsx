import React from 'react'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TranslateText } from '@/lib/translatetext'
import { LanguageContext } from '@/context/Lan'
import { Button } from '../ui/button'

const InputBox = () => {
    const { language } = React.useContext(LanguageContext)
    return (
        <div className="w-full px-4 sm:px-6 md:px-0">
            <div className='flex'>
                <div className="relative w-full max-w-xl md:max-w-2xl mx-auto">
                    <Search className="absolute text-[#ff3333] z-10 left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                        type="text"
                        placeholder={TranslateText[language].SEARCH_ANNOUNCEMENTS}
                        className="w-full text-[1rem]  text-[#321F1F] placeholder:text-[#321F1F]  placeholder:font-satoshi placeholder:font-semibold pl-10 sm:pl-12 pr-4 py-5 sm:py-6  bg-white/90 border border-gray-200 rounded-xl sm:rounded-2xl shadow-md focus:ring-2 focus:ring-[#321F1F] focus:border-transparent font-satoshi"
                    />
                </div>
            </div>
        </div>
    )
}

export default InputBox