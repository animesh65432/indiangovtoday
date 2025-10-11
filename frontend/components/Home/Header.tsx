import React, { useContext, useState } from 'react'
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
import { MenuIcon } from "lucide-react";
import { Currentdate } from "@/context/Currentdate"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { DateRangePicker } from "@/components/ui/DateRangePicker"


const Header: React.FC = () => {
    const { startdate, endDate, onChangeDate } = useContext(Currentdate)
    const { onSelectLanguage, language } = useContext(LanguageContext)

    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
        }
    };

    return (
        <div className='w-[85vw] mx-auto pt-10 flex items-center  justify-between '>
            <div className="relative h-[10vh] w-[43vw] sm:w-[32vw] lg:h-[70px] lg:w-[230px] xl:h-[82px] xl:w-[265px]">
                <Image
                    alt="logo"
                    src="/Logo.png"
                    fill
                    className=" object-fill lg:object-contain"
                />
            </div>

            <div className="hidden md:flex gap-4  ">
                <DateRangePicker
                    onUpdate={OnChangeDateRangePicker}
                    initialDateFrom={startdate}
                    initialDateTo={endDate}
                    align="start"
                    locale="en-GB"
                    showCompare={false}
                />

                <ul>
                    <Select
                        onValueChange={(value) => {
                            onSelectLanguage(value);
                        }}
                        value={language}
                    >
                        <SelectTrigger className="border border-[#E0614B]  bg-[#FFFFFF] rounded-lg  p-[6px] font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
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
                </ul>
            </div>
            <div className='block md:hidden'>
                <Sheet>
                    <SheetTrigger className=''>
                        <MenuIcon className='text-[#ffff] font-extrabold h-8 w-10 z-20' />
                    </SheetTrigger>
                    <SheetContent className='pt-20'>

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
                            <SelectTrigger className="border border-[#E0614B] w-[180px] mx-auto bg-[#FFFFFF] rounded-lg  p-[6px] font-light shadow-none text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
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
                    </SheetContent>
                </Sheet>
            </div>


        </div>


    )
}

export default Header