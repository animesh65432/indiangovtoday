import React, { useContext, useState, useEffect } from 'react'
import { LanguageContext } from "@/context/Lan"
import { Input } from "@/components/ui/input"
import { TranslateText } from "@/lib/translatetext"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Currentdate } from '@/context/Currentdate'
import { Button } from '../ui/button'
import { GetallAnnoucementsDepartments } from "@/api/announcements"
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
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import MobileSearchInput from './MobileSearchInput'


type Props = {
    StatesSelected: string[]
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    DeparmentsSelected: string
    SetDeparmentsSelected: React.Dispatch<React.SetStateAction<string>>
    SearchInput: string
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>
    onSearch: () => void
}

const SearchInputBox: React.FC<Props> = ({
    StatesSelected, SetStatesSelected,
    DeparmentsSelected, SetDeparmentsSelected,
    SearchInput, SetSearchInput,
    onSearch
}) => {
    const [departmentOptions, setDepartmentOptions] = useState<string[]>([])
    const { SetIsLoading } = useContext(IsLoadingContext)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
    const [startDateOpen, setStartDateOpen] = useState(false)
    const [endDateOpen, setEndDateOpen] = useState(false)

    const { language } = useContext(LanguageContext)
    const { onChangeStartDate, startdate, endDate, onChangeEndDate } = useContext(Currentdate)

    const activeFilterCount =
        StatesSelected.length + (startdate ? 1 : 0) + (endDate ? 1 : 0)

    useEffect(() => {
        const controller = new AbortController();

        const fetchDepartments = async () => {
            SetIsLoading(true);
            setDepartmentOptions([]);
            try {
                const response = await GetallAnnoucementsDepartments(
                    language, startdate, endDate, StatesSelected, controller.signal
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

    return (
        <div className='w-[97%] mx-auto  flex flex-col gap-2'>
            <div className=' flex md:hidden mt-4 md:mt-0'>
                <SourceToggle />
            </div>
            <div className='flex items-center gap-4 md:hidden'>
                <div className="relative w-[93%] ">
                    <Input
                        placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                        style={{ paddingLeft: 30 }}
                        className="bg-[#f8f7f2] placeholder:text-[13px]  md:placeholder:text-[0.9rem]  placeholder:font-inter w-full "
                        value={SearchInput}
                        onChange={(e) => SetSearchInput(e.target.value)}
                    />
                    <Search
                        className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={14}
                        onClick={onSearch}
                    />
                </div>
                <div>
                    <Sheet >
                        <SheetTrigger asChild>
                            <ListFilterPlus />
                        </SheetTrigger>
                        <SheetContent side="bottom" className="z-[9999] h-fit">
                            <MobileSearchInput
                                departmentOptions={departmentOptions}
                                SetDeparmentsSelected={SetDeparmentsSelected}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div className="relative w-full hidden md:block">
                <Input
                    placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                    style={{ paddingLeft: 30 }}
                    className="bg-[#f8f7f2] placeholder:text-[13px]  md:placeholder:text-[0.9rem]  placeholder:font-inter w-full "
                    value={SearchInput}
                    onChange={(e) => SetSearchInput(e.target.value)}
                />
                <Search
                    className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    size={14}
                    onClick={onSearch}
                />
            </div>
            <div className=' hidden md:flex items-center gap-2 flex-wrap'>
                <SourceToggle
                />
                <Select>
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
                                    onSelect={() => SetDeparmentsSelected(dept)}
                                >
                                    {dept}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select>
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
                                    onSelect={() => SetDeparmentsSelected(dept)}
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
                            className="w-fit  bg-[#F8F7F2]  font-poppins text-[#555555] border border-[#E8E4DA] font-semibold rounded-md"
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
                        />
                    </PopoverContent>
                </Popover>
                <span className='text-[#c9c9c9] font-bold'>–</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="w-fit  bg-[#F8F7F2]  font-poppins text-[#555555] border border-[#E8E4DA] font-semibold rounded-md"
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
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default SearchInputBox