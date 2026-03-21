import React, { useContext, useEffect } from 'react'
import { LanguageContext } from "@/context/Lan"
import { Input } from "@/components/ui/input"
import { TranslateText } from "@/lib/translatetext"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Currentdate } from '@/context/Currentdate'
import { Button } from '../ui/button'
import { GetAllCategoriesAnnouncements } from "@/api/announcements"
import { IsLoadingContext } from '@/context/IsLoading'
import { Search, FunnelPlus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar as CalenderIcon } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import MobileSearchInput from './MobileSearchInput'
import { withCache, buildCacheKey } from "@/lib/lsCache"
import { MultiSelect } from '../ui/multi-select'
import { formatDateInLanguage } from '@/lib/formatDate'



type Props = {
    StatesSelected: string[]
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    SearchInput: string
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>
    onSearch: () => void,
    categoryOptions: string[]
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>
    CategorySelected: string
    SetCategorySelected: React.Dispatch<React.SetStateAction<string>>
    handleMobileApply: (dept: string,
        category: string,
        states: string[],
        startDate: Date | null,
        endDate: Date | null) => void
    handleMobileReset: () => void,
    sheetOpen: boolean,
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchInputBox: React.FC<Props> = ({
    StatesSelected, SetStatesSelected,
    SearchInput, SetSearchInput,
    onSearch,
    categoryOptions,
    setCategoryOptions,
    CategorySelected,
    SetCategorySelected,
    handleMobileApply,
    handleMobileReset,
    sheetOpen,
    setSheetOpen
}) => {
    const { SetIsLoading } = useContext(IsLoadingContext)
    const { language } = useContext(LanguageContext)
    const { onChangeStartDate, startdate, endDate, onChangeEndDate } = useContext(Currentdate)

    useEffect(() => {
        const controller = new AbortController();

        const fetchCategoriesAnnouncements = async () => {
            SetIsLoading(true);
            setCategoryOptions([]);
            try {
                const key = buildCacheKey("categories", { language, startdate, endDate });

                const response = await withCache(key, "categories", () =>
                    GetAllCategoriesAnnouncements(language, startdate, endDate, controller.signal)
                ) as { data: string[] };

                if (!controller.signal.aborted) {
                    setCategoryOptions([TranslateText[language].ALL_DEPARMENTS, ...response.data]);
                }
            } catch (error: unknown) {
                if (error instanceof Error &&
                    (error.name === 'AbortError' || (error as { code?: string }).code === 'ERR_CANCELED')) {
                    return;
                }
            } finally {
                if (!controller.signal.aborted) {
                    SetIsLoading(false);
                }
            }
        };

        fetchCategoriesAnnouncements();
        return () => controller.abort();

    }, [language]);

    return (
        <div className=' ml-2 md:ml-4 flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
                <div className="relative">
                    <Input
                        className="text-[#FFFFFF] placeholder:text-[#6B7280] w-[98%] md:w-[90%] mx-auto md:mx-0 placeholder:truncate placeholder:text-ellipsis font-satoshi bg-[#1A1A1A] backdrop-blur-sm border text-[1rem] md:text-xl! p-6 pl-10 pr-12 md:pr-6 border-[#FF9933] placeholder:text-[1rem] md:placeholder:text-xl! placeholder:font-satoshi rounded-none"
                        placeholder={TranslateText[language].SEARCH_ANNOUNCEMENTS}
                        value={SearchInput}
                        onChange={(e) => SetSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSearch();
                            }
                        }}
                    />
                    <Search className="absolute left-4 md:left-2 top-1/2 -translate-y-1/2 text-[#FF9933]" />
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger className="w-fit text-multiselect  bg-white/50 text-[11px] md:text-[12px]  font-satoshi  border border-[#a8c0e0]/40 font-semibold rounded-none absolute right-3 top-1/2 -translate-y-1/2 block md:hidden">
                            <FunnelPlus className='absolute right-3 top-1/2 -translate-y-1/2 text-[#FF9933] block md:hidden' />
                        </SheetTrigger>
                        <SheetContent className='p-0 z-[9999]' side="bottom">
                            <MobileSearchInput
                                categoryOptions={categoryOptions}
                                CategorySelected={CategorySelected}
                                StatesSelected={StatesSelected}
                                onApply={handleMobileApply}
                                onReset={handleMobileReset}
                                setCategoryOptions={setCategoryOptions}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
                <div className='hidden md:flex items-center gap-3 flex-wrap'>
                    <MultiSelect
                        options={TranslateText[language].MULTISELECT_OPTIONS}
                        defaultValue={StatesSelected}
                        onValueChange={(value) => SetStatesSelected(value)}
                        className='rounded-none w-fit font-satoshi bg-[#1A1A1A]  border border-[#FF9933]  text-[#FFFFFF]!'
                        maxCount={1}
                        autoSize
                        resetOnDefaultValueChange={true}
                    />
                    <Select
                        value={CategorySelected}
                        onValueChange={SetCategorySelected}
                        defaultValue={TranslateText[language].ALL_DEPARMENTS}
                    >
                        <SelectTrigger className='rounded-none px-4 py-4.5 border border-[#FF9933] text-[#FFFFFF]!  w-fit font-satoshi bg-[#1A1A1A] font-medium'>
                            <SelectValue placeholder={TranslateText[language].ALL_DEPARMENTS} />
                        </SelectTrigger>
                        <SelectContent className='bg-[#1A1A1A] border border-[#FF9933]/30'>
                            {
                                categoryOptions.map((category) => (
                                    <SelectItem
                                        className='font-satoshi text-[#EAEAEA] hover:bg-[#FF9933]/10 focus:bg-[#FF9933]/20 cursor-pointer'
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Popover >
                        <PopoverTrigger asChild>
                            <Button
                                className="w-fit text-multiselect bg-[#1A1A1A]  border border-[#FF9933] text-[#FFFFFF]! text-[11px] md:text-[12px]  font-satoshi   font-semibold rounded-none"
                            >
                                {formatDateInLanguage(startdate, language)}
                                <CalenderIcon className="ml-1 text-[#FF9933]" size={14} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999] !border-[#FF9933] !bg-[#1A1A1A] rounded-md" align="start">
                            <Calendar
                                mode="single"
                                selected={startdate}
                                defaultMonth={startdate}
                                className='font-satoshi z-[999]'
                                onSelect={(date) => date && onChangeStartDate(date)}
                            />
                        </PopoverContent>
                    </Popover>
                    <span className='text-[#FF9933] font-bold'>–</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="w-fit text-multiselect bg-[#1A1A1A]  border border-[#FF9933] text-[#FFFFFF]! text-[11px] md:text-[12px]  font-satoshi   font-semibold rounded-none"
                            >
                                {formatDateInLanguage(endDate, language)}
                                <CalenderIcon className="ml-1 text-[#FF9933]" size={14} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999] !border-[#FF9933] !bg-[#1A1A1A] rounded-md" align="start">
                            <Calendar
                                mode="single"
                                className='font-satoshi z-[999]'
                                selected={endDate}
                                defaultMonth={endDate}
                                onSelect={(date) => date && onChangeEndDate(date)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}

export default SearchInputBox