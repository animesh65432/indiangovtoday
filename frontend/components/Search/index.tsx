import React, { useState } from 'react'
import StickyNav from './StickyNav'
import { useHeroScroll } from '@/hooks/useHeroScroll'
import InputBox from '../Home/InputBox'
import { motion } from 'framer-motion'

type Props = {
    query: string
    startDate: string
    endDate: string
    states: string[]
}

const Search: React.FC<Props> = ({ query, startDate, endDate, states }) => {
    const [sheetOpen, setSheetOpen] = useState(false)
    const [statesSelected, setStatesSelected] = useState<string[]>(states)

    const { inputY, scrolled, inputOpacity } = useHeroScroll()

    return (
        <section className="w-full flex flex-col pt-20">
            {/* Sticky Navbar */}
            <StickyNav
                scrolled={scrolled}
                StatesSelected={statesSelected}
                onApply={() => { }}
                onReset={() => { }}
                setSheetOpen={setSheetOpen}
                SetStatesSelected={setStatesSelected}
                sheetOpen={sheetOpen}
            />

            {/* Main Input (center area) */}
            <motion.div
                style={{ opacity: inputOpacity, y: inputY }}
                className="px-6"
            >
                <InputBox
                    StatesSelected={statesSelected}
                    onApply={() => { }}
                    onReset={() => { }}
                    setSheetOpen={setSheetOpen}
                    SetStatesSelected={setStatesSelected}
                    sheetOpen={sheetOpen}
                />
            </motion.div>
        </section>
    )
}

export default Search