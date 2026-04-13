import React, { useContext } from 'react'
import Logo from '../ui/Logo'
import { LanguageContext } from '@/context/Lan'
import { TranslateText } from '@/lib/translatetext'
import CategoryOptions from './CategoryOptions'
import { StateSelector } from '@/components/ui/StateSelector'
import { ThemeContext } from '@/context/Theme'

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
    const { theme } = useContext(ThemeContext)

    const allStatesLabel = TranslateText[language].MULTISELECT_OPTIONS[
        TranslateText[language].MULTISELECT_OPTIONS.length - 1
    ].label

    return (
        <div className={`${theme === "dark" ? "bg-black" : "bg-white"} rounded-lg flex flex-col `}>
            <div className='px-2 py-2 flex items-center gap-2'>

                <div className='shrink-0'>
                    <Logo
                        fst={TranslateText[language].INDIAN}
                        snd={TranslateText[language].GOVTODAY}
                    />
                </div>

                <div className='border-l border-slate-200 h-6 shrink-0' />
                <div className='min-w-0 flex items-center'>

                    {/* "Indian Govt" label — fixed, never shrinks */}
                    <div className='shrink-0 font-satoshi text-[0.9rem] p-1 px-2 rounded-md hover:bg-[#321F1F]/10'>
                        {allStatesLabel}
                    </div>

                    {selectedStates.length > 0 && (
                        <span className='text-slate-400 shrink-0 mx-0.5'>·</span>
                    )}

                    {selectedStates.length > 0 && (
                        <div className='min-w-0 flex items-center rounded-md hover:bg-[#321F1F]/10'>
                            {/* Cap long state names at ~120px, truncate with tooltip */}
                            <div
                                title={selectedStates[0]}
                                className='font-satoshi text-[0.9rem] p-1 px-2 text-black truncate max-w-[120px]'
                            >
                                {selectedStates[0]}
                            </div>
                            <StateSelector
                                selectedState={selectedStates[0] ?? ''}
                                onStateClick={onStateClick}

                            />
                        </div>
                    )}

                    {/* Show trigger even when nothing selected */}
                    {selectedStates.length === 0 && (
                        <StateSelector
                            selectedState=''
                            onStateClick={onStateClick}
                        />
                    )}

                </div>

                <div className='border-l border-slate-200 h-6 shrink-0' />

                {/* Map / Govt toggle — never shrinks */}
                <div className='font-satoshi rounded-lg bg-[#321F1F]/10 p-1 flex gap-1 items-center text-[0.8rem]'>
                    <div className='px-3 py-1 bg-white rounded-md shadow-sm font-medium cursor-pointer transition-all duration-200'>
                        Map
                    </div>
                    <div className='px-3 py-1 text-gray-600 hover:text-black rounded-md cursor-pointer transition-all duration-200 hover:bg-white/60'>
                        Govt
                    </div>
                </div>

            </div>

            <div className='border-t border-slate-200' />

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