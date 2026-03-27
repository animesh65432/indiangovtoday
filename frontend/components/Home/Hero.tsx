import React from 'react'
import { motion } from 'framer-motion'
import Herotitle from './Herotitle'
import InputBox from './InputBox'
import HeroAnnoucments from './HeroAnnoucments'
import { useHeroScroll } from '@/hooks/useHeroScroll'
import { Announcement } from "@/types"

type Props = {
    StatesSelected: string[]
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    sheetOpen: boolean
    Announcements: Announcement[],
    IsLoading: boolean,
    SearchQuery: string,
    SetSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

const Hero: React.FC<Props> = ({
    StatesSelected,
    setSheetOpen,
    SetStatesSelected,
    sheetOpen,
    Announcements,
    IsLoading,
    SearchQuery,
    SetSearchQuery
}) => {
    const { titleOpacity, titleBlur, titleY, inputOpacity, inputY } = useHeroScroll()

    return (
        <div className="w-full h-auto md:h-screen bg-[url(/bg.png)] bg-cover bg-center flex flex-col gap-3 md:gap-6 pt-30">
            <motion.div
                style={{ opacity: titleOpacity, filter: titleBlur, y: titleY }}
                className="will-change-transform"
            >
                <Herotitle />
            </motion.div>

            <motion.div
                style={{ opacity: inputOpacity, y: inputY }}
                className="will-change-transform px-6"
            >
                <InputBox
                    StatesSelected={StatesSelected}
                    setSheetOpen={setSheetOpen}
                    SetStatesSelected={SetStatesSelected}
                    sheetOpen={sheetOpen}
                    SearchQuery={SearchQuery}
                    SetSearchQuery={SetSearchQuery}
                />
            </motion.div>

            <HeroAnnoucments
                announcements={Announcements}
                IsLoading={IsLoading}
            />
        </div>
    )
}

export default Hero