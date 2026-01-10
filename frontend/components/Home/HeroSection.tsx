import React, { useContext } from 'react'
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
import { Button } from '../ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from 'next/image'
import { optionsforLanguages } from '@/lib/lan';
import { TextGenerateEffect } from "../ui/text-generate-effect"


const HeroSection: React.FC = () => {
    const { onSelectLanguage, language } = useContext(LanguageContext)
    return (
        <div className="hero-bg h-[100vh] bg-cover bg-center flex flex-col justify-center items-center ">
            <div className=' w-[90%] sm:w-[65%] mx-auto flex flex-col gap-5 items-center text-center'>
                <div className='relative w-[250px] sm:w-[302px] h-[64px] mx-auto'>
                    <Image
                        src="/Icon.png"
                        alt="Logo"
                        fill
                        className='absolute object-fill'
                    />
                </div>

                <h1 className='text-white'>
                    <TextGenerateEffect words={TranslateText[language].TITLE} />
                </h1>
                <p className='text-[#e2dbdb]'>
                    {TranslateText[language].DESCRIPTION}
                </p>
                <div className='flex flex-col gap-4 items-center'>
                    <a href='#announcements'>
                        <Button className='pb-5 pt-5 border border-transparent hover:border-white uppercase shadow-[4px_4px_8px_0px_#FFFFFF40] rounded-none text-[#FFFFFF] flex items-center bg-[#E04B4D] hover:bg-[#E04B4D] transition-all duration-200'>
                            {TranslateText[language].EXPLORE_ANNOUNCEMENTS}
                        </Button>
                    </a>
                    <Select
                        onValueChange={onSelectLanguage}
                        value={language}
                    >
                        <SelectTrigger className="border font-poppins border-[#ffff] text-[#ffff] bg-transparent rounded-none font-medium shadow-[4px_4px_0_0_#00000029] focus:ring-0 focus:outline-none min-w-[100px]">
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
                </div>
            </div>
        </div >
    )
}

export default HeroSection