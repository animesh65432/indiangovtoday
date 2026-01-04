import React, { useContext } from 'react'
import Image from 'next/image'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { optionsforLanguages } from "@/lib/lan";
import { LanguageContext } from "@/context/Lan";
import { Currentdate } from "@/context/Currentdate";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { useRouter } from "next/router";
import useDidUserScroll from "@/hooks/useDidUserScroll";

type Props = {
    IsHeroSection?: boolean
}

const Header: React.FC<Props> = ({ IsHeroSection = false }) => {
    const { startdate, endDate, onChangeDate } = useContext(Currentdate)
    const { onSelectLanguage, language } = useContext(LanguageContext)
    const { isScrolled } = useDidUserScroll()
    const router = useRouter()

    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
        }
    };

    const scrollClassName = isScrolled
        ? "opacity-0 -translate-y-10 scale-95 h-0 overflow-hidden py-0"
        : "opacity-100 translate-y-0 scale-100 h-[10vh] py-5 pt-8";

    const flexClassName = IsHeroSection ? "flex" : "hidden sm:flex";

    const ImgClassName = IsHeroSection ? "" : "hidden sm:block";


    return (
        <div
            className={` w-[85%] sm:w-[95%] ${flexClassName} [@media(min-width:900px)]:w-[85vw] mx-auto pt-2
   items-center justify-between transition-all duration-500 ease-in-out ${IsHeroSection ? "" : scrollClassName}`}
        >
            <div onClick={() => router.push("/")} className={`relative cursor-pointer ${ImgClassName} h-[140px] w-[140px]`}>
                <Image
                    alt="logo"
                    src="/Logo.png"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                {!IsHeroSection && (
                    <DateRangePicker
                        onUpdate={OnChangeDateRangePicker}
                        initialDateFrom={startdate}
                        initialDateTo={endDate}
                        align="start"
                        locale="en-GB"
                        showCompare={false}
                    />
                )}

                <Select
                    onValueChange={onSelectLanguage}
                    value={language}
                >
                    <SelectTrigger className="border border-[#272626] bg-white rounded-lg font-medium shadow-[4px_4px_0_0_#00000029] focus:ring-0 focus:outline-none min-w-[100px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {optionsforLanguages.map((lan) => (
                            <SelectItem key={lan.label} value={lan.label}>
                                {lan.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default Header;