import React, { useContext } from 'react'
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeContext } from '@/context/Theme'

const Theme: React.FC = () => {
    const { theme, onChangeTheme } = useContext(ThemeContext)

    const toggleTheme = () => {
        onChangeTheme(theme === "light" ? "dark" : "light")
    }

    return (
        <div className="flex items-center gap-4">
            <motion.div
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-200 shadow-sm text-xl cursor-pointer"
            >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </motion.div>
        </div>
    )
}

export default Theme