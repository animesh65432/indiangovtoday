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
        <header className='h-16 flex items-center justify-between w-[98%] mx-auto mt-4 px-2'>

            {/* Logo */}
            <nav className='flex items-center'>
                <Logo />
            </nav>

            {/* Language Selector */}
            <nav>
                <Select
                    onValueChange={onSelectLanguage}
                    value={language}
                >
                    <SelectTrigger
                        IsLanguageSelect={true}
                        className="
                        text-[#EAEAEA]
                        bg-[#1A1A1A] 
                        backdrop-blur-md
                        border border-[#FF9933]/30
                        uppercase text-[0.65rem]
                        font-inter font-semibold tracking-wider
                        rounded-md
                        px-3 py-2

                        hover:border-[#FF9933]
                        hover:bg-[#1A1A1A]
                        transition-all duration-200

                        focus:ring-1 focus:ring-[#FF9933]
                    "
                    >
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>

                    <SelectContent className='z-50 bg-[#1A1A1A]  border border-[#FF9933]/30 rounded-md'>
                        {optionsforLanguages.map((lan) => (
                            <SelectItem
                                key={lan.label}
                                value={lan.label}
                                className="
                                font-satoshi
                                text-[#EAEAEA]
                                hover:bg-[#FF9933]/10
                                focus:bg-[#FF9933]/20
                                cursor-pointer
                            "
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