import React, { useContext } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { format } from "date-fns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { optionsforLanguages } from "@/lib/lan";
import { LanguageContext } from "@/context/Lan";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, MenuIcon } from "lucide-react";
import { Currentdate } from "@/context/Currentdate"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"


const Header: React.FC = () => {
    const { date, Oncahngedate } = useContext(Currentdate)
    const { onSelectLanguage, language } = useContext(LanguageContext)

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
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            data-empty={!date}
                            className="text-[#E0614B] shadow-[4px_4px_0_0_#00000029] bg-[#FFFFFF]  rounded-lg justify-start text-left font-normal border border-[#E0614B]"
                        >
                            <CalendarIcon />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={Oncahngedate}
                            required
                        />
                    </PopoverContent>
                </Popover>
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
                        <MenuIcon className='text-[#E0614B] font-bold h-8 w-10 z-10' />
                    </SheetTrigger>
                    <SheetContent className='p-10'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    data-empty={!date}
                                    className="text-[#E0614B] w-[180px] mx-auto bg-[#FFFFFF] rounded-lg justify-start text-left font-normal border border-[#E0614B]"
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={Oncahngedate}
                                    required
                                />
                            </PopoverContent>
                        </Popover>

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