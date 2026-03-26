import React, { useContext, useState } from 'react'
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import { Currentdate } from '@/context/Currentdate'
import { Button } from '../ui/button'
import { X } from "lucide-react"
import { MultiSelect } from "../ui/multi-select"
import { DateRangePicker } from '../ui/DateRangePicker'
import { Input } from '../ui/input'
import { Search } from "lucide-react"

type Props = {
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
    searchQuery: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

const MobileSearchInput: React.FC<Props> = ({
    StatesSelected,
    onApply,
    onReset,
    setSheetOpen
}) => {
    const { language } = useContext(LanguageContext)
    const { startdate, endDate } = useContext(Currentdate)
    const [localStates, setLocalStates] = useState<string[]>(StatesSelected)
    const [localStartDate, setLocalStartDate] = useState<Date>(startdate)
    const [localEndDate, setLocalEndDate] = useState<Date>(endDate)
    const [LocalserchQuery, setLocalSearchQuery] = useState<string>("")
    const stateOptions = TranslateText[language].MULTISELECT_OPTIONS

    const handleApply = () => {
        onApply("", "", localStates, localStartDate, localEndDate)
    }

    const handleReset = () => {
        setLocalStates(StatesSelected)
        setLocalStartDate(startdate)
        setLocalEndDate(endDate)
        onReset()
    }

    function onChangeStartDate(from: Date) {
        throw new Error('Function not implemented.')
    }

    function onChangeEndDate(to: Date) {
        throw new Error('Function not implemented.')
    }

    return (
        <div className="bg-[#f7f2f2] h-dvh p-6 mobile-filter-panel">

            {/* Header */}
            <div className='mt-20'>
                <div className="flex items-center justify-between mb-7 pt-4"> {/* pt-4 instead of mt-20 */}
                    <div className="flex items-center gap-3">
                        <div className="w-0.75 h-5 bg-[#321F1F] rounded-full" />
                        <span className="text-color font-literata text-xs font-semibold tracking-widest uppercase">
                            {TranslateText[language].FILTERS}
                        </span>
                    </div>
                    <button
                        onClick={() => setSheetOpen(false)}
                        className="text-[#ff3333] transition-colors p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="relative w-full">
                        {/* Search Icon */}
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff3333]" />

                        {/* Input */}
                        <Input
                            value={LocalserchQuery}
                            onChange={(e) => setLocalSearchQuery(e.target.value)}
                            placeholder={TranslateText[language].SEARCH_ANNOUNCEMENTS}
                            className="w-full pl-12 pr-12 py-5 rounded-2xl bg-white/90 border border-gray-200 text-[#321F1F] placeholder:text-[#321F1F]/60 placeholder:font-medium shadow-sm hover:shadow-md"
                        />

                    </div>

                    {/* State / Region */}
                    <div className="flex flex-col gap-2">
                        <span className="font-literata text-[11px] text-[#321F1F]  font-semibold tracking-widest uppercase">
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
                            popoverClassName="z-[9999]"
                            className='rounded-none '
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex flex-col gap-2">
                        <span className="font-literata text-[#321F1F]  text-[11px] font-semibold tracking-widest uppercase">
                            {TranslateText[language].DATE_RANGE}
                        </span>
                        <div className="w-fit border boder-[#321F1F] bg-white">
                            <DateRangePicker
                                initialDateFrom={localStartDate}
                                initialDateTo={localEndDate}
                                onUpdate={({ range }) => {
                                    setLocalStartDate(range.from)
                                    if (range.to) {
                                        setLocalEndDate(range.to)
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-2">
                        <Button
                            onClick={handleReset}
                            className="flex-1 w-fit p-5 bg-[#ff3333] text-white   text-[14px]  font-satoshi   font-semibold rounded-none"
                        >
                            {TranslateText[language].RESET}
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="flex-1 w-fit p-5 bg-[#ff3333] text-white   text-[14px]  font-satoshi   font-semibold rounded-none"
                        >
                            {TranslateText[language].APPLY_FILTERS}
                        </Button>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default MobileSearchInput