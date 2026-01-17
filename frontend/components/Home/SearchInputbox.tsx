import React, { useContext, useState, useEffect } from 'react'
import { ChevronDownIcon, Search } from "lucide-react"
import { LanguageContext } from "@/context/Lan"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TranslateText } from "@/lib/translatetext"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Currentdate } from '@/context/Currentdate'
import { Button } from '../ui/button'
import { MultiSelect } from "@/components/ui/multi-select"
import { GetallAnnoucementsDepartments } from "@/api/announcements"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

type Props = {
    StatesSelected: string[],
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>,
    DeparmentsSelected: string,
    SetDeparmentsSelected: React.Dispatch<React.SetStateAction<string>>
    SearchInput: string,
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>
    onSearch: () => void
}

const SerchInputbox: React.FC<Props> = ({
    StatesSelected, SetStatesSelected,
    DeparmentsSelected, SetDeparmentsSelected,
    SearchInput, SetSearchInput,
    onSearch
}) => {
    const [DeparmentsOptions, setDeparmentsOptions] = useState<string[]>([])
    const { language } = useContext(LanguageContext)
    const [startDateOpen, setStartDateOpen] = useState<boolean>(false);
    const [EndDateOpen, setEndDateOpen] = useState<boolean>(false);
    const { onChangeStartDate, startdate, endDate, onChangeEndDate } = useContext(Currentdate);

    const fetchDeparmentsOptions = async () => {
        try {
            const response = await GetallAnnoucementsDepartments(
                language, startdate, endDate, StatesSelected
            ) as { data: string[] };
            setDeparmentsOptions(response.data);
        } catch (error) {
            console.error("Error fetching departments options:", error);
        }
    }

    useEffect(() => {
        fetchDeparmentsOptions();
    }, [language, StatesSelected])

    return (
        <nav className='flex flex-col gap-2 lg:gap-5 w-[95vw] lg:w-[85vw] mx-auto pt-3'>
            <ul className='flex flex-col gap-1'>
                <h2 className='uppercase'>public notification</h2>
                <span className='uppercase text-[0.9rem] flex items-center gap-2'>
                    <span className=" border-2 border-t border-yellow-400 w-8 h-0"></span>
                    <TextGenerateEffect
                        words="Direct Access to Verified Government Circulars"
                    />
                </span>
            </ul>
            <ul className='border border-slate-200 bg-white w-full p-5 flex flex-col gap-4'>
                <ul className='flex items-center gap-10'>
                    <li className="relative w-[80%]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            className="w-full placeholder:uppercase pl-9 pt-5 pb-5 rounded-none bg-slate-100 focus-visible:ring-0"
                            placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                            value={SearchInput}
                            onChange={(e) => SetSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onSearch();
                                }
                            }}
                        />
                    </li>
                    <Button onClick={onSearch} className='bg-yellow-500 shadow-md p-5 text-black font-semibold hover:cursor-pointer'>
                        {TranslateText[language].SEARCH}
                    </Button>
                </ul>
                <ul className='flex gap-4 items-center '>
                    <li className='flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-5 '>
                        <span className='uppercase text-slate-500 font-semibold'>region :</span>
                        <ol>
                            <MultiSelect
                                options={TranslateText[language].MULTISELECT_OPTIONS}
                                onValueChange={SetStatesSelected}
                                defaultValue={StatesSelected}
                                className='rounded-none uppercase text-black [&_*]:text-black [&_*]:font-semibold'
                                placeholder='Select Regions'
                            />
                        </ol>
                    </li>
                    <li className='flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-5'>
                        <span className='uppercase text-slate-500 font-semibold'>dept :</span>
                        <Select value={DeparmentsSelected} onValueChange={SetDeparmentsSelected}>
                            <SelectTrigger className="w-fit p-5 rounded-none bg-transparent data-[placeholder]:text-black uppercase">
                                <SelectValue placeholder="ALL DEPARMENTS" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {DeparmentsOptions.map((deparment) => (
                                        <SelectItem
                                            key={deparment}
                                            value={deparment}
                                            className={`hover:bg-slate-200 ${DeparmentsSelected.includes(deparment) ? 'bg-slate-200' : ''}`}
                                        >
                                            {deparment}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </li>
                    <li className='flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-5'>
                        <span className='uppercase text-slate-500 font-semibold'>Range :</span>
                        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                            <PopoverTrigger asChild>
                                <Button id="date" className="w-fit justify-between p-5 text-black font-semibold rounded-none border border-slate-200">
                                    {startdate ? startdate.toLocaleDateString() : "Select date"}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startdate}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        onChangeStartDate(date!)
                                        setStartDateOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </li>
                    <li className='flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-5'>
                        <span className='uppercase text-slate-500 font-semibold'>to</span>
                        <Popover open={EndDateOpen} onOpenChange={setEndDateOpen}>
                            <PopoverTrigger asChild>
                                <Button id="date" className="w-fit p-5 justify-between text-black font-semibold rounded-none border border-slate-200">
                                    {endDate ? endDate.toLocaleDateString() : "Select date"}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        onChangeEndDate(date!)
                                        setEndDateOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </li>
                </ul>
            </ul>
        </nav>
    )
}

export default SerchInputbox