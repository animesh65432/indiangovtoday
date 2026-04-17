import { LanguageContext } from '@/context/Lan'
import { TranslateText } from "@/lib/translatetext"
import User from "./User"
import { StateSelector } from '@/components/ui/StateSelector'
import { useContext } from 'react'

type Props = {
    selectedStates: string[]
    onStateClick: (state: string) => void
}

const MobileHeader: React.FC<Props> = ({ selectedStates, onStateClick }) => {
    const { language } = useContext(LanguageContext)
    const options = TranslateText[language].MULTISELECT_OPTIONS
    const lastOption = options[options.length - 1]


    return (
        <div className="flex items-center justify-between px-4 py-3 w-screen font-satoshi">

            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-200 shadow-sm text-xl shrink-0">
                🇮🇳
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm max-w-[70vw] min-w-0">

                {/* District / option label */}
                <span className="text-[0.9rem] text-gray-400 font-satoshi font-medium shrink-0  tracking-wide">
                    {lastOption.label}
                </span>

                <span className="text-gray-200 text-xs shrink-0">|</span>

                {/* Selected state + dropdown trigger */}
                <div className="flex items-center gap-0.5 min-w-0 flex-1">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                        {selectedStates[0]}
                    </span>
                    <StateSelector
                        selectedState={selectedStates[0]}
                        onStateClick={onStateClick}
                    />
                </div>

            </div>
            <User />
        </div>
    )
}

export default MobileHeader