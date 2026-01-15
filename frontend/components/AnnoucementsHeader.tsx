import React, { useContext } from 'react'
import { LanguageContext } from "@/context/Lan";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { optionsforLanguages } from "@/lib/lan"


const AnnoucementsHeader: React.FC = () => {
    const { language, onSelectLanguage } = useContext(LanguageContext)

    return (
        <header className='h-14  flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 border-b bg-[#1C3257]'>
            <nav></nav>
            <nav>
                <Select
                    onValueChange={onSelectLanguage}
                    value={language}
                >
                    <SelectTrigger
                        IsLanguageSelect={true}
                        className="border-0 text-[#1C3257] uppercase text-[0.8rem] bg-white font-poppins  rounded-none font-bold"
                    >
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {optionsforLanguages.map((lan) => (
                            <SelectItem key={lan.label} value={lan.label} className='font-medium'>
                                {lan.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </nav>
        </header>
    )
}

export default AnnoucementsHeader