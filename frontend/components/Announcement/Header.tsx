import React, { useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { optionsforLanguages } from "@/lib/lan";
import { LanguageContext } from "@/context/Lan"
import useDidUserScroll from "@/hooks/useDidUserScroll"
import Link from "next/link";


export default function Header() {
    const router = useRouter()
    const { isScrolled } = useDidUserScroll()
    const { language, onSelectLanguage } = useContext(LanguageContext)

    return (
        <header
            className={`
                flex items-center justify-between transition-all duration-300
                ${isScrolled
                    ? 'fixed top-4 left-0 right-0 z-50 bg-white shadow-md pl-4 pr-4 w-[90%] rounded-md mx-auto'
                    : 'w-[85%] mx-auto pt-8'
                }
            `}
        >
            <Link
                href="/#announcements"
                className={`
                    relative transition-all duration-300
                    ${isScrolled
                        ? 'h-[50px] w-[180px] p-10 '
                        : 'h-[50px] w-[180px]'
                    }
                `}
            >
                <Image
                    alt="logo"
                    src="/Logo.png"
                    fill
                    className="cursor-pointer absolute object-contain"
                />
            </Link>

            <nav>
                <Select
                    onValueChange={(value) => {
                        onSelectLanguage(value);
                    }}
                    value={language}
                >
                    <SelectTrigger className="border  self-end bg-[#FFFFFF] rounded-lg font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent >
                        {optionsforLanguages.map((lan) => (
                            <SelectItem
                                key={lan.label}
                                value={lan.label}
                                className="font-medium "
                            >
                                {lan.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </nav>
        </header>
    );
}