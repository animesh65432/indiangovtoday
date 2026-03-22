import React, { useContext, useState } from 'react'
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import { Currentdate } from '@/context/Currentdate'
import { Button } from '../ui/button'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, X } from "lucide-react"
import {
    Select, SelectContent, SelectGroup,
    SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { MultiSelect } from "../ui/multi-select"
import { formatDateInLanguage } from '@/lib/formatDate'


type Props = {
    categoryOptions: string[]
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>
    CategorySelected: string
    StatesSelected: string[]
    onApply: (
        dept: string,
        category: string,
        states: string[],
        startDate: Date | null,
        endDate: Date | null
    ) => void
    onReset: () => void,
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileSearchInput: React.FC<Props> = ({
    categoryOptions,
    CategorySelected,
    StatesSelected,
    onApply,
    onReset,
    setSheetOpen
}) => {
    const { language } = useContext(LanguageContext)
    const { startdate, endDate } = useContext(Currentdate)
    const [localCategory, setLocalCategory] = useState(CategorySelected)
    const [localStates, setLocalStates] = useState<string[]>(StatesSelected)
    const [localStartDate, setLocalStartDate] = useState<Date | null>(startdate)
    const [localEndDate, setLocalEndDate] = useState<Date | null>(endDate)

    const stateOptions = TranslateText[language].MULTISELECT_OPTIONS

    const handleApply = () => {
        onApply("", localCategory, localStates, localStartDate, localEndDate)
    }

    const handleReset = () => {
        setLocalCategory("")
        setLocalStates(StatesSelected)
        setLocalStartDate(startdate)
        setLocalEndDate(endDate)
        onReset()
    }

    return (
        <div className="bg-[#111111] min-h-screen p-6 mobile-filter-panel">

            {/* Header */}
            <div className='mt-20'>
                <div className="flex items-center justify-between mb-7 pt-4"> {/* pt-4 instead of mt-20 */}
                    <div className="flex items-center gap-3">
                        <div className="w-0.75 h-5 bg-[#FF9933] rounded-full" />
                        <span className="text-[#FF9933] font-satoshi text-xs font-semibold tracking-widest uppercase">
                            {TranslateText[language].FILTERS}
                        </span>
                    </div>
                    <button
                        onClick={() => setSheetOpen(false)}
                        className="text-[#FF9933] hover:text-white transition-colors p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-5">

                    {/* Types */}
                    <div className="flex flex-col gap-2">
                        <span className="text-[#FF9933] text-[11px] font-semibold tracking-widest uppercase">
                            {TranslateText[language].TYPES}
                        </span>
                        <Select
                            value={localCategory}
                            onValueChange={setLocalCategory}
                            defaultValue={TranslateText[language].ALL_DEPARMENTS}
                        >
                            <SelectTrigger className="h-12 text-white placeholder:text-white border border-[#FF9933] rounded-none text-sm px-4 ">
                                <SelectValue className='placeholder:font-satoshi font-satoshi' placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent className=" font-satoshi z-[9999] bg-[#1A1A1A] border border-[#FF9933]/30  ">
                                <SelectGroup>
                                    {categoryOptions.map((cat) => (
                                        <SelectItem key={cat} value={cat} className='font-satoshi text-[#EAEAEA] hover:bg-[#FF9933]/10 focus:bg-[#FF9933]/20 cursor-pointer'>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* State / Region */}
                    <div className="flex flex-col gap-2">
                        <span className="font-satoshi text-[11px] text-[#FF9933]  font-semibold tracking-widest uppercase">
                            {TranslateText[language].REGION}
                        </span>
                        <MultiSelect
                            options={stateOptions}
                            defaultValue={localStates}
                            onValueChange={setLocalStates}
                            placeholder="Select states"
                            maxCount={1}
                            mobile={true}
                            modalPopover={true}
                            searchable={true}
                            popoverClassName="z-[9999] border-[#FF9933]"
                            className='rounded-none '
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex flex-col gap-2">
                        <span className="font-satoshi text-[#FF9933]  text-[11px] font-semibold tracking-widest uppercase">
                            {TranslateText[language].DATE_RANGE}
                        </span>
                        <div className="flex items-center gap-3">

                            {/* Start Date */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="w-fit p-5 bg-[#1A1A1A] text-white border border-[#FF9933]  text-[11px] md:text-[12px]  font-satoshi   font-semibold rounded-none">
                                        {localStartDate ? formatDateInLanguage(localStartDate, "dd MMM yyyy") : "Start date"}
                                        <CalendarIcon size={14} className="text-[#FF9933]" />
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

                            <div className="w-3 h-px bg-[#FF9933] shrink-0" />

                            {/* End Date */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="w-fit p-5 bg-[#1A1A1A] text-white border border-[#FF9933]  text-[11px] md:text-[12px]  font-satoshi   font-semibold rounded-none">
                                        {localEndDate ? formatDateInLanguage(localEndDate, language) : "End date"}
                                        <CalendarIcon size={14} className="text-[#FF9933]" />
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
                            className="flex-1 w-fit p-5 bg-[#1A1A1A] text-white border border-[#FF9933]  text-[14px]  font-satoshi   font-semibold rounded-none"
                        >
                            {TranslateText[language].RESET}
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="flex-1 w-fit p-5 bg-[#1A1A1A] text-white border border-[#FF9933]  text-[14px]  font-satoshi   font-semibold rounded-none"
                        >
                            {TranslateText[language].APPLY_FILTERS}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MobileSearchInput