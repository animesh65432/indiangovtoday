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
import { Currentdate } from "@/context/Currentdate"
import { DateRangePicker } from "@/components/ui/DateRangePicker"
import { useRouter } from "next/router"
import useDidUserScroll from "@/hooks/useDidUserScroll"

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

    return (
        <div
            className={`w-[95%] [@media(min-width:900px)]:w-[85vw] mx-auto pt-5 [@media(min-width:900px)]:pt-10 
  flex items-center justify-between transition-all duration-500 ease-in-out 
  ${isScrolled
                    ? "opacity-0 -translate-y-10 scale-95 h-0 overflow-hidden py-0"
                    : "opacity-100 translate-y-0 scale-100 h-auto py-5"
                }`}
        >
            <div onClick={() => router.push("/")} className="relative  hidden sm:block h-[52px] sm:w-[168px] lg:h-[70px] lg:w-[230px] xl:h-[82px] xl:w-[265px]">
                <Image
                    alt="logo"
                    src="/Logo.png"
                    fill
                    className=" object-fill lg:object-contain"
                />
            </div>

            <div className="hidden sm:flex  flex-col  [@media(min-width:900px)]:flex-row gap-4 pt-5 [@media(min-width:900px)]:pt-0 ">
                <DateRangePicker
                    onUpdate={OnChangeDateRangePicker}
                    initialDateFrom={startdate}
                    initialDateTo={endDate}
                    align="start"
                    locale="en-GB"
                    showCompare={false}
                />

                <Select
                    onValueChange={(value) => {
                        onSelectLanguage(value);
                    }}
                    value={language}
                >
                    <SelectTrigger className="border border-[#E0614B] self-end  bg-[#FFFFFF] rounded-lg   font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
                        <SelectValue className="" />
                    </SelectTrigger>
                    <SelectContent className="text-[#E0614B]">
                        {optionsforLanguages.map((lan) => (
                            <SelectItem
                                key={lan.label}
                                value={lan.label}
                                className="font-medium hover:text-[#E0614B] "
                            >
                                {lan.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>


    )
}

export default Header