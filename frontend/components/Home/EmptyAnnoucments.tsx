import { motion } from 'motion/react'
import { TranslateText } from "@/lib/translatetext"
import { LanguageContext } from '@/context/Lan'
import React from 'react'
import { ThemeContext } from '@/context/Theme'

const EmptyAnnouncements = () => {
    const { language } = React.useContext(LanguageContext)
    const { theme } = React.useContext(ThemeContext)
    const isDark = theme === "dark"

    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <motion.div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#321F1F0F" }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
            >
                <motion.svg
                    width="52" height="52" viewBox="0 0 64 64"
                    fill="none" xmlns="http://www.w3.org/2000/svg"
                    initial={{ rotate: -15 }}
                    animate={{ rotate: [0, -12, 10, -6, 4, 0] }}
                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeInOut' }}
                >
                    <motion.path
                        d="M32 8C22 8 14 16 14 26V38L8 44H56L50 38V26C50 16 42 8 32 8Z"
                        fill={isDark ? "rgba(255,255,255,0.12)" : "#321F1F"}
                        fillOpacity={isDark ? 1 : 0.12}
                        stroke={isDark ? "rgba(255,255,255,0.4)" : "#321F1F"}
                        strokeWidth="2" strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    />
                    <motion.path
                        d="M27 44C27 46.76 29.24 49 32 49C34.76 49 37 46.76 37 44"
                        stroke={isDark ? "rgba(255,255,255,0.4)" : "#321F1F"}
                        strokeWidth="2" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                    />
                    <motion.line
                        x1="10" y1="10" x2="54" y2="54"
                        stroke="#c51057" strokeWidth="2.5" strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.45, delay: 0.85, ease: 'easeOut' }}
                    />
                </motion.svg>
            </motion.div>

            <motion.h3
                className="text-lg font-semibold tracking-tight m-0 font-satoshi"
                style={{ color: isDark ? "rgba(255,255,255,0.8)" : "#321F1F" }}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.4, ease: 'easeOut' }}
            >
                {TranslateText[language].NO_ANNOUNCEMENTS_FOUND}
            </motion.h3>
        </div>
    )
}

export default EmptyAnnouncements