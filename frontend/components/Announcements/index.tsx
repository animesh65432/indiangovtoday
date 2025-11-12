"use client"
import React, { useEffect, useState, useContext } from 'react'
import Header from '@/components/Home/Header'
import { SerachallIndiaAnnouncements } from "@/api/announcements"
import { Currentdate } from "@/context/Currentdate"
import { LanguageContext } from "@/context/Lan"
import { Announcement as AnnouncementsTypes, AnnouncementsResponse } from "@/types"
import StickyHeader from '../StickyHeader'
import Main from './Main'
import useDidUserScroll from "@/hooks/useDidUserScroll"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { TranslateText } from "@/lib/translatetext"
import Image from 'next/image'
import { DateRangePicker } from '../ui/DateRangePicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { optionsforLanguages } from '@/lib/lan'
import { useRouter } from "next/router"

type Props = {
    QueryInput: string
}

const Announcements = ({ QueryInput }: Props) => {
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [SearchInput, SetSearchInput] = useState<string>("")
    const { isScrolled } = useDidUserScroll()
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementsTypes[]>([])
    const { startdate, endDate, onChangeDate } = useContext(Currentdate)
    const { language, onSelectLanguage } = useContext(LanguageContext)
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)
    const router = useRouter()


    const fetchGetIndiaAnnouncements = async () => {
        SetIsLoading(true)
        try {
            const respose = await SerachallIndiaAnnouncements(language, startdate, endDate, page, limit, QueryInput) as AnnouncementsResponse
            SetAnnouncements(respose.data)
        } finally {
            SetIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGetIndiaAnnouncements()
    }, [language, startdate, endDate, language])

    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
            SetSearchInput("");
        }
    };

    return (
        <div className='flex flex-col gap-4 p-3 sm:p-0'>
            <StickyHeader
                route="/announcements"
                isVisible={isScrolled}
                SearchInput={SearchInput}
                SetSearchInput={SetSearchInput}
            />

            <Header />
            <div className='flex flex-col bg-white w-[80%] rounded-md mx-auto sm:mx-0 sm:w-[100%] sm:bg-transparent'>
                <div className='block sm:hidden w-[85%] mx-auto p-4'>
                    <div className={`relative h-[47px] w-[150px] mx-auto`} onClick={() => router.push("/")}>
                        <Image src="/Logo.png" alt='logo' fill />
                    </div>
                </div>
                <div className='flex gap-2 flex-col sm:flex-row items-center sm:items-start pb-3 sm:p-0'>
                    <Input className=' w-[80%] sm:w-[50%]  bg-white sm:ml-[20%]' placeholder={TranslateText[language].INPUT_PLACEHOLDER} />
                    <div className=' block mx-auto sm:hidden'>
                        <DateRangePicker
                            onUpdate={OnChangeDateRangePicker}
                            initialDateFrom={startdate}
                            initialDateTo={endDate}
                            align="start"
                            locale="en-GB"
                            showCompare={false}
                        />
                    </div>
                    <div className=' block sm:hidden'>
                        <Select
                            onValueChange={(value) => {
                                onSelectLanguage(value);
                            }}
                            value={language}
                        >
                            <SelectTrigger className="[@media(min-width:450px)]:mx-0  border border-[#E0614B] self-end  bg-[#FFFFFF] rounded-lg   font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
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
                    <Button className='bg-[#E0614B] w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'>{TranslateText[language].SEARCH}</Button>
                </div>
            </div>
            <Main
                Announcements={Announcements}
                IsLoading={IsLoading}
                SearchInput={SearchInput}
                SetSearchInput={SetSearchInput}
            />
        </div>
    )
}

export default Announcements