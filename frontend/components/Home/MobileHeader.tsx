import React from 'react'
import useDidUserScroll from "@/hooks/useDidUserScroll"
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { optionsforLanguages } from '@/lib/lan';
import { useContext } from 'react';
import { LanguageContext } from '@/context/Lan';
import { useRouter } from "next/router"

const MobileHeader: React.FC = () => {
    const { onSelectLanguage, language } = useContext(LanguageContext)
    const router = useRouter()
    const { isScrolled } = useDidUserScroll()

    if (!isScrolled) {
        return null
    }
    return (
        <header
            className={`
                flex md:hidden items-center justify-between transition-all duration-300
                ${isScrolled
                    ? 'fixed top-4 left-0 right-0 z-50 bg-white shadow-md w-[90%] p-2 rounded-md mx-auto'
                    : 'w-[85%] mx-auto '
                }
            `}
        >
            <nav
                className={`
                    relative transition-all duration-300
                    ${isScrolled
                        ? 'h-[8vh] w-[32vw] '
                        : 'h-[10vh] w-[32vw] sm:w-[vw] lg:h-[70px] lg:w-[230px] xl:h-[82px] xl:w-[265px]'
                    }
                `}
            >
                <Image
                    alt="logo"
                    src="/Logo.png"
                    fill
                    className="object-fill lg:object-contain cursor-pointer"
                    onClick={() => router.push("/")}
                />
            </nav>

            <nav>
                <Select
                    onValueChange={(value) => {
                        onSelectLanguage(value);
                    }}
                    value={language}
                >
                    <SelectTrigger className="border border-[#E0614B] self-end bg-[#FFFFFF] rounded-lg font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-[#E0614B]">
                        {optionsforLanguages.map((lan) => (
                            <SelectItem
                                key={lan.label}
                                value={lan.label}
                                className="font-medium hover:text-[#E0614B]"
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

export default MobileHeader