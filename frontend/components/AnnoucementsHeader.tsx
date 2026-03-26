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
import Logo from './ui/Logo';
import { TranslateText } from '@/lib/translatetext';

type Props = {
    scrolled: boolean,
}

const AnnoucementsHeader: React.FC<Props> = ({ scrolled }) => {
    const { language, onSelectLanguage } = useContext(LanguageContext)

    return (
        <header className="flex items-center w-[95%] md:w-[80%] mx-auto mt-4">

            {/* Left (empty spacer) */}
            <div className="flex-1 md:block hidden" />

            {/* Center Logo */}
            <div className="flex justify-start md:justify-center flex-1">
                <Logo
                    fst={TranslateText[language].INDIAN}
                    snd={TranslateText[language].GOVTODAY}
                />
            </div>

            {/* Right Select */}
            <div className="flex justify-end flex-1">
                <Select
                    onValueChange={onSelectLanguage}
                    value={language}
                >
                    <SelectTrigger
                        IsLanguageSelect={true}
                        className="
          backdrop-blur-md
          border border-[#321F1F]
          uppercase text-[0.7rem] md:text-[0.8rem]
          font-tanker tracking-wider
          rounded-none
          px-3 py-2
          text-[#321F1F]
        "
                    >
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>

                    <SelectContent className='z-[999] [&_svg]:text-[#321F1F] border border-[#321F1F] rounded-md'>
                        {optionsforLanguages.map((lan) => (
                            <SelectItem
                                key={lan.label}
                                value={lan.label}
                                className="
              font-satoshi
              text-[#321F1F]
              hover:bg-gray-100
              cursor-pointer
            "
                            >
                                {lan.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

        </header>
    )
}

export default AnnoucementsHeader