import React from 'react'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TranslateText } from '@/lib/translatetext'
import { LanguageContext } from '@/context/Lan'
import { DateRangePicker } from '../ui/DateRangePicker'
import { Currentdate } from "@/context/Currentdate"
import { MultiSelect } from '../ui/multi-select'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import MobileSearchInput from './MobileSearchInput'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '../ui/button'

type Props = {
    StatesSelected: string[]
    onApply: () => void
    onReset: () => void
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    sheetOpen: boolean
}

const InputBox: React.FC<Props> = ({
    StatesSelected,
    onApply,
    onReset,
    setSheetOpen,
    SetStatesSelected,
    sheetOpen,
}) => {
    const [searchQuery, setSearchQuery] = React.useState<string>("")
    const { language } = React.useContext(LanguageContext)
    const { startdate, endDate, onChangeStartDate, onChangeEndDate } = React.useContext(Currentdate)
    const router = useRouter()
    const pathname = usePathname()

    const handleSearch = () => {
        if (pathname === "/") {
            router.push(`/search?query=${searchQuery}${startdate ? `&startDate=${startdate.toISOString().split('T')[0]}` : ""}${endDate ? `&endDate=${endDate.toISOString().split('T')[0]}` : ""}${StatesSelected.length ? StatesSelected.map(state => `&states=${state}`).join("") : ""}`)
        }
    }

    return (
        <div className="w-full px-4 sm:px-6 md:px-0 mt-3">
            <div className='flex '>
                <Sheet open={sheetOpen} onOpenChange={(open) => setSheetOpen(open)}>
                    <SheetTrigger className="w-full block lg:hidden">
                        <div onClick={() => setSheetOpen(true)} className="relative w-full max-w-xl md:max-w-2xl mx-auto block lg:hidden">
                            <Search className="absolute text-[#ff3333] z-10 left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                            <Input
                                type="text"
                                placeholder={TranslateText[language].SEARCH_ANNOUNCEMENTS}
                                className="w-full text-[1rem] hover:shadow-md  text-[#321F1F] placeholder:text-[#321F1F]  placeholder:font-satoshi placeholder:font-semibold pl-10 sm:pl-12 pr-4 py-5 sm:py-6  bg-white/90 border border-gray-200 rounded-xl sm:rounded-2xl shadow-md  font-satoshi"
                            />
                        </div>
                    </SheetTrigger>
                    <SheetContent side='bottom' className='h-dvh'>
                        <MobileSearchInput
                            StatesSelected={StatesSelected}
                            onApply={onApply}
                            onReset={onReset}
                            setSheetOpen={setSheetOpen}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </SheetContent>
                </Sheet>

                <div className="w-fit hover:shadow-md px-5 py-1.5 border border-[#e5dfdf] rounded-xl bg-white   mx-auto hidden lg:flex items-center">
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={TranslateText[language].SEARCH_ANNOUNCEMENTS}
                        className="border-0 border-none shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 placeholder:text-nowrap text-[1rem] rounded-none text-[#321F1F] placeholder:text-[#321F1F] placeholder:font-satoshi placeholder:font-semibold pl-10 sm:pl-12 pr-4 py-5 sm:py-6 font-satoshi bg-transparent"
                    />
                    <span className='w-px h-6 bg-[#8c8686] mx-4' />
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
                    <span className='w-px h-6 bg-[#8c8686] mx-4' />
                    <MultiSelect
                        options={TranslateText[language].MULTISELECT_OPTIONS}
                        defaultValue={StatesSelected}
                        onValueChange={(value) => SetStatesSelected(value)}
                        className='rounded-none w-fit font-satoshi  text-[#321F1F]'
                        maxCount={1}
                        autoSize
                        resetOnDefaultValueChange={true}
                    />
                    <Button
                        className='bg-[#ff3333] p-2 rounded-2xl hover:cursor-pointer'
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