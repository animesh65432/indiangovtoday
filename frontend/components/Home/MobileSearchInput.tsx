import React, { useContext } from 'react'
import { Input } from '../ui/input'
import { Search } from "lucide-react"
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import ShowFilter from './ShowFilter'

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
        <div className='block md:hidden p-4'>
            <div className="relative w-full">
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