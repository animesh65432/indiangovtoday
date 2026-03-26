import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnnoucementsHeader from '../AnnoucementsHeader'
import InputBox from '../Home/InputBox'


type Props = {
    scrolled: boolean
    StatesSelected: string[]
    onApply: () => void
    onReset: () => void
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    sheetOpen: boolean

}

const StickyNav: React.FC<Props> = ({ scrolled, StatesSelected, onApply, onReset, setSheetOpen, SetStatesSelected, sheetOpen }) => {
    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-50 flex flex-col border-b transition-colors duration-300"
            animate={{
                backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0)',
                borderColor: scrolled ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0)',
                backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
                boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <AnnoucementsHeader scrolled={scrolled} />

            <AnimatePresence>
                {scrolled && (
                    <motion.div
                        key="sticky-search"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                        className="overflow-hidden px-6 pb-3"
                    >
                        <InputBox
                            StatesSelected={StatesSelected}
                            onApply={onApply}
                            onReset={onReset}
                            setSheetOpen={setSheetOpen}
                            SetStatesSelected={SetStatesSelected}
                            sheetOpen={sheetOpen}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default StickyNav