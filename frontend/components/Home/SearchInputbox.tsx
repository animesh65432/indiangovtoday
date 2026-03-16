import React, { useContext, useState, useEffect } from 'react'
import { LanguageContext } from "@/context/Lan"
import { Input } from "@/components/ui/input"
import { TranslateText } from "@/lib/translatetext"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Currentdate } from '@/context/Currentdate'
import { Button } from '../ui/button'
import { GetallAnnoucementsDepartments, GetAllCategoriesAnnouncements } from "@/api/announcements"
import { IsLoadingContext } from '@/context/IsLoading'
import { Search, ListFilterPlus } from "lucide-react";
import SourceToggle from './SourceToggle'
import {
    Select,
    SelectContent,
    SelectGroup,
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
import Showfilters from './Showfilters'
import { withCache, buildCacheKey } from "@/lib/lsCache"



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

        const fetchDepartments = async () => {
            SetIsLoading(true);
            setDepartmentOptions([]);
            try {

                const key = buildCacheKey("Departments", { language, startdate, endDate, states: StatesSelected });

                const response = await withCache(key, "Departments", () =>
                    GetallAnnoucementsDepartments(language, startdate, endDate, StatesSelected, controller.signal)
                ) as { data: string[] };

                if (!controller.signal.aborted) {
                    setDepartmentOptions([TranslateText[language].ALL_DEPARMENTS, ...response.data]);
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

        fetchDepartments();
        return () => controller.abort();

    }, [language, StatesSelected]);

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

    const ShowfiltersComponent = StatesSelected.length > 0 || DeparmentsSelected.length > 0 || CategoriesSelected.length > 0 || AnnouncementsType !== "All"

    return (
        <div className='w-[97%] mx-auto  flex flex-col gap-2'>
            <div className=' flex md:hidden mt-4 md:mt-0'>
                <SourceToggle
                    AnnouncementsType={AnnouncementsType}
                    SetAnnouncementsType={SetAnnouncementsType}
                />
            </div>
            <div className='flex items-center gap-4 md:hidden'>
                <div className="relative w-[93%] ">
                    <Input
                        placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                        style={{ paddingLeft: 30 }}
                        className="bg-[#f8f7f2] placeholder:text-[13px] font-poppins  placeholder:font-poppins w-full "
                        value={SearchInput}
                        onChange={(e) => SetSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    />
                    <Search
                        className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={14}
                        onClick={onSearch}
                    />
                </div>
                <div>
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <ListFilterPlus />
                        </SheetTrigger>
                        <SheetContent side="bottom" className="z-9999 h-fit">
                            <MobileSearchInput
                                departmentOptions={departmentOptions}
                                categoryOptions={categoryOptions}
                                setCategoryOptions={setCategoryOptions}
                                CategoriesSelected={CategoriesSelected}
                                DeparmentsSelected={DeparmentsSelected}
                                StatesSelected={StatesSelected}
                                onApply={handleMobileApply}
                                onReset={handleMobileReset}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div className="relative w-full hidden md:block">
                <Input
                    placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                    style={{ paddingLeft: 30 }}
                    className="bg-[#f8f7f2] placeholder:text-[13px] font-poppins  placeholder:font-poppins w-full "
                    value={SearchInput}
                    onChange={(e) => SetSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
                <Search
                    className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    size={14}
                    onClick={onSearch}
                />
            </div>
            <div className=' hidden md:flex items-center gap-2 flex-wrap'>
                <SourceToggle
                    AnnouncementsType={AnnouncementsType}
                    SetAnnouncementsType={SetAnnouncementsType}
                />
                <Select value={DeparmentsSelected} onValueChange={(value) => SetDeparmentsSelected(value)}>
                    <SelectTrigger className="w-fit h-3 bg-[#F8F7F2] rounded-md border border-[#E8E4DA]">
                        <SelectValue
                            className='placeholder:text-[#555555] text-[#555555] placeholder:font-poppins font-poppins'
                            placeholder={TranslateText[language].ALL_DEPARMENTS}
                        />
                    </SelectTrigger>
                    <SelectContent className='text-[0.9rem]  uppercase z-9999 '>
                        <SelectGroup>
                            {departmentOptions.map((dept) => (
                                <SelectItem
                                    key={dept}
                                    value={dept}
                                    className='hover:bg-[#F8F7F2] hover:text-[#555555] hover:font-semibold'
                                >
                                    {dept}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select value={CategoriesSelected} onValueChange={(value) => SetCategoriesSelected(value)}>
                    <SelectTrigger className="w-fit h-3 bg-[#F8F7F2] rounded-md border border-[#E8E4DA]">
                        <SelectValue
                            className='placeholder:text-[#555555] text-[#555555] placeholder:font-poppins font-poppins'
                            placeholder={TranslateText[language].ALL_DEPARMENTS}
                        />
                    </SelectTrigger>
                    <SelectContent className='text-[0.9rem]  uppercase z-9999 '>
                        <SelectGroup>
                            {categoryOptions.map((dept) => (
                                <SelectItem
                                    key={dept}
                                    value={dept}
                                    className='hover:bg-[#F8F7F2] hover:text-[#555555] hover:font-semibold'
                                    onSelect={() => console.log(dept)}
                                >
                                    {dept}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Popover >
                    <PopoverTrigger asChild>
                        <Button
                            className="w-fit  bg-[#F8F7F2] text-[11px] md:text-[12px]  font-poppins text-[#555555] border border-[#E8E4DA] font-semibold rounded-md"
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
                            className='font-poppins'
                            onSelect={(date) => date && onChangeStartDate(date)}
                        />
                    </PopoverContent>
                </Popover>
                <span className='text-[#c9c9c9] font-bold'>–</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="w-fit  bg-[#F8F7F2] text-[11px] md:text-[12px]  font-poppins text-[#555555] border border-[#E8E4DA] font-semibold rounded-md"
                        >
                            {format(endDate, "PPP")}
                            <CalenderIcon className="ml-1" size={14} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-9999" align="start">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            defaultMonth={endDate}
                            onSelect={(date) => date && onChangeEndDate(date)}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            {ShowfiltersComponent &&
                <Showfilters
                    selectedDepartment={DeparmentsSelected}
                    selectedStates={StatesSelected}
                    SetStatesSelected={SetStatesSelected}
                    CategoriesSelected={CategoriesSelected}
                    SetCategoriesSelected={SetCategoriesSelected}
                    SetDeparmentsSelected={SetDeparmentsSelected}
                />
            }
        </div>
    )
}

export default SearchInputBox