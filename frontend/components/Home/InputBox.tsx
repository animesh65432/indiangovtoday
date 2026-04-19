import React, { useContext } from 'react'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TranslateText } from '@/lib/translatetext'
import { LanguageContext } from '@/context/Lan'
import { DateRangePicker } from '../ui/DateRangePicker'
import { Currentdate } from "@/context/Currentdate"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import MobileSearchInput from './MobileSearchInput'
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
    const { language } = React.useContext(LanguageContext)
    const { theme } = useContext(ThemeContext)
    const { startdate, endDate, onChangeStartDate, onChangeEndDate } = React.useContext(Currentdate)
    const isDark = theme === "dark"

    const handleSearch = () => {
        handleClick()
    }

    return (
        <div className="w-full border-t border-slate-200">
            <div className='flex '>
                <Sheet open={sheetOpen} onOpenChange={(open) => setSheetOpen(open)}>
                    <SheetTrigger className="w-full block lg:hidden">
                        <div onClick={() => setSheetOpen(true)} className="relative w-full block lg:hidden">
                            <Search className="absolute text-[#c51057] z-10 left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                            <Input
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch()
                                    }
                                }}
                                type="text"
                                placeholder={TranslateText[language].SEARCH_ANNOUNCEMENTS}
                                className="w-full  text-[1rem] hover:shadow-md  text-[#321F1F] placeholder:text-[#321F1F]  placeholder:font-satoshi placeholder:font-semibold pl-10 sm:pl-12 pr-4 py-5 sm:py-6  bg-white/90 border border-gray-200  shadow-md  font-satoshi"
                            />
                        </div>
                    </SheetTrigger>
                    <SheetContent side='bottom' className='h-dvh z-600'>
                        <MobileSearchInput
                            StatesSelected={StatesSelected}
                            setSheetOpen={setSheetOpen}
                            searchQuery={SearchQuery}
                            setSearchQuery={SetSearchQuery}
                            handleSearch={handleSearch}
                            SetStatesSelected={SetStatesSelected}
                        />
                    </SheetContent>
                </Sheet>

                <div className={`w-full hover:shadow-md ${isDark ? "bg-[#050505]" : "bg-white"} px-2  mx-auto hidden lg:flex items-center`}>
                    <Input
                        type="text"
                        value={SearchQuery}
                        onChange={(e) => SetSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch()
                            }
                        }}
                        placeholder={TranslateText[language].SEARCH_ANNOUNCEMENTS}
                        className={`border-0 border-none  shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 placeholder:text-nowrap text-[1rem] rounded-none ${isDark ? "text-white" : " text-[#321F1F]"} ${isDark ? "placeholder:text-white" : " placeholder:text-[#321F1F]"} placeholder:font-satoshi placeholder:font-semibold pl-10 sm:pl-12 pr-4 py-5 sm:py-6 font-satoshi bg-transparent`}
                    />
                    <span className='w-px h-6 bg-slate-200 mx-4' />
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
                    <Button
                        className='bg-[#c51057] p-2 pr-4 rounded-2xl hover:cursor-pointer'
                        onClick={() => handleSearch()}
                    >
                        <Search className="  text-white " />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default InputBox