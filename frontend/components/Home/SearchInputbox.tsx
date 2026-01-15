import React, { useContext, useState, useEffect } from 'react'
import { ChevronDownIcon, Search } from "lucide-react"
import { LanguageContext } from "@/context/Lan"
import { Input } from "@/components/ui/input"
import {
    Select, SelectContent,
    SelectLabel, SelectItem, SelectGroup,
    SelectTrigger, SelectValue
} from "@/components/ui/select"
import { TranslateText } from "@/lib/translatetext"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Currentdate } from '@/context/Currentdate'
import { Button } from '../ui/button'
import { MultiSelect } from "@/components/ui/multi-select"
import { GetallAnnoucementsDepartments } from "@/api/announcements"

type Props = {
    StatesSelected: string[],
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>,
    DeparmentsSelected: string[],
    SetDeparmentsSelected: React.Dispatch<React.SetStateAction<string[]>>
}


const SerchInputbox: React.FC<Props> = ({ SetStatesSelected, StatesSelected, DeparmentsSelected, SetDeparmentsSelected }) => {
    const [startopen, setstartOpen] = useState(false);
    const [endopen, setendOpen] = useState(false);
    const [DeparmentsOptions, setDeparmentsOptions] = useState<string[]>([])
    const { language } = useContext(LanguageContext)
    const { onChangeDate, startdate, endDate } = useContext(Currentdate);

    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
        }
    };

    const fetchDeparmentsOptions = async () => {
        try {
            const response = await GetallAnnoucementsDepartments(
                language,
                startdate,
                endDate,
                StatesSelected
            ) as { data: string[] };

            setDeparmentsOptions(response.data);

        } finally {
            setDeparmentsOptions([]);
        }
    }

    useEffect(() => {
        fetchDeparmentsOptions();
    }, [language, StatesSelected])

    return (
        <nav className='p-5 flex flex-col gap-5 bg-white'>
            <ul className=' flex flex-col gap-1'>
                <h2 className='uppercase'>public notification</h2>
                <span className='uppercase text-[0.9rem]'>Direct Access to Verified Government Circulars</span>
            </ul>
            <ul className='border border-slate-200 bg-white w-full p-5 flex flex-col gap-4'>
                <ul className='flex justify-between items-center'>
                    <li className="relative w-[80%]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            className="w-full placeholder:uppercase pl-9 pt-5 pb-5 rounded-none bg-slate-100 focus-visible:ring-0"
                            placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                        />
                    </li>
                </ul>
                <ul className='flex gap-4 items-center'>
                    <li>
                        <MultiSelect
                            options={TranslateText[language].MULTISELECT_OPTIONS}
                            onValueChange={SetStatesSelected}
                            defaultValue={StatesSelected}
                            className='rounded-none uppercase  text-black [&_*]:text-black [&_*]:font-semibold'
                            placeholder='Select Regions'
                        />
                    </li>
                    <Select>
                        <SelectTrigger className="w-fit rounded-none bg-slate-100 focus-visible:ring-0">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                    </Select>
                    <Popover open={startopen} onOpenChange={setstartOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                            >
                                {/* {date ? date.toLocaleDateString() : "Select date"} */}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                            // selected={date}
                            // captionLayout="dropdown"
                            // onSelect={(date) => {
                            //     setDate(date)
                            //     setOpen(false)
                            // }}
                            />
                        </PopoverContent>
                    </Popover>
                    <Popover open={startopen} onOpenChange={setstartOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                            >
                                {/* {date ? date.toLocaleDateString() : "Select date"} */}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                            // selected={date}
                            // captionLayout="dropdown"
                            // onSelect={(date) => {
                            //     setDate(date)
                            //     setOpen(false)
                            // }}
                            />
                        </PopoverContent>
                    </Popover>
                </ul>
            </ul>
        </nav>
    )
}

export default SerchInputbox