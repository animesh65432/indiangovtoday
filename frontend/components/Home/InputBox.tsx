import React, { useContext } from 'react'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TranslateText } from '@/lib/translatetext'
import { LanguageContext } from '@/context/Lan'
import { DateRangePicker } from '../ui/DateRangePicker'
import { Currentdate } from "@/context/Currentdate"
import { Button } from '../ui/button'
import { ThemeContext } from '@/context/Theme'

type Props = {
    StatesSelected: string[]
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    sheetOpen: boolean
    SearchQuery: string,
    SetSearchQuery: React.Dispatch<React.SetStateAction<string>>,
    handleClick: () => void
}

const InputBox: React.FC<Props> = ({
    StatesSelected,
    setSheetOpen,
    SetStatesSelected,
    sheetOpen,
    SearchQuery,
    SetSearchQuery,
    handleClick
}) => {
    const { language } = useContext(LanguageContext)
    const { theme } = useContext(ThemeContext)
    const { startdate, endDate, onChangeStartDate, onChangeEndDate } = useContext(Currentdate)
    const isDark = theme === "dark"

    return (
        <div className={`w-full border-t ${isDark ? "border-white" : "border-slate-200"}`}>
            <div className='flex'>


                {/* ── Desktop ── */}
                <div className={`w-full hover:shadow-md ${isDark ? "bg-[#050505]" : "bg-white"} px-2 mx-auto hidden lg:flex items-center`}>

                    {/* ✅ Search icon was missing on desktop */}
                    <Search className="text-[#c51057] ml-2 w-4 h-4 shrink-0" />

                    <Input
                        type="text"
                        value={SearchQuery}
                        onChange={(e) => SetSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleClick() }}
                        placeholder={TranslateText[language].SEARCH_ANNOUNCEMENTS}
                        className={`border-0 shadow-none outline-none ring-0
                            focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0
                            text-[1rem] rounded-none placeholder:text-nowrap
                            ${isDark ? "text-white placeholder:text-white" : "text-[#321F1F] placeholder:text-[#321F1F]"}
                            placeholder:font-satoshi placeholder:font-semibold
                            pl-4 pr-4 py-5 sm:py-6 font-satoshi bg-transparent`}
                    />

                    <span className='w-px h-6 bg-slate-200 mx-4 shrink-0' />

                    <DateRangePicker
                        initialDateFrom={startdate}
                        initialDateTo={endDate}
                        onUpdate={({ range }) => {
                            onChangeStartDate(range.from)
                            if (range.to) onChangeEndDate(range.to)
                        }}
                    />

                    <Button
                        className='bg-[#c51057] p-2 pr-4 rounded-2xl hover:cursor-pointer ml-2 shrink-0'
                        onClick={handleClick}
                    >
                        <Search className="text-white" />
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default InputBox