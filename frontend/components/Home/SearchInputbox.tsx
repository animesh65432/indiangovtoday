import React, { useContext, useState, useEffect } from 'react'
import { ChevronDownIcon, MapPin, Calendar as CalendarIcon, SlidersHorizontal, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LanguageContext } from "@/context/Lan"
import { Input } from "@/components/ui/input"
import { TranslateText } from "@/lib/translatetext"
import DeparmentSelection from "./DeparmentSelection"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Currentdate } from '@/context/Currentdate'
import { Button } from '../ui/button'
import { MultiSelect } from "@/components/ui/multi-select"
import { GetallAnnoucementsDepartments } from "@/api/announcements"
import { IsLoadingContext } from '@/context/IsLoading'

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
        const fetchDepartments = async () => {
            SetIsLoading(true);
            try {
                const response = await GetallAnnoucementsDepartments(
                    language, startdate, endDate, StatesSelected
                ) as { data: string[] }
                setDepartmentOptions([TranslateText[language].ALL_DEPARMENTS, ...response.data])
            } finally {
                SetIsLoading(false);
            }
        }
        fetchDepartments()
    }, [language, StatesSelected])


    const FilterFields = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Region */}
            <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.2 }}
            >
                <span className="uppercase font-poppins flex items-center gap-1 text-black/60 font-semibold text-xs md:text-sm">
                    <MapPin size={13} />
                    {TranslateText[language].REGION}
                </span>
                <MultiSelect
                    options={TranslateText[language].MULTISELECT_OPTIONS}
                    onValueChange={SetStatesSelected}
                    defaultValue={StatesSelected}
                    className="rounded-md uppercase bg-white text-black [&_*]:text-black [&_*]:font-semibold w-full"
                    placeholder="Select Regions"
                />
            </motion.div>

            {/* Start date */}
            <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
            >
                <span className="uppercase font-poppins text-black/60 font-semibold flex items-center gap-2 text-xs md:text-sm">
                    <CalendarIcon size={13} />
                    {TranslateText[language].RANGE}
                </span>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="start-date"
                            className="w-full bg-white justify-between px-4 py-5 text-black font-semibold rounded-md border border-slate-200 text-sm"
                        >
                            {startdate ? startdate.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon className="shrink-0 ml-2" size={14} />
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
            </motion.div>

            {/* End date */}
            <motion.div
                className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
            >
                <span className="uppercase font-poppins flex items-center gap-2 text-black/60 font-semibold text-xs md:text-sm">
                    <CalendarIcon size={13} />
                    {TranslateText[language].TO}
                </span>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="end-date"
                            className="w-full bg-white justify-between px-4 py-5 text-black font-semibold rounded-md border border-slate-200 text-sm"
                        >
                            {endDate ? endDate.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon className="shrink-0 ml-2" size={14} />
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
            </motion.div>

        </div>
    )

    return (
        <motion.nav
            className="flex flex-col"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <DeparmentSelection
                DepartmentsOptions={departmentOptions}
                SetDepartmentsOptions={setDepartmentOptions}
                DeparmentsSelected={DeparmentsSelected}
                SetDeparmentsSelected={SetDeparmentsSelected}
            />

            {/* ─────────────────────────────────────────
                MOBILE — only show filter button
            ───────────────────────────────────────── */}
            <div className="sm:hidden w-[90%] mx-auto mt-2">
                <Button
                    variant="outline"
                    className="relative w-full rounded-none gap-2 uppercase border-black font-semibold text-sm py-5"
                    onClick={() => setMobileSheetOpen(true)}
                >
                    <SlidersHorizontal size={14} />
                    {TranslateText[language].FILTER_ANNOUNCEMENTS ?? "Filter Announcements"}
                    <AnimatePresence>
                        {activeFilterCount > 0 && (
                            <motion.span
                                key="badge"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                            >
                                {activeFilterCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </div>

            {/* ─────────────────────────────────────────
                MOBILE BOTTOM SHEET
            ───────────────────────────────────────── */}
            <AnimatePresence>
                {mobileSheetOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            className="sm:hidden fixed inset-0 bg-black/40 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileSheetOpen(false)}
                        />

                        {/* Sheet */}
                        <motion.div
                            key="sheet"
                            className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#faf9f8] rounded-t-2xl p-5 flex flex-col gap-4 shadow-2xl"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Sheet header */}
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-base uppercase tracking-wide">
                                    {TranslateText[language].FILTER_ANNOUNCEMENTS}
                                </span>
                                <button
                                    onClick={() => setMobileSheetOpen(false)}
                                    className="p-1 rounded-full hover:bg-black/5 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Search input inside sheet */}
                            <Input
                                className="rounded-none bg-white placeholder:text-sm w-full"
                                placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                                value={SearchInput}
                                onChange={(e) => SetSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                            />

                            {/* Filter fields */}
                            <FilterFields />

                            {/* Apply button */}
                            <Button
                                className="w-full rounded-none bg-black text-white text-sm py-5 mt-1"
                                onClick={() => {
                                    onSearch()
                                    setMobileSheetOpen(false)
                                }}
                            >
                                {TranslateText[language].SEARCH}
                            </Button>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────
                DESKTOP — search row + collapsible filters
            ───────────────────────────────────────── */}
            <div className="hidden sm:flex flex-col w-[85%] xl:w-[85%] mx-auto bg-[#faf9f8] p-4 mt-2 gap-3">

                {/* Search row */}
                <div className="flex items-center gap-2 w-full">
                    <Input
                        className="rounded-none bg-white placeholder:text-base flex-1 min-w-0"
                        placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                        value={SearchInput}
                        onChange={(e) => SetSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    />

                    <Button
                        variant="outline"
                        className="relative rounded-none shrink-0 gap-2 border-black font-semibold text-sm"
                        onClick={() => setFiltersOpen(prev => !prev)}
                    >
                        <SlidersHorizontal size={14} />
                        {TranslateText[language].FILTER_ANNOUNCEMENTS ?? "Filters"}
                        <motion.div
                            animate={{ rotate: filtersOpen ? 180 : 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                            <ChevronDownIcon size={14} />
                        </motion.div>
                        <AnimatePresence>
                            {activeFilterCount > 0 && (
                                <motion.span
                                    key="badge-desktop"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                                >
                                    {activeFilterCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>

                    <Button
                        className="rounded-none bg-black text-white text-sm shrink-0"
                        onClick={onSearch}
                    >
                        {TranslateText[language].SEARCH}
                    </Button>
                </div>

                {/* Collapsible filters */}
                <AnimatePresence initial={false}>
                    {filtersOpen && (
                        <motion.div
                            key="desktop-filters"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="pt-3 border-t border-slate-200">
                                <FilterFields />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

        </motion.nav>
    )
}

export default SearchInputBox