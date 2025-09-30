import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { optionsforLanguages } from "@/lib/lan";
import { UseLanguageContext } from "@/context/Lan";
import { useRouter } from "next/router";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns"
import { Currentdate } from "@/context/Currentdate"
import { useContext } from "react"

export default function Header() {
    const languageContext = UseLanguageContext();
    const router = useRouter()
    const [isHome, setIsHome] = useState(false);
    const { date, Oncahngedate } = useContext(Currentdate)


    if (!languageContext) {
        return null;
    }

    useEffect(() => {
        setIsHome(router.pathname === "/");
    }, [router.pathname]);

    const { onSelectLanguage, language } = languageContext;

    return (
        <main className="flex flex-col mt-5 mb-5">
            <header className="mb-8 text-center">
                <h1 onClick={() => router.push("/")} className="text-2xl md:text-4xl font-serif font-bold tracking-tight text-emerald-800">
                    IndianGovToday
                </h1>
                <p className="mt-2 text-gray-600 text-xs sm:text-[0.9rem] lg:text-xl italic">
                    Curated insights from the heart of India
                </p>
            </header>
            {isHome &&
                <div className="w-[93%] flex gap-5 justify-end">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                data-empty={!date}
                                className="text-black justify-start text-left font-normal"
                            >
                                <CalendarIcon />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={Oncahngedate}
                                required
                            />
                        </PopoverContent>
                    </Popover>
                    <ul>
                        <Select
                            onValueChange={(value) => {
                                onSelectLanguage(value);
                            }}
                            value={language}
                        >
                            <SelectTrigger className="border border-white p-1 font-light rounded focus:border-[#353535] shadow-none text-[#353535] data-[placeholder]:text-[#353535] focus:ring-0 focus:outline-none">
                                <SelectValue className="" />
                            </SelectTrigger>
                            <SelectContent className="">
                                {optionsforLanguages.map((lan) => (
                                    <SelectItem
                                        key={lan.label}
                                        value={lan.label}
                                        className="font-medium "
                                    >
                                        {lan.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </ul>
                </div>
            }
        </main>
    );
}
