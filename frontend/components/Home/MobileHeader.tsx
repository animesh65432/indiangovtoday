import React from 'react'
import { LanguageContext } from '@/context/Lan'
import { TranslateText } from "@/lib/translatetext"
import { StateSelector } from '@/components/ui/StateSelector'

type Props = {
    selectedStates: string[]
    onStateClick: (state: string) => void
}

const MobileHeader: React.FC<Props> = ({ selectedStates, onStateClick }) => {
    const { language } = React.useContext(LanguageContext)
    const options = TranslateText[language].MULTISELECT_OPTIONS
    const lastOption = options[options.length - 1]

    return (
        <div className="flex items-center justify-between px-4 py-3 w-screen font-satoshi">

            <div className="w-9 h-9 rounded-xl flex items-center justify-center ">
                🇮🇳
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm max-w-[70vw] min-w-0">

                {/* City name — truncates if long */}
                <span className="text-sm text-gray-500 font-medium truncate max-w-[30%] shrink-0">
                    {selectedStates[0]}
                </span>

                <span className="text-gray-300 text-xs shrink-0">|</span>

                <div className="flex items-center gap-1 min-w-0 flex-1">
                    {/* State name — takes remaining space, truncates */}
                    <span className="text-sm font-semibold text-gray-800 truncate">
                        {lastOption.label}
                    </span>
                    {/* Chevron never shrinks */}
                    <div className="shrink-0">
                        <StateSelector
                            selectedState={lastOption.value}
                            onStateClick={onStateClick}
                        />
                    </div>
                </div>

            </div>

            <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                K
            </div>

        </div>
    )
}

export default MobileHeader