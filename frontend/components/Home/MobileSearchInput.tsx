import React, { useContext, useState } from 'react'
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
import { MultiSelect } from "@/components/ui/multi-select"
import { cn } from "@/lib/utils"

type Props = {
    departmentOptions: string[]
    categoryOptions: string[]
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>
    CategoriesSelected: string
    DeparmentsSelected: string
    StatesSelected: string[]
    onApply: (
        dept: string,
        category: string,
        states: string[],
        startDate: Date | null,
        endDate: Date | null
    ) => void
    onReset: () => void
}

const MobileSearchInput: React.FC<Props> = ({
    categoryOptions,
    DeparmentsSelected,
    CategoriesSelected,
    departmentOptions,
    StatesSelected,
    onApply,
    onReset,
}) => {
    const { language } = useContext(LanguageContext)
    const { startdate, endDate } = useContext(Currentdate)
    const [localDept, setLocalDept] = useState(DeparmentsSelected)
    const [localCategory, setLocalCategory] = useState(CategoriesSelected)
    const [localStates, setLocalStates] = useState<string[]>(StatesSelected)
    const [localStartDate, setLocalStartDate] = useState<Date | null>(startdate)
    const [localEndDate, setLocalEndDate] = useState<Date | null>(endDate)

    const stateOptions = TranslateText[language].MULTISELECT_OPTIONS

    const handleApply = () => {
        onApply(localDept, localCategory, localStates, localStartDate, localEndDate)
    }

    const handleReset = () => {
        setLocalDept("")
        setLocalCategory("")
        setLocalStates(StatesSelected)
        setLocalStartDate(startdate)
        setLocalEndDate(endDate)
        onReset()
    }

    return (
        <div className="bg-white min-h-screen p-6 mobile-filter-panel">

            {/* Header */}
            <div className="flex items-center gap-3 mb-7">
                <div className="w-0.75 h-5 bg-[#FFD600] rounded-full" />
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
                    <Select value={localDept} onValueChange={setLocalDept}>
                        <SelectTrigger className="h-12 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl text-[#888] text-sm px-4 focus:ring-1 focus:ring-[#FFD600]">
                            <SelectValue placeholder={TranslateText[language].ALL_DEPARMENTS} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E8E8E8] z-[9999]">
                            <SelectGroup>
                                {departmentOptions.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Types */}
                <div className="flex flex-col gap-2">
                    <span className="text-[#999] text-[11px] font-semibold tracking-widest uppercase">
                        Types
                    </span>
                    <Select value={localCategory} onValueChange={setLocalCategory}>
                        <SelectTrigger className="h-12 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl text-[#888] text-sm px-4 focus:ring-1 focus:ring-[#FFD600]">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E8E8E8] z-[9999]">
                            <SelectGroup>
                                {categoryOptions.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
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
                    <MultiSelect
                        options={stateOptions}
                        defaultValue={localStates}
                        onValueChange={setLocalStates}
                        placeholder="Select states"
                        maxCount={2}
                        mobile={true}
                        modalPopover={true}
                        searchable={true}
                        popoverClassName="z-[9999] border-[#E8E8E8]"
                        className={cn(
                            "min-h-12 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl",
                            "text-[#888] text-sm px-4",
                            "focus-within:ring-1 focus-within:ring-[#FFD600]",
                        )}
                    />
                </div>

                {/* Date Range */}
                <div className="flex flex-col gap-2">
                    <span className="text-[#999] text-[11px] font-semibold tracking-widest uppercase">
                        Date Range
                    </span>
                    <div className="flex items-center gap-3">

                        {/* Start Date */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="flex-1 h-12 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl text-[#888] text-sm font-normal justify-between px-4 hover:bg-[#EFEFEF] hover:border-[#e2680a]">
                                    {localStartDate ? format(localStartDate, "dd MMM yyyy") : "Start date"}
                                    <CalendarIcon size={14} className="text-[#111]" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[9999] bg-white border-[#E8E8E8]" align="start">
                                <Calendar
                                    mode="single"
                                    required={true}
                                    selected={localStartDate || undefined}
                                    onSelect={setLocalStartDate}
                                    defaultMonth={localStartDate ?? undefined}
                                />
                            </PopoverContent>
                        </Popover>

                        <div className="w-3 h-px bg-[#ccc] shrink-0" />

                        {/* End Date */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="flex-1 h-12 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl text-[#888] text-sm font-normal justify-between px-4 hover:bg-[#EFEFEF] hover:border-[#e2680a]">
                                    {localEndDate ? format(localEndDate, "dd MMM yyyy") : "End date"}
                                    <CalendarIcon size={14} className="text-[#111]" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[9999] bg-white border-[#E8E8E8]" align="start">
                                <Calendar
                                    mode="single"
                                    required={true}
                                    selected={localEndDate || undefined}
                                    onSelect={setLocalEndDate}
                                    defaultMonth={localEndDate ?? undefined}
                                />
                            </PopoverContent>
                        </Popover>

                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-2">
                    <Button
                        onClick={handleReset}
                        className="flex-1 h-12 bg-white border border-[#E8E8E8] text-[#555] rounded-xl text-sm hover:bg-[#F5F5F5]"
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="flex-2 h-12 bg-[#FEF3C7] border border-[#e2680a] text-black font-semibold rounded-xl text-sm hover:bg-[#FFD600]"
                    >
                        Apply Filters
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default MobileSearchInput