import React, { useContext } from 'react'
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
import Header from './Header'
import { Button } from '../ui/button'
import { Cannabis } from "lucide-react"
import useDidUserScroll from '@/hooks/useDidUserScroll'


const HeroSection: React.FC = () => {
    const { language } = useContext(LanguageContext)
    const { isScrolled } = useDidUserScroll()
    return (
        <div className="relative bg-[url('/IndiaGovt.jpg')] h-[100vh] bg-cover bg-center flex flex-col gap-5 sm:gap-10">
            <div className="absolute inset-0 bg-black/35"></div>
            <div className="relative z-10 ">
                <Header
                    IsHeroSection={true}
                    isScrolled={isScrolled}
                />
            </div>
            <div className='w-[65%] mx-auto flex flex-col items-center mt-[3%] sm:mt-[8%]  gap-4 relative z-10 flex-1'>
                <div className='flex gap-4 '>
                    <div className='w-2 bg-white'></div>
                    <div>
                        <h1 className='text-white '>
                            {TranslateText[language as keyof typeof TranslateText].ALL_GOVERNMENT_ANNOUNCEMENTS_IN_ONE_PLACE}
                        </h1>
                        <p className='text-[#e2dbdb]'>
                            {TranslateText[language as keyof typeof TranslateText].DESCRIPTION}
                        </p>
                    </div>
                </div>
                <a href='#announcements'>
                    <Button className='pb-5 pt-5  flex items-center' >
                        <Cannabis />
                        {TranslateText[language as keyof typeof TranslateText].SEE_ANNOUNCEMENTS}
                    </Button>
                </a>
            </div>
        </div>
    )
}

export default HeroSection