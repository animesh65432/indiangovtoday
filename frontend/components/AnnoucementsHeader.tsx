import React, { useContext } from 'react'
import { LanguageContext } from "@/context/Lan";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { optionsforLanguages } from "@/lib/lan"

const AnnoucementsHeader: React.FC = () => {
    const { language, onSelectLanguage } = useContext(LanguageContext)

    return (
        <header className='h-14 flex items-center justify-between  pt-5 border-0  mx-auto w-[96vw] lg:w-[85vw]'>
            <nav>
                <span className='text-xl font-bold uppercase font-poppins text-black'>
                    INDIANGOVTODAY
                </span>
            </nav>
            <nav>
                <Select
                    onValueChange={onSelectLanguage}
                    value={language}
                >
                    <SelectTrigger
                        IsLanguageSelect={true}
                        className=" border-2 border-black text-black uppercase text-[0.8rem] font-poppins  rounded-none font-bold"
                    >
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {optionsforLanguages.map((lan) => (
                            <SelectItem key={lan.label} value={lan.label} className='font-medium'>
                                {lan.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </nav>
        </header >
    )
}

export default AnnoucementsHeader