"use client";
import React, { useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { LanguageContext } from "@/context/Lan";
import { Currentdate } from "@/context/Currentdate";
import { optionsforLanguages } from "@/lib/lan";
import { TranslateText } from "@/lib/translatetext";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
    SearchInput: string,
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>,
    isVisible: boolean,
    route: "/" | "/announcements" | "/announcement",
    SetIsButtomClicked?: React.Dispatch<React.SetStateAction<boolean>>
}
const StickyHeader: React.FC<Props> = ({ isVisible, SearchInput, SetSearchInput, route, SetIsButtomClicked }) => {
    const { startdate, endDate, onChangeDate } = useContext(Currentdate);
    const { language, onSelectLanguage } = useContext(LanguageContext);
    const router = useRouter()

    const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (route === "/") {
                router.push(`/announcements?SearchInput=${SearchInput}`);
            } else {
                SetIsButtomClicked?.((prev) => !prev);
            }
        }
    };

    const handleClick = () => {
        if (route === "/") {
            router.push(`/announcements?SearchInput=${SearchInput}`);
        } else {
            SetIsButtomClicked?.((prev) => !prev);
        }
    }


    return (
        <div
            className={`fixed top-6 left-[8%] w-[85%]  rounded-xl z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 transition-all duration-500 ease-in-out
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}
      `}
        >
            <div className="flex flex-col sm:flex-row items-center justify-start md:justify-between  py-3 px-4">
                <div className={`relative h-[47px] w-[150px]`} onClick={() => router.push("/")}>
                    <Image src="/Logo.png" alt='logo' fill />
                </div>
                <div className=" hidden md:flex items-center gap-3">
                    <DateRangePicker
                        onUpdate={(values) => {
                            if (values.range.from && values.range.to) {
                                onChangeDate(values.range.from, values.range.to);
                            }
                        }}
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
                        <SelectTrigger className=" bg-[#FFFFFF] rounded-lg font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] focus:ring-0 focus:outline-none w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {optionsforLanguages.map((lan) => (
                                <SelectItem key={lan.label} value={lan.label} className="font-medium hover:text-[#E0614B]">
                                    {lan.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <div className="mx-auto w-[80%] pb-3 md:p-4 flex flex-col md:flex-row items-center gap-2">
                <Input
                    value={SearchInput}
                    onChange={(e) => SetSearchInput(e.target.value)}
                    onKeyDown={handleEnterKeyPress}
                    placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                    className=" w-[65vw] sm:w-[50vw]  bg-white rounded-lg border border-black text-black placeholder:text-black"
                />
                <div className="hidden sm:flex sm:flex-row md:hidden items-center gap-3">
                    <DateRangePicker
                        onUpdate={(values) => {
                            if (values.range.from && values.range.to) {
                                onChangeDate(values.range.from, values.range.to);
                            }
                        }}
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
                        <SelectTrigger className=" bg-[#FFFFFF] rounded-lg font-light shadow-[4px_4px_0_0_#00000029] text-[#E0614B] focus:ring-0 focus:outline-none w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {optionsforLanguages.map((lan) => (
                                <SelectItem key={lan.label} value={lan.label} className="font-medium hover:text-[#E0614B]">
                                    {lan.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleClick} className=" sm:block w-[150px]  rounded-xl shadow-[4px_4px_0_0_#00000029]">
                    {TranslateText[language].SEARCH}
                </Button>
            </div>
        </div>
    );
};

export default StickyHeader;
