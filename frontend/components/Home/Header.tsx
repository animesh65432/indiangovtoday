import React from 'react'
import Logo from '../ui/Logo'
import { useContext } from 'react'
import { LanguageContext } from '@/context/Lan'
import { TranslateText } from '@/lib/translatetext'
import CategoryOptions from './CategoryOptions'
import {
    Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription, SheetClose
} from "@/components/ui/sheet"
import { ChevronDown } from "lucide-react"

type Props = {
    categoryOptions: string[]
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>
    CategorySelected: string
    SetCategorySelected: React.Dispatch<React.SetStateAction<string>>
    selectedStates: string[]
    onStateClick: (state: string) => void
}

const Header: React.FC<Props> = ({
    categoryOptions,
    setCategoryOptions,
    CategorySelected,
    SetCategorySelected,
    selectedStates,
    onStateClick
}) => {
    const { language } = useContext(LanguageContext)
    return (
        <div className='bg-white rounded-lg flex flex-col'>
            <div className='px-2 py-2 flex items-center gap-4'>

                <Logo
                    fst={TranslateText[language].INDIAN}
                    snd={TranslateText[language].GOVTODAY}
                />

                <div className='border-l border-slate-200 h-6'></div>

                <div className='flex items-center'>
                    <div className='font-satoshi text-[0.9rem] p-1 rounded-md px-2 hover:bg-[#321F1F]/10'>
                        {TranslateText[language].MULTISELECT_OPTIONS[
                            TranslateText[language].MULTISELECT_OPTIONS.length - 1
                        ].label}
                    </div>
                    {selectedStates.length > 0 &&
                        <span className='text-slate-500'>.</span>
                    }
                    <div className='flex items-center gap-1 rounded-md hover:bg-[#321F1F]/10'>
                        {selectedStates.length > 1 &&
                            <div className='font-satoshi text-[0.9rem] p-1 rounded-md px-2 hover:bg-[#321F1F]/10 text-black'>
                                {selectedStates[1]}
                            </div>
                        }
                        <Sheet>
                            <SheetTrigger className='p-1 rounded-md hover:bg-[#321F1F]/10'>
                                <ChevronDown size={16} className='text-red-300' />
                            </SheetTrigger>
                            <SheetContent>

                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className='border-l border-slate-200 h-6'></div>

                <div className="font-satoshi rounded-lg bg-[#321F1F]/10 p-1 flex gap-1 items-center text-[0.8rem] w-fit">
                    <div className="px-3 py-1 bg-white rounded-md shadow-sm font-medium cursor-pointer transition-all duration-200">
                        Map
                    </div>
                    <div className="px-3 py-1 text-gray-600 hover:text-black rounded-md cursor-pointer transition-all duration-200 hover:bg-white/60">
                        Govt
                    </div>
                </div>
            </div>
            <div className='border-t border-slate-200'></div>
            <CategoryOptions
                categoryOptions={categoryOptions}
                setCategoryOptions={setCategoryOptions}
                CategorySelected={CategorySelected}
                SetCategorySelected={SetCategorySelected}
            />
        </div>
    )
}

export default Header