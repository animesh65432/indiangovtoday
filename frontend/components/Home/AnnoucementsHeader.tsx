import React, { useContext } from 'react'
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Currentdate } from "@/context/Currentdate";
import { Input } from "@/components/ui/input"
import { TranslateText } from "@/lib/translatetext"
import { Button } from "@/components/ui/button"
import { LanguageContext } from "@/context/Lan";
import { useRouter } from 'next/router';

type Props = {
    handleEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    SearchInput: string,
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>,
}

const AnnoucementsHeader: React.FC<Props> = ({ handleEnterKeyPress, SearchInput, SetSearchInput }) => {
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
        router.push(`/announcements?SearchInput=${SearchInput}`);

    }

    return (
        <header className='pt-10  w-[85%] mx-auto flex flex-col gap-6'>
            <nav className='flex justify-between items-center'>
                <ul>
                    <h2 className='text-[#272626]'>Latest Announcements </h2>
                </ul>
                <ul className=' hidden md:block'>
                    <DateRangePicker
                        onUpdate={OnChangeDateRangePicker}
                        initialDateFrom={startdate}
                        initialDateTo={endDate}
                        align="start"
                        locale="en-GB"
                        showCompare={false}
                    />
                </ul>
            </nav>
            <nav className='flex flex-col md:flex-row  items-center gap-4'>
                <Input
                    type="text"
                    value={SearchInput}
                    onChange={(e) => SetSearchInput(e.target.value)}
                    onKeyDown={handleEnterKeyPress}
                    placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                    className="w-full md:w-1/3  bg-white dark:bg-gray-800 text-[#272626]  placeholder:text-[#272626] border border-[#272626] dark:border-gray-600  rounded-md  py-2 px-4  "
                />
                <ul className='flex flex-col sm:flex-row items-center gap-4'>
                    <li className='block md:hidden'>
                        <DateRangePicker
                            onUpdate={OnChangeDateRangePicker}
                            initialDateFrom={startdate}
                            initialDateTo={endDate}
                            align="start"
                            locale="en-GB"
                            showCompare={false}
                        />
                    </li>

                    <Button onClick={handleClick} className='whitespace-nowrap'>{TranslateText[language].SEARCH}</Button>
                </ul>
            </nav>
        </header>
    )
}

export default AnnoucementsHeader