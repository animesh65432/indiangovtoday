import React, { useContext } from 'react'
import { Input } from '../ui/input'
import { Search } from "lucide-react"
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"

const MobileSearchInput: React.FC = () => {
    const { language } = useContext(LanguageContext)

    return (
        <div className='bg-[#1C3257] block md:hidden p-4'>
            <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                </div>
                <Input
                    className='bg-white p-5 pl-10 '
                    placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                />
            </div>
        </div>
    )
}

export default MobileSearchInput