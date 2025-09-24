import React, { useContext } from "react";
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

    if (!languageContext) {
        return null;
    }

    const { onSelectLanguage, language } = languageContext;

    return (
        <header className="flex h-[10vh] items-center justify-between w-[85%] mx-auto pt-7">
            <h1 className="text-2xl lg:text-4xl text-[#168b5d]" onClick={() => router.push("/")}>
                IndianGovToday
            </h1>
            <ul>
                <Select
                    onValueChange={(value) => {
                        onSelectLanguage(value);
                    }}
                    value={language}
                >
                    <SelectTrigger className="border border-[#b8b6b6] p-1 font-light rounded focus:border-[#353535] shadow-none text-[#353535] data-[placeholder]:text-[#353535] focus:ring-0 focus:outline-none">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-[#353535]">
                        {optionsforLanguages.map((lan) => (
                            <SelectItem
                                key={lan.label}
                                value={lan.label}
                                className="text-[#353535] font-medium focus:bg-gray-100"
                            >
                                {lan.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </ul>
        </header>
    );
}
