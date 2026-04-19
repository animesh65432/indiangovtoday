import { LanguageContext } from '@/context/Lan'
import { TranslateText } from "@/lib/translatetext"
import User from "./User"
import { GetUserStateCode } from "@/lib/GetUserStateCode"
import { StateSelector } from '@/components/ui/StateSelector'
import { useContext } from 'react'
import { ThemeContext } from '@/context/Theme'


type Props = {
    selectedStates: string[]
    onStateClick: (state: string) => void
    sheetOpen: boolean
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
    StatesSelected: string[]
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    SearchQuery: string
    SetSearchQuery: React.Dispatch<React.SetStateAction<string>>
    handleSearch: () => void
}

const MobileHeader: React.FC<Props> = ({ selectedStates, onStateClick, sheetOpen, setSheetOpen, StatesSelected, SetStatesSelected, SearchQuery, SetSearchQuery, handleSearch }) => {
    const { language } = useContext(LanguageContext)
    const { theme } = useContext(ThemeContext)
    const options = TranslateText[language].MULTISELECT_OPTIONS
    const lastOption = options[options.length - 1]
    const isDark = theme === "dark"
    const userStateCode = GetUserStateCode(selectedStates, language)


    return (
        <div className="flex items-center justify-between px-4 py-3 w-screen font-satoshi">

            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? "bg-transparent" : "bg-white"} ${isDark ? "" : "border border-gray-200"} text-xl shrink-0`}>
                🇮🇳
            </div>

            <div className={`flex items-center gap-2 ${isDark ? "bg-[#050505]" : "bg-white"} ${isDark ? "border border-gray-10" : " border border-gray-200"} rounded-full px-4 py-2 shadow-sm max-w-[70vw] min-w-0`}>

                <span className="text-[0.9rem] text-gray-400 font-satoshi font-medium shrink-0  tracking-wide">
                    {lastOption.label}
                </span>

                <span className="text-gray-200 text-xs shrink-0">|</span>

                <div className="flex items-center gap-0.5 min-w-0 flex-1">
                    <span className={`text-sm font-semibold ${isDark ? "text-gray-200" : "} text-gray-800"} truncate`}>
                        {userStateCode}
                    </span>
                    <StateSelector
                        selectedState={selectedStates[0]}
                        onStateClick={onStateClick}
                    />
                </div>

            </div>
            <User
                sheetOpen={sheetOpen}
                setSheetOpen={setSheetOpen}
                StatesSelected={StatesSelected}
                SetStatesSelected={SetStatesSelected}
                SearchQuery={SearchQuery}
                SetSearchQuery={SetSearchQuery}
                handleSearch={handleSearch}
            />
        </div>
    )
}

export default MobileHeader