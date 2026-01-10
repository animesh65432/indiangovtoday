import React, { useContext } from 'react'
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Currentdate } from "@/context/Currentdate";
import { Input } from "@/components/ui/input"
import { TranslateText } from "@/lib/translatetext"
import { Button } from "@/components/ui/button"
import { LanguageContext } from "@/context/Lan";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"
import { fadeInUp } from "@/lib/animations";
import Image from 'next/image';

type Props = {
    handleEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    SearchInput: string,
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>,
    dontRedirect: boolean
    SetIsButtomClicked?: React.Dispatch<React.SetStateAction<boolean>>
    ShowBackButton: boolean
}

const AnnoucementsHeader: React.FC<Props> = ({ ShowBackButton, handleEnterKeyPress, SearchInput, SetSearchInput, dontRedirect, SetIsButtomClicked }) => {
    const { startdate, endDate, onChangeDate } = useContext(Currentdate)
    const { language } = useContext(LanguageContext)
    const router = useRouter()

    const OnChangeDateRangePicker = (values: {
        range: { from?: Date; to?: Date };
        rangeCompare?: { from?: Date; to?: Date };
    }) => {
        if (values.range.from && values.range.to) {
            onChangeDate(values.range.from, values.range.to);
        }
    };

    const handleClick = () => {
        if (!SearchInput || SearchInput.trim() === "" || SearchInput.length < 3) {
            toast.info("Please enter at least 3 characters to search announcements.");
            return;
        }
        if (dontRedirect) {
            if (SetIsButtomClicked) {
                console.log("Button Clicked")
                SetIsButtomClicked((prev) => !prev);
            }
            return;
        }
        else {
            router.push(`/announcements?SearchInput=${SearchInput}`);
        }

    }

    return (
        <motion.header
            className='sticky top-0 p-5 z-50 flex flex-col shadow-md gap-6 bg-[#F8F8F8] pb-10'
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
        >   {ShowBackButton &&
            <nav className='w-[90%] sm:w-[80%] mx-auto block sm:hidden'>
                <Button
                    onClick={() => router.push("/#announcements")}
                    className='text-[#2C3143] border border-[#000000] rounded-none font-poppins'
                >
                    <Image src="/Left.svg" alt='arrow' width={14} height={14} />
                    {TranslateText[language].BACK}
                </Button>
            </nav>
            }
            <nav className='flex justify-between items-center w-[90%] sm:w-[80%] mx-auto'>
                <h2 className='text-[#272626] mx-auto lg:mx-0'>{TranslateText[language].LATEST_ANNOUNCEMENTS}</h2>
            </nav>
            <nav>
                <ul className='flex flex-col lg:flex-row  items-center gap-4 w-[80%] mx-auto'>
                    <Input
                        type="text"
                        value={SearchInput}
                        onChange={(e) => SetSearchInput(e.target.value)}
                        onKeyDown={handleEnterKeyPress}
                        placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                        className=" w-full md:w-2/3 lg:w-1/3  rounded-none border border-[#D9D9D9] placeholder:text-[#868686] p-5"
                    />
                    <Button onClick={handleClick} className='whitespace-nowrap p-5 bg-[#E04B4D] rounded-none text-[#FFFFFF]'>{TranslateText[language].SEARCH}</Button>
                    <li className='lg:ml-auto'>
                        <DateRangePicker
                            onUpdate={OnChangeDateRangePicker}
                            initialDateFrom={startdate}
                            initialDateTo={endDate}
                            align="start"
                            locale="en-GB"
                            showCompare={false}
                        />
                    </li>
                </ul>
            </nav>
        </motion.header>
    )
}

export default AnnoucementsHeader