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

const Header: React.FC = () => {
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


    console.log(isScrolled);

    return (
        <div
            className={`w-[95%] [@media(min-width:900px)]:w-[85vw] mx-auto pt-5 [@media(min-width:900px)]:pt-10 
  flex items-center justify-between transition-all duration-500 ease-in-out 
  ${isScrolled ? "opacity-0 -translate-y-10 pointer-events-none" : "opacity-100 translate-y-0"}`}
        >
            <div onClick={() => router.push("/")} className="relative  hidden sm:block h-[52px] sm:w-[168px] lg:h-[70px] lg:w-[230px] xl:h-[82px] xl:w-[265px]">
                <Image
                    alt="logo"
                    src="/Logo.png"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                <DateRangePicker
                    onUpdate={OnChangeDateRangePicker}
                    initialDateFrom={startdate}
                    initialDateTo={endDate}
                    align="start"
                    locale="en-GB"
                    showCompare={false}
                />

                <Select
                    onValueChange={onSelectLanguage}
                    value={language}
                >
                    <SelectTrigger className="border border-[#E0614B] bg-white rounded-lg text-[#E0614B] font-medium shadow-[4px_4px_0_0_#00000029] focus:ring-0 focus:outline-none min-w-[100px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className="text-[#E0614B]">
                        {optionsforLanguages.map((lan) => (
                            <SelectItem key={lan.label} value={lan.label} className="hover:text-[#E0614B]">
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
