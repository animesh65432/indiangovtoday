"use client"
import React, { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import Header from '@/components/Home/Header'
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/ui/DateRangePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LANGUAGE_CODES, optionsforLanguages } from "@/lib/lan"
import { Button } from "@/components/ui/button"
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from "@/context/Lan"
import { Currentdate } from "@/context/Currentdate"
import { GetGroupIndiaAnnouncements } from "@/api/announcements"
import { LoaderCircle, Calendar } from "lucide-react"
import Image from "next/image"
import { formatDateInLanguage } from "@/lib/formatDate"


type AnnouncementsTypes = {
    created_at: string;
    title: string
    type: string
    _id: string,
    summary: string
}

export default function GroupPage() {
    const [groupValue, setGroupValue] = useState<string | null>(null)
    const [searchInput, setSearchInput] = useState("")
    const [announcements, setAnnouncements] = useState<AnnouncementsTypes[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [filteredAnnouncements, setfilteredAnnouncements] = useState<AnnouncementsTypes[]>([])
    const router = useRouter()
    const { group } = router.query
    const { language, onSelectLanguage } = useContext(LanguageContext)
    const { startdate, endDate, onChangeDate } = useContext(Currentdate)

    useEffect(() => {
        if (group) {
            const groupParam = Array.isArray(group) ? group[0] : group;
            setGroupValue(groupParam);
        }
    }, [group])

    async function init() {
        setIsLoading(true)
        setError(null)
        try {
            if (groupValue) {
                const response = await GetGroupIndiaAnnouncements(
                    language,
                    startdate,
                    endDate,
                    groupValue
                ) as { data: AnnouncementsTypes[] }

                setAnnouncements(response.data)
                setfilteredAnnouncements(response.data)
            }
        } catch (err) {
            setError("Failed to load announcements")
            console.error("Error fetching announcements:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const onChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
        }
    };


    // Group announcements by type


    // Format date consistently

    useEffect(() => {
        init()
    }, [language, startdate, endDate, groupValue])

    const handleSearch = () => {
        const searchLower = searchInput.toLowerCase();
        const filter = announcements.filter(announcement =>
            announcement.title.toLowerCase().includes(searchLower) ||
            announcement.type.toLowerCase().includes(searchLower) ||
            announcement.summary?.toLowerCase().includes(searchLower)
        );
        setfilteredAnnouncements(filter)
    };

    return (
        <div className="p-4  min-h-dvh w-[100vw] bg-[url(/Annoucementsbackgroundimage.png)] flex flex-col gap-3 sm:gap-10">
            <header className=" min-h-[400px]:h-[20vh] sm:h-[35vh] md:h-[30vh] flex flex-col gap-4">

                <Image onClick={() => router.push("/")} src="/Logo.png" alt='logo' width={150} height={150} className=" block sm:hidden" />
                <div className=" hidden sm:block">
                    <Header />
                </div>

                <div className='bg-[#F9F9F9]  sm:pt-7 border flex flex-col justify-center sm:justify-start sm:flex-row gap-5 sm:gap-2 items-center border-[#EDEDED] w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-[600px] mx-auto sm:h-[10vh] p-4  rounded-md'>
                    <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-[90%] sm:w-[70%] lg:w-[546px] bg-[#FFFFFF] rounded-xl ml-4 text-[#2B2B2B]"
                        placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                    />
                    <div className='flex flex-col [@media(min-width:450px)]:flex-row gap-4 sm:hidden items-center'>
                        <DateRangePicker
                            onUpdate={onChangeDateRangePicker}
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
                            <SelectTrigger className="mx-auto [@media(min-width:450px)]:mx-0 border border-[#E0614B] self-end bg-[#FFFFFF] rounded-lg font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] data-[placeholder]:text-[#E0614B] focus:ring-0 focus:outline-none">
                                <SelectValue className="" />
                            </SelectTrigger>
                            <SelectContent className="text-[#E0614B]">
                                {optionsforLanguages.map((lan) => (
                                    <SelectItem
                                        key={lan.label}
                                        value={lan.label}
                                        className="font-medium hover:text-[#E0614B]"
                                    >
                                        {lan.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleSearch}
                        className='bg-[#E0614B] lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'
                    >
                        {TranslateText[language].SEARCH}
                    </Button>
                </div>

                {filteredAnnouncements.length > 0 ?
                    <div className=" underline text-[1.5rem] md:text-2xl w-[85%] text-[#de6c58] mx-auto mb-4">
                        {filteredAnnouncements[0].type}
                    </div> : null
                }
            </header>

            <main className=" h-[58vh] sm:h-[60vh] overflow-x-auto mt-5 sm:mt-0">
                {isLoading && (
                    <div className=" w-full flex justify-center items-center">
                        <LoaderCircle className="text-[#E0614B] h-8 w-8 animate-spin" />
                    </div>
                )}

                {error && !isLoading && (
                    <div className="w-[85%] mx-auto mt-7 text-center text-red-500">
                        {error}
                    </div>
                )}

                {!isLoading && !error && filteredAnnouncements.length === 0 && announcements.length === 0 && (
                    <div className="w-[85%] mx-auto mt-7 text-center text-gray-500">
                        No announcements found
                    </div>
                )}

                {!isLoading && !error && filteredAnnouncements.length === 0 && announcements.length > 0 && (
                    <div className="w-[85%] mx-auto mt-7 text-center text-gray-500">
                        No announcements match your search
                    </div>
                )}


                {!isLoading && !error && filteredAnnouncements.length > 0 && (
                    <div className="flex flex-col gap-8 w-[85%] mx-auto mt-7 pb-8">
                        <div className="flex flex-col gap-3">
                            {filteredAnnouncements.map((announcement) => (
                                <div
                                    key={announcement._id}
                                    className="bg-white border border-[#EDEDED] rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col gap-4"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className="text-[#2B2B2B]  text-base md:text-lg flex-1 ">
                                            {announcement.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs md:text-sm whitespace-nowrap flex-shrink-0">
                                            <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                            <span>{formatDateInLanguage(announcement.created_at, LANGUAGE_CODES[language])}</span>
                                        </div>
                                    </div>
                                    {announcement.summary && (
                                        <p className="text-gray-600 ">
                                            {announcement.summary}
                                        </p>
                                    )}
                                    <Button onClick={() => router.push(`/announcement?id=${announcement._id}&lan=${language}`)} className="bg-[#E0614B] w-[100px] ml-auto hover:bg-[#b78d86]">
                                        {TranslateText[language].SEE_MORE}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}