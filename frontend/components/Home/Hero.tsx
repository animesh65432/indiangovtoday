'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Herotitle from './Herotitle'
import InputBox from './InputBox'
import HeroAnnoucments from './HeroAnnoucments'
import { useHeroScroll } from '@/hooks/useHeroScroll'

type Props = {
    StatesSelected: string[]
    onApply: () => void
    onReset: () => void
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    sheetOpen: boolean
    categoryOptions: string[]
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>
}

const Hero: React.FC<Props> = ({
    StatesSelected,
    onApply,
    onReset,
    setSheetOpen,
    SetStatesSelected,
    sheetOpen,
    categoryOptions,
    setCategoryOptions
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
                    onApply={onApply}
                    onReset={onReset}
                    setSheetOpen={setSheetOpen}
                    SetStatesSelected={SetStatesSelected}
                    sheetOpen={sheetOpen}
                    categoryOptions={categoryOptions}
                    setCategoryOptions={setCategoryOptions}
                />
            </motion.div>

            <HeroAnnoucments />
        </div>
    )
}

export default Hero