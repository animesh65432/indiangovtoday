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
import Logo from './ui/Logo';

const AnnoucementsHeader: React.FC = () => {
    const { language, onSelectLanguage } = useContext(LanguageContext)

    return (
        <header className='h-14 flex items-center justify-between w-[90%] mx-auto mt-2'>
            <nav className='flex flex-col gap-0.5'>
                <Logo />
            </nav>

            <nav>
                <Select
                    onValueChange={onSelectLanguage}
                    value={language}
                >
                    <SelectTrigger
                        IsLanguageSelect={true}
                        className="
                        text-[#2D4870]
                        bg-white/50
                        backdrop-blur-sm
                        border border-[#a8c0e0]/40
                        uppercase text-[0.65rem]
                        font-inter font-semibold tracking-wider
                        rounded-md
                        hover:bg-white/70
                        transition-all duration-200
                    "
                    >
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className='z-999 border-[#a8c0e0]/30'>
                        {optionsforLanguages.map((lan) => (
                            <SelectItem
                                key={lan.label}
                                value={lan.label}
                                className='font-inter text-[#1B3A7A] hover:bg-[#dce8f5] focus:bg-[#dce8f5]'
                            >
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