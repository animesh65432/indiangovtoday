import React, { useContext } from 'react'
import { Input } from '../ui/input'
import { Search } from "lucide-react"
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import ShowFilter from './ShowFilter'
import { TextGenerateEffect } from '../ui/text-generate-effect'

type MobileSearchInputProps = {
    ShowFilterCard: boolean;
    SetFilterShowCard: React.Dispatch<React.SetStateAction<boolean>>;
    StatesSelected: string[],
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>,
    DeparmentsSelected: string,
    SetDeparmentsSelected: React.Dispatch<React.SetStateAction<string>>
    SearchInput: string,
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>
    onSearch: () => void
}

const MobileSearchInput: React.FC<MobileSearchInputProps> = ({ SetFilterShowCard, ShowFilterCard, StatesSelected, SetStatesSelected,
    DeparmentsSelected, SetDeparmentsSelected,
    SearchInput, SetSearchInput,
    onSearch }) => {

    const { language } = useContext(LanguageContext)

    return (
        <div className='flex flex-col gap-5 md:hidden p-6'>
            <div className='w-[95vw] sm:w-[90vw] mx-auto'>
                <ul className='flex flex-col gap-2 sm:gap-1'>
                    <h2 className='uppercase'>public notification</h2>
                    <span className='uppercase text-[0.8rem] sm:text-[0.9rem] flex items-center gap-2'>
                        <span className=" border-2 border-t border-yellow-400 hidden sm:block w-8 h-0"></span>
                        <TextGenerateEffect
                            words="Direct Access to Verified Government Circulars"
                        />
                    </span>
                </ul>
            </div>
            <div className="relative w-full sm:w-[90vw] mx-auto">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                </div>
                <Input
                    onClick={() => SetFilterShowCard(!ShowFilterCard)}
                    className='bg-white p-5 pl-10 '
                    placeholder={TranslateText[language].INPUT_PLACEHOLDER}
                />
            </div>
            {ShowFilterCard &&
                <ShowFilter
                    StatesSelected={StatesSelected}
                    SetStatesSelected={SetStatesSelected}
                    DeparmentsSelected={DeparmentsSelected}
                    SetDeparmentsSelected={SetDeparmentsSelected}
                    SearchInput={SearchInput}
                    SetSearchInput={SetSearchInput}
                    onSearch={onSearch}
                    ShowFilterCard={ShowFilterCard}
                    SetFilterShowCard={SetFilterShowCard}
                />}
        </div>
    )
}

export default MobileSearchInput