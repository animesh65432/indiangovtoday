import React, { useContext, useState, useEffect } from 'react'
import { CalendarIcon, Building2, Search, ChevronRight } from "lucide-react"
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

type MobileSerchInputboxProps = {
    StatesSelected: string[],
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>,
    DeparmentsSelected: string,
    SetDeparmentsSelected: React.Dispatch<React.SetStateAction<string>>,
    SearchInput: string,
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>,
    onSearch: () => void
}

const MobileSerchInputbox: React.FC<MobileSerchInputboxProps> = ({
    StatesSelected, SetStatesSelected,
    DeparmentsSelected, SetDeparmentsSelected,
    SearchInput, SetSearchInput,
    onSearch
}) => {
    const [options, setOptions] = useState<string[]>([])
    const { language } = useContext(LanguageContext)
    const { onChangeStartDate, startdate, endDate, onChangeEndDate } = useContext(Currentdate);

    useEffect(() => {
        const fetch = async () => {
            const res = await GetallAnnoucementsDepartments(language, startdate, endDate, StatesSelected) as { data: string[] };
            if (res?.data) setOptions(res.data);
        }
        fetch();
    }, [language, StatesSelected, startdate, endDate]);

    return (
        <div className="flex flex-col gap-8">
            {/* Keyword Search */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-widest ml-1">{TranslateText[language].KEYWORDS}</label>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-base focus-visible:ring-2 focus-visible:ring-blue-500"
                        placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                        value={SearchInput}
                        onChange={(e) => SetSearchInput(e.target.value)}
                    />
                </div>
            </div>


            <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-widest ml-1">{TranslateText[language].REGION}</label>
                <MultiSelect
                    options={TranslateText[language].MULTISELECT_OPTIONS}
                    onValueChange={SetStatesSelected}
                    defaultValue={StatesSelected}
                    placeholder="Select Regions"
                    className="rounded-2xl border-gray-100 [&_*]:text-[0.8rem]  text-black  [&_*]:text-black [&_*]:font-semibold bg-gray-50 min-h-[3.5rem]"
                    popoverClassName="z-[300]"
                />
            </div>


            <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-widest ml-1">{TranslateText[language].DEPTARTMENT}</label>
                <Select value={DeparmentsSelected} onValueChange={SetDeparmentsSelected}>
                    <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none px-4">
                        <div className="flex items-center gap-3">
                            <Building2 size={18} className="text-gray-400" />
                            <SelectValue placeholder={TranslateText[language].ALL_DEPARMENTS} />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="z-[1100] rounded-xl border-gray-100 shadow-xl">
                        <SelectGroup>
                            {options.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>


            <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-widest ml-1">{TranslateText[language].DATE_RANGE}</label>
                <div className="grid grid-cols-2 gap-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="h-14 rounded-2xl justify-start border-gray-100 bg-gray-50 font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                <span className="text-sm">{startdate ? startdate.toLocaleDateString() : "From"}</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="z-[1100] w-auto p-0 rounded-2xl overflow-hidden" align="center">
                            <Calendar mode="single" selected={startdate} onSelect={(d) => onChangeStartDate(d!)} />
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="h-14 rounded-2xl justify-start border-gray-100 bg-gray-50 font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                <span className="text-sm">{endDate ? endDate.toLocaleDateString() : "To"}</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="z-[1100] w-auto p-0 rounded-2xl overflow-hidden" align="center">
                            <Calendar mode="single" selected={endDate} onSelect={(d) => onChangeEndDate(d!)} />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>


            <Button
                onClick={onSearch}
                className="w-full h-12 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                {TranslateText[language].SEARCH}
                <ChevronRight size={20} />
            </Button>
        </div>
    )
}

export default MobileSerchInputbox