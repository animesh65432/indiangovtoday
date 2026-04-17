import React, { useContext } from 'react'
import Logo from '../ui/Logo'
import { LanguageContext } from '@/context/Lan'
import { TranslateText } from '@/lib/translatetext'
import { CheckIfUserStateInBriefing } from "@/lib/CheckIfUserStateInBriefing"
import CategoryOptions from './CategoryOptions'
import { StateSelector } from '@/components/ui/StateSelector'
import { ThemeContext } from '@/context/Theme'
import { Brief_Announcement } from '@/types'
import InputBox from './InputBox'

type Props = {
    CategorySelected: string
    SetCategorySelected: React.Dispatch<React.SetStateAction<string>>
    selectedStates: string[]
    onStateClick: (state: string) => void,
    BriefAnnouncements: Brief_Announcement[],
    StatesSelected: string[],
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>,
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>,
    sheetOpen: boolean,
    SearchQuery: string,
    SetSearchQuery: React.Dispatch<React.SetStateAction<string>>,
    handleClick: () => void
}

const Header: React.FC<Props> = ({
    CategorySelected,
    SetCategorySelected,
    selectedStates,
    onStateClick,
    BriefAnnouncements = [],
    SetStatesSelected,
    StatesSelected,
    setSheetOpen,
    sheetOpen,
    SearchQuery,
    SetSearchQuery,
    handleClick
}) => {
    const { language } = useContext(LanguageContext)
    const { theme } = useContext(ThemeContext)

    const allStatesLabel = TranslateText[language].MULTISELECT_OPTIONS[
        TranslateText[language].MULTISELECT_OPTIONS.length - 1
    ].label

    const UserState = CheckIfUserStateInBriefing(selectedStates, language)


    return (
        <div className={`${theme === "dark" ? "bg-[#050505]" : "bg-white"} rounded-lg flex flex-col `}>
            <div className='px-2 py-2 flex items-center gap-2'>

                <div className='shrink-0'>
                    <Logo
                        fst={TranslateText[language].INDIAN}
                        snd={TranslateText[language].GOVTODAY}
                    />
                </div>

                <div className='border-l border-slate-200 h-6 shrink-0' />
                <div className='min-w-0 flex items-center'>


                    <div className={`shrink-0 font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-500"} font-satoshi text-[0.9rem] p-1 px-2 rounded-md hover:bg-[#321F1F]/10`}>
                        {allStatesLabel}
                    </div>

                    {selectedStates.length > 0 && (
                        <span className='text-slate-400 shrink-0 mx-0.5'>·</span>
                    )}

                    {selectedStates.length > 0 && (
                        <div className={`min-w-0 ${theme === "dark" ? "text-white" : "text-black"} flex items-center rounded-md hover:bg-[#321F1F]/10`}>
                            <div
                                title={UserState}
                                className={`font-satoshi text-[0.9rem] p-1 px-2 truncate max-w-30 ${theme === "dark" ? "text-white" : "text-black"
                                    }`}
                            >
                                {UserState}
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


                <div className={`font-satoshi rounded-lg p-1 flex gap-1 items-center text-[0.8rem] ${theme === "dark" ? "bg-white/10" : "bg-[#321F1F]/10"
                    }`}>


                    <div className={`px-3 py-1 rounded-md shadow-sm font-medium cursor-pointer transition-all duration-200 ${theme === "dark"
                        ? "bg-white text-black"
                        : "bg-white text-black"
                        }`}>
                        Map
                    </div>

                    <div className={`px-3 py-1 rounded-md cursor-pointer transition-all duration-200 ${theme === "dark"
                        ? "text-gray-300 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-black hover:bg-white/60"
                        }`}>
                        Govt
                    </div>
                </div>

            </div>

            <div className='border-t border-slate-200' />

            <CategoryOptions
                CategorySelected={CategorySelected}
                SetCategorySelected={SetCategorySelected}
            />
            <InputBox
                StatesSelected={StatesSelected}
                setSheetOpen={setSheetOpen}
                SetStatesSelected={SetStatesSelected}
                sheetOpen={sheetOpen}
                SearchQuery={SearchQuery}
                SetSearchQuery={SetSearchQuery}
                handleClick={handleClick}
            />
        </div>
    )
}

export default Header