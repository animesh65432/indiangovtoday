import React, { useContext } from 'react'
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import { Currentdate } from '@/context/Currentdate'
import { Button } from '../ui/button'
import { X } from "lucide-react"
import { DateRangePicker } from '../ui/DateRangePicker'
import { Input } from '../ui/input'
import { Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "react-toastify"
import { ThemeContext } from '@/context/Theme'
import { optionsforLanguages } from '@/lib/lan'
import { cn } from '@/lib/utils'

type Props = {
    StatesSelected: string[]
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
    searchQuery: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    handleSearch: () => void;
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const MobileSearchInput: React.FC<Props> = ({
    StatesSelected,
    setSheetOpen,
    handleSearch,
    searchQuery,
    setSearchQuery,
    SetStatesSelected
}) => {
    const { language, onSelectLanguage } = useContext(LanguageContext)
    const { startdate, endDate, onChangeEndDate, onChangeStartDate } = useContext(Currentdate)
    const { theme, onChangeTheme } = useContext(ThemeContext)

    const isDark = theme === "dark"

    const handleApply = () => {
        handleSearch()
        if (StatesSelected.length === 0) {
            toast(TranslateText[language].NO_STATE_SELECTED, { type: "error" })
            return;
        }
        setSheetOpen(false)
    }

    return (
        <div className={`h-full p-6 mobile-filter-panel border-0 ${isDark ? "bg-black" : "bg-[#f7f2f2]"}`}>

            <div className='mt-20'>

                <div className="flex flex-col gap-5">
                    <div className="relative w-full">
                        {/* Search Icon */}
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c51057]" />

                        {/* Input */}
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={TranslateText[language].SEARCH_ANNOUNCEMENTS}
                            className="w-full pl-12 pr-12 py-5 rounded-2xl bg-white/90 border border-gray-200 text-[#321F1F] placeholder:text-[#321F1F]/60 placeholder:font-medium shadow-sm hover:shadow-md"
                        />

                    </div>

                    {/* Date Range */}
                    <div className="flex flex-col gap-2">
                        <span className={`font-literata ${isDark ? 'text-white/80' : ' text-[#321F1F]'} text-[11px] font-semibold tracking-widest uppercase`}>
                            {TranslateText[language].DATE_RANGE}
                        </span>
                        <div className="w-fit border boder-[#321F1F] bg-white">
                            <DateRangePicker
                                initialDateFrom={startdate}
                                initialDateTo={endDate}
                                onUpdate={({ range }) => {
                                    onChangeStartDate(range.from)
                                    if (range.to) {
                                        onChangeEndDate(range.to)
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className={`font-literata ${isDark ? 'text-white/80' : ' text-[#321F1F]'} text-[11px] font-semibold tracking-widest uppercase`}>
                            LANGUAGES
                        </span>
                        <div className="w-fit border boder-[#321F1F] ">
                            <Select value={language} onValueChange={onSelectLanguage}>
                                <SelectTrigger className={cn(
                                    'h-8 w-full rounded-none px-3',
                                    'text-[11px] font-medium font-satoshi',
                                    'transition-colors',
                                    isDark
                                        ? 'border border-white/15  text-white/80  '
                                        : ' bg-white text-black/80 '
                                )}>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>

                                <SelectContent className={cn(
                                    'shadow-xl z-[900]',
                                    isDark
                                        ? 'border border-white/15 bg-[#111111]'
                                        : 'border border-black/10 bg-white'
                                )}>
                                    {optionsforLanguages.map(({ label }) => (
                                        <SelectItem
                                            key={label}
                                            value={label}
                                            className={cn(
                                                'cursor-pointer rounded-lg text-[13px] font-satoshi',
                                                isDark
                                                    ? 'text-white/70 focus:bg-white/10 focus:text-white/90'
                                                    : 'text-black/70 focus:bg-[#050505]/5 focus:text-black/90'
                                            )}
                                        >
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className={`font-literata ${isDark ? 'text-white/80' : ' text-[#321F1F]'} text-[11px] font-semibold tracking-widest uppercase`}>
                            THEME
                        </span>
                        <div className="flex gap-2">
                            {(["light", "dark"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => onChangeTheme(t)}
                                    className={cn(
                                        "px-4 py-1.5 text-[12px] font-satoshi font-medium border capitalize transition-colors",
                                        theme === t
                                            ? "bg-[#c51057] text-white border-[#c51057]"
                                            : "bg-white text-[#321F1F] border-gray-200"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <Button
                            onClick={handleApply}
                            className="flex-1 w-fit p-5 bg-[#c51057] text-white   text-[14px]  font-satoshi   font-semibold rounded-none"
                        >
                            {TranslateText[language].SEARCH}
                        </Button>
                    </div>


                </div>
            </div>
        </div >
    )
}

export default MobileSearchInput