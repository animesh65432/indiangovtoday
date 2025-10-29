"use client"
import React, { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import Header from "@/components/Announcement/Header"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/ui/DateRangePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { optionsforLanguages } from "@/lib/lan"
import { Button } from "@/components/ui/button"
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
import { Currentdate } from "@/context/Currentdate"
import { GetGroupIndiaAnnouncements } from "@/api/announcements"
export default function GroupPage() {
    const [groupValue, setGroupValue] = useState<string | null>(null)
    const [SearchInput, SetSearchInput] = useState("")
    const router = useRouter()
    const { group } = router.query
    const { language, onSelectLanguage } = useContext(LanguageContext)
    const { startdate, endDate, onChangeDate } = useContext(Currentdate)

    useEffect(() => {
        if (typeof group === "string") {
            setGroupValue(group)
        }
    }, [group])

    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
        }
    };

    return (
        <div className="p-4 bg-white h-dvh flex flex-col gap-5">
            <Header />

            <div className='bg-[#F9F9F9] pt-7 border flex flex-col justify-center sm:justify-start sm:flex-row gap-5 sm:gap-2 items-center border-[#EDEDED] w-[85vw]  sm:w-[70vw] md:w-[50vw] lg:w-[600px] mx-auto  sm:h-[10vh] p-4  sm:p-2 rounded-md'>
                <Input
                    value={SearchInput}
                    onChange={(e) => SetSearchInput(e.target.value)}
                    className="w-[90%] sm:w-[70%] lg:w-[546px] bg-[#FFFFFF] rounded-xl ml-4 text-[#2B2B2B]"
                    placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                />
                <div className='flex flex-col [@media(min-width:450px)]:flex-row gap-4 sm:hidden items-center'>
                    <DateRangePicker
                        onUpdate={OnChangeDateRangePicker}
                        initialDateFrom={startdate}
                        initialDateTo={endDate}
                        align="start"
                        locale="en-GB"
                        showCompare={false}
                    />

                    <Select
                        onValueChange={(value) => {
                            onSelectLanguage(value);
                        }}
                        value={language}
                    >
                        <SelectTrigger className="mx-auto [@media(min-width:450px)]:mx-0  border border-[#E0614B] self-end  bg-[#FFFFFF] rounded-lg   font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
                            <SelectValue className="" />
                        </SelectTrigger>
                        <SelectContent className="text-[#E0614B]">
                            {optionsforLanguages.map((lan) => (
                                <SelectItem
                                    key={lan.label}
                                    value={lan.label}
                                    className="font-medium hover:text-[#E0614B] "
                                >
                                    {lan.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    className='bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'
                >
                    {TranslateText[language].SEARCH}
                </Button>
            </div>
        </div>
    )
}
