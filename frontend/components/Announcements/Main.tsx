import React, { useContext, useEffect, useState } from "react";
import { GetallGroupsIndiaAnnouncements as AnnouncementsTyps } from "@/types";
import { DateRangePicker } from "../ui/DateRangePicker";
import Image from "next/image";
import { TranslateText } from "@/lib/translatetext";
import { LanguageContext } from "@/context/Lan"
import { Currentdate } from "@/context/Currentdate"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "../ui/select";
import { optionsforLanguages } from "@/lib/lan";
import { useRouter } from "next/router"
import { LoaderCircleIcon } from "lucide-react"

type Props = {
    Announcements: AnnouncementsTyps[];
    IsLoading: boolean,
    QueryInput: string
};

const Main: React.FC<Props> = ({ Announcements, IsLoading, QueryInput }) => {
    const { language, onSelectLanguage } = useContext(LanguageContext)
    const { startdate, endDate, onChangeDate } = useContext(Currentdate)
    const [SearchInput, SetSearchInput] = useState<string>("")
    const router = useRouter()

    useEffect(() => {
        if (QueryInput) {
            SetSearchInput(QueryInput)
        }
    }, [QueryInput])

    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
        }
    };

    console.log(Announcements)

    return (
        <div className="min-h-screen   overflow-x-auto flex flex-col gap-4">
            <div className=' block sm:hidden relative h-[47px] w-[150px] ml-[5%]' onClick={() => router.push("/")} >
                <Image src="/Logo.png" alt='logo' fill />
            </div>

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
            <div className="flex flex-col space-y-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto mt-10">
                {IsLoading && Announcements.length === 0 &&
                    <div className="h-[40vh] flex justify-center items-center">
                        <LoaderCircleIcon className="h-8 w-8  animate-spin text-[#E0614B]" />
                    </div>
                }
                {!IsLoading && Announcements.length > 0 ? Announcements.map((group, groupIdx) => (
                    <div
                        key={group.type}
                        className="w-full flex flex-col space-y-6 animate-fade-in hover:underline hover:cursor-pointer"
                        style={{ animationDelay: `${groupIdx * 100}ms` }}
                        onClick={() => router.push(`/announcements/${language === "English" ? group.announcements[0].type : group.announcements[0].original_type}`)}
                    >
                        {/* Group Title with Accent */}
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-1.5 bg-gradient-to-b from-[#E0614B] to-[#ff8c75] rounded-full"></div>
                            <p className="  text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E0614B] to-[#ff8c75] bg-clip-text text-transparent">
                                {group.type}
                            </p>
                        </div>

                        {/* Announcement Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.announcements.map((an, idx) => (
                                <div
                                    key={an._id || an.title}
                                    className="group relative bg-white hover:bg-gradient-to-br hover:from-white hover:to-orange-50 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl p-6 border border-gray-100 hover:border-[#E0614B]/30 flex flex-col space-y-3 overflow-hidden transform hover:-translate-y-2"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    {/* Decorative Element */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E0614B]/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>


                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className=" text-[1rem] sm:text-xl font-bold text-gray-800 hover:text-[#E0614B] transition-colors duration-300 pr-10 leading-tight group-hover:underline decoration-2 underline-offset-4"
                                    >
                                        {an.title}
                                    </a>

                                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                                        {an.summary || "No summary available."}
                                    </p>

                                    {/* View More Link */}
                                    <div onClick={() => router.push(`/announcement?id=${an._id}&lan=${language}`)} className="flex items-center space-x-2 text-[#E0614B] font-medium text-sm pt-2 border-t border-gray-100 group-hover:border-[#E0614B]/30 transition-colors">
                                        <span>View Details</span>
                                        <svg
                                            className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : <div className="w-full flex items-center justify-center ">
                    <div className="text-center space-y-3">
                        <div className="text-6xl">📢</div>
                        <p className="text-2xl font-semibold text-gray-800">No Announcements Yet</p>
                        <p className="text-gray-500">Check back soon for updates</p>
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default Main;