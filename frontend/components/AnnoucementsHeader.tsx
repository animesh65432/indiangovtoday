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
import { TranslateText } from '@/lib/translatetext';
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

const AnnoucementsHeader: React.FC = () => {
    const { language, onSelectLanguage } = useContext(LanguageContext)

    return (
        <header className='h-14 flex items-center justify-between  w-[97%] mx-auto mt-2'>
            <nav className='flex flex-col gap-1'>
                <span className='text-[1.3rem] font-poppins  font-bold  text-black'>
                    IndanGovtToday
                </span>
                <span className='font-poppins text-xs uppercase text-[#aaaaaa] font-medium'>
                    <TextGenerateEffect words={TranslateText[language].DIRECT_ACCESS_TO_VERIFIED_GOVT_CIRCULARS} />
                </span>
            </nav>
            <nav>
                <Select
                    onValueChange={onSelectLanguage}
                    value={language}
                >
                    <SelectTrigger
                        IsLanguageSelect={true}
                        className="text-[#555555] bg-[#FBF7F2] uppercase text-[0.7rem] font-inter  rounded-md font-semibold"
                    >
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className='z-999' >
                        {optionsforLanguages.map((lan) => (
                            <SelectItem key={lan.label} value={lan.label} className='font-poppins hover:bg-amber-100'>
                                {lan.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </nav>
        </header >
    )
}

export default AnnoucementsHeader