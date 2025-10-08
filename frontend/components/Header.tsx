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
import Image from "next/image";

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
        <main className="flex flex-col sm:flex-row items-center w-[85%] mx-auto sm:justify-between">
            <header className=" mb-0 sm:mb-8 w-full ">
                <div onClick={() => router.push("/")} className="relative h-[15vh] sm:h-[20vh] lg:h-[14vh] w-[32vw] sm:w-[20vw] lg:w-[10vw] hover:underline">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        fill
                        className="object-fill"
                    />
                </div>
            </header>
            {isHome &&
                <div className="flex gap-4 w-full justify-center">
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
                            <SelectTrigger className="border border-[#424242] p-1 font-light rounded  shadow-none text-[#353535] data-[placeholder]:text-[#353535] focus:ring-0 focus:outline-none">
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
