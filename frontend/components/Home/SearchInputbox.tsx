import React, { useContext, useState, useEffect } from 'react'
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
import { format } from "date-fns"
import { Calendar as CalenderIcon } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import MobileSearchInput from './MobileSearchInput'
import { withCache, buildCacheKey } from "@/lib/lsCache"
import { MultiSelect } from '../ui/multi-select'



type Props = {
    StatesSelected: string[]
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    DeparmentsSelected: string
    SetDeparmentsSelected: React.Dispatch<React.SetStateAction<string>>
    SearchInput: string
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>
    onSearch: () => void,
    AnnouncementsType: "All" | "Central Govt" | "States Govt",
    SetAnnouncementsType: React.Dispatch<React.SetStateAction<"All" | "Central Govt" | "States Govt">>
    departmentOptions: string[]
    setDepartmentOptions: React.Dispatch<React.SetStateAction<string[]>>
    categoryOptions: string[]
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>
    CategoriesSelected: string
    SetCategoriesSelected: React.Dispatch<React.SetStateAction<string>>
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
    DeparmentsSelected, SetDeparmentsSelected,
    SearchInput, SetSearchInput,
    onSearch,
    AnnouncementsType, SetAnnouncementsType,
    departmentOptions,
    setDepartmentOptions,
    categoryOptions,
    setCategoryOptions,
    CategoriesSelected,
    SetCategoriesSelected,
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
                const key = buildCacheKey("categories", { language, startdate, endDate, states: StatesSelected });

                const response = await withCache(key, "categories", () =>
                    GetAllCategoriesAnnouncements(language, startdate, endDate, StatesSelected, controller.signal)
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

    }, [language, StatesSelected]);

    console.log(StatesSelected, "state selected in search input box")

    return (
        <div className='w-[90%] mx-auto flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
                <div className="relative">
                    <Input
                        className="text-[#2D4870] placeholder:truncate placeholder:text-ellipsis font-satoshi bg-white/50 backdrop-blur-sm border text-[1rem] md:text-xl! p-6 pl-10 pr-12 md:pr-6 border-[#a8c0e0]/40 placeholder:text-[1rem] md:placeholder:text-xl! placeholder:font-satoshi rounded-none"
                        placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                        value={SearchInput}
                        onChange={(e) => SetSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSearch();
                            }
                        }}
                    />
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#2D4870]" />
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger className="w-fit text-multiselect  bg-white/50 text-[11px] md:text-[12px]  font-satoshi  border border-[#a8c0e0]/40 font-semibold rounded-none absolute right-3 top-1/2 -translate-y-1/2 block md:hidden">
                            <FunnelPlus className='absolute right-3 top-1/2 -translate-y-1/2 text-[#2D4870] block md:hidden' />
                        </SheetTrigger>
                        <SheetContent className='p-0' side="bottom">
                            <MobileSearchInput
                                categoryOptions={categoryOptions}
                                DeparmentsSelected={DeparmentsSelected}
                                CategoriesSelected={CategoriesSelected}
                                departmentOptions={departmentOptions}
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
                        className='rounded-none w-fit font-satoshi bg-white/50 text-[#2D4870]!'
                        maxCount={1}
                        autoSize
                        resetOnDefaultValueChange={true}
                    />
                    <Select>
                        <SelectTrigger className='rounded-none px-4 py-4.5 text-multiselect w-fit font-satoshi bg-white/50 font-medium'>
                            <SelectValue placeholder="Types" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                categoryOptions.map((category) => (
                                    <SelectItem className='font-satoshi  hover:bg-white/70  text-[#1B3A7A] focus:bg-[#dce8f5]' key={category} value={category} onClick={() => SetCategoriesSelected(category)}>
                                        {category}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Popover >
                        <PopoverTrigger asChild>
                            <Button
                                className="w-fit text-multiselect  bg-white/50 text-[11px] md:text-[12px]  font-satoshi  border border-[#a8c0e0]/40 font-semibold rounded-none"
                            >
                                {format(startdate, "PPP")}
                                <CalenderIcon className="ml-1" size={14} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-9999" align="start">
                            <Calendar
                                mode="single"
                                selected={startdate}
                                defaultMonth={startdate}
                                className='font-satoshi bg-white/50 '
                                onSelect={(date) => date && onChangeStartDate(date)}
                            />
                        </PopoverContent>
                    </Popover>
                    <span className='text-[#a5c3eb] font-bold'>–</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="w-fit text-multiselect bg-white/50 text-[11px] md:text-[12px]  font-satoshi  border border-[#a8c0e0]/40 font-semibold rounded-none"
                            >
                                {format(endDate, "PPP")}
                                <CalenderIcon className="ml-1" size={14} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-9999" align="start">
                            <Calendar
                                mode="single"
                                className='font-satoshi bg-white/50 '
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