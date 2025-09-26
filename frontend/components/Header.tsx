import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { optionsforLanguages } from "@/lib/lan";
import { UseLanguageContext } from "@/context/Lan";
import { useRouter } from "next/router";

export default function Header() {
    const languageContext = UseLanguageContext();
    const router = useRouter()
    const [isHome, setIsHome] = useState(false);

    if (!languageContext) {
        return null;
    }

    useEffect(() => {
        setIsHome(router.pathname === "/");
    }, [router.pathname]);

    const { onSelectLanguage, language } = languageContext;

    return (
        <header className="flex h-[10vh] items-center justify-between w-[85%] mx-auto pt-7">
            <h1 className="text-2xl lg:text-4xl text-[#168b5d]" onClick={() => router.push("/")}>
                IndianGovToday
            </h1>
            {isHome &&
                <ul>
                    <Select
                        onValueChange={(value) => {
                            onSelectLanguage(value);
                        }}
                        value={language}
                    >
                        <SelectTrigger className="border border-white p-1 font-light rounded focus:border-[#353535] shadow-none text-[#353535] data-[placeholder]:text-[#353535] focus:ring-0 focus:outline-none">
                            <SelectValue className="text-[#168b5d]" />
                        </SelectTrigger>
                        <SelectContent className="text-[#168b5d]">
                            {optionsforLanguages.map((lan) => (
                                <SelectItem
                                    key={lan.label}
                                    value={lan.label}
                                    className="text-[#168b5d] font-medium "
                                >
                                    {lan.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </ul>
            }
        </header>
    );
}
