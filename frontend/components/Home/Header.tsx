import React, { useContext } from 'react'
import Image from 'next/image'
import { Input } from '../ui/input'
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
import { CalendarIcon } from "lucide-react";
import { Currentdate } from "@/context/Currentdate"


const Header: React.FC = () => {
    const { date, Oncahngedate } = useContext(Currentdate)
    const { onSelectLanguage, language } = useContext(LanguageContext)

    return (
        <div className='flex flex-col gap-4 justify-center items-center'>
            <div className='flex w-full justify-center pt-[18px]'>
                <div className="relative w-[74vw] h-[22vh] sm:w-[55vw] sm:h-[20vh] md:w-[45vw] md:h-[25vh] lg:w-[506px] lg:h-[182px]">
                    <Image src="/IndianGovTodaylogo.png" alt='indiaGovt' fill />
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-4'>
                    <Input className='bg-white lg:w-[346px] lg:h-[44px] placeholder:text-[#4A3820]' placeholder='Search by...' />
                    <Button className='bg-[#E08E4B] hover:bg-[#dca374] lg:w-[121px] lg:h-[44px] hidden sm:block' >Search</Button>
                </div>

                <div className="flex gap-4 justify-center sm:justify-start w-[100%] sm:w-[70%] ">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                data-empty={!date}
                                className="text-[#4A3820] lg:w-[50%] justify-start text-left font-normal"
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
                        <SelectTrigger className="border bg-white p-2 font-light rounded-md  shadow-none text-[#4A3820] data-[placeholder]:text-[#4A3820] focus:ring-0 focus:outline-none">
                            <SelectValue className="" />
                        </SelectTrigger>
                        <SelectContent className="">
                            {optionsforLanguages.map((lan) => (
                                <SelectItem
                                    key={lan.label}
                                    value={lan.label}
                                    className="font-medium text-[#4A3820]"
                                >
                                    {lan.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button className='bg-[#E08E4B] hover:bg-[#dca374] lg:w-[121px] lg:h-[44px] block sm:hidden' >Search</Button>
        </div>
    )
}

export default Header