import React, { useContext } from 'react'
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import { Currentdate } from '@/context/Currentdate'
import { Button } from '../ui/button'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import {
    Select, SelectContent, SelectGroup,
    SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

type Props = {
    departmentOptions: string[]
    SetDeparmentsSelected: React.Dispatch<React.SetStateAction<string>>
}

const MobileSearchInput: React.FC<Props> = ({ departmentOptions, SetDeparmentsSelected }) => {
    const { language } = useContext(LanguageContext)
    const { onChangeStartDate, startdate, endDate, onChangeEndDate } = useContext(Currentdate)

    return (
        <div className="bg-white min-h-screen p-6">

            {/* Header */}
            <div className="flex items-center gap-3 mb-7">
                <div className="w-[3px] h-5 bg-[#FFD600] rounded-full" />
                <span className="text-[#111] text-xs font-semibold tracking-widest uppercase">
                    Filters
                </span>
            </div>

            <div className="flex flex-col gap-5">

                {/* Department */}
                <div className="flex flex-col gap-2">
                    <span className="text-[#999] text-[11px] font-semibold tracking-widest uppercase">
                        {TranslateText[language].DEPTARTMENT}
                    </span>
                    <Select onValueChange={(val) => SetDeparmentsSelected(val)}>
                        <SelectTrigger className="h-12 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl text-[#888] text-sm px-4 focus:ring-1 focus:ring-[#FFD600]">
                            <SelectValue placeholder={TranslateText[language].ALL_DEPARMENTS} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E8E8E8] z-[9999]">
                            <SelectGroup>
                                {departmentOptions.map((dept) => (
                                    <SelectItem
                                        key={dept}
                                        value={dept}
                                        className="hover:border-[#e2680a] "
                                        onSelect={() => SetDeparmentsSelected(dept)}
                                    >
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* State / Region */}
                <div className="flex flex-col gap-2">
                    <span className="text-[#999] text-[11px] font-semibold tracking-widest uppercase">
                        State / Region
                    </span>
                    <Select onValueChange={(val) => SetDeparmentsSelected(val)}>
                        <SelectTrigger className="h-12 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl text-[#888] text-sm px-4 focus:ring-1 focus:ring-[#FFD600]">
                            <SelectValue placeholder="All States" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E8E8E8] z-[9999]">
                            <SelectGroup>
                                {departmentOptions.map((dept) => (
                                    <SelectItem
                                        key={dept}
                                        value={dept}
                                        className="hover:border-[#e2680a] hover:text-black "
                                    >
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Date Range */}
                <div className="flex flex-col gap-2">
                    <span className="text-[#999] text-[11px] font-semibold tracking-widest uppercase">
                        Date Range
                    </span>
                    <div className="flex items-center gap-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="flex-1 h-12 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl text-[#888] text-sm font-normal justify-between px-4 hover:bg-[#EFEFEF] hover:border-[#e2680a]">
                                    {startdate ? format(startdate, "dd MMM yyyy") : "Start date"}
                                    <CalendarIcon size={14} className="text-[#111]" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[9999] bg-white border-[#E8E8E8]" align="start">
                                <Calendar
                                    mode="single"
                                    required={true}
                                    selected={startdate}
                                    onSelect={onChangeStartDate}
                                    defaultMonth={startdate}
                                />
                            </PopoverContent>
                        </Popover>

                        <div className="w-3 h-px bg-[#ccc] flex-shrink-0" />

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="flex-1 h-12 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl text-[#888] text-sm font-normal justify-between px-4 hover:bg-[#EFEFEF] hoverborder-[#e2680a]">
                                    {endDate ? format(endDate, "dd MMM yyyy") : "End date"}
                                    <CalendarIcon size={14} className="text-[#111]" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[9999] bg-white border-[#E8E8E8]" align="start">
                                <Calendar
                                    mode="single"
                                    required={true}
                                    selected={endDate}
                                    onSelect={onChangeEndDate}
                                    defaultMonth={endDate}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-2">
                    <Button className="flex-1 h-12 bg-white border border-[#E8E8E8] text-[#555] rounded-xl text-sm ">
                        Reset
                    </Button>
                    <Button className="flex-[2] h-12 bg-[#FEF3C7] border border-[#e2680a]  text-black font-semibold rounded-xl text-sm hover:bg-[#e6c200]">
                        Apply Filters
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default MobileSearchInput