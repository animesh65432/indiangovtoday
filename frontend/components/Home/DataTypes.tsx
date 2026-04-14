import React from 'react'
import { categoryStyles } from "@/lib/categoryStyles"
import { ThemeContext } from '@/context/Theme'

const DataTypes: React.FC = () => {
    const { theme } = React.useContext(ThemeContext)
    return (
        <div className={`z-500 p-3 ${theme === "light" ? "bg-white" : "bg-[#050505]"} rounded-lg px-5 flex flex-col gap-2 font-satoshi shadow-sm`}>
            <div className={`uppercase text-[0.7rem] tracking-wider ${theme === "dark" ? "text-slate-400" : "text-slate-600"} font-medium`}>
                Data Types
            </div>
            <div className='flex flex-col gap-1.5'>
                {Object.entries(categoryStyles).map(([category, styles]) => (
                    <div key={category} className='flex items-center gap-2'>
                        <span
                            className='w-2 h-2 rounded-full shrink-0'
                            style={{ background: styles.dot }}
                        />
                        <span className={`text-[0.75rem] ${theme === "dark" ? "text-white" : "text-slate-600"}`}>{category}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DataTypes