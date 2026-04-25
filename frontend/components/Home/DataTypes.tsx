import React, { useContext, useEffect, useState } from 'react'
import { getCategoryStyle } from "@/lib/categoryStyles"
import { ThemeContext } from '@/context/Theme'
import { LanguageContext } from '@/context/Lan'
import { TranslateText } from "@/lib/translatetext"

type Props = {
    CategoriesOptions: string[],
    SetCategoriesOptions: React.Dispatch<React.SetStateAction<string[]>>
}

const DataTypes: React.FC<Props> = ({ CategoriesOptions, SetCategoriesOptions }) => {
    const { theme } = useContext(ThemeContext)
    const { language } = useContext(LanguageContext)
    const [DataTypesCategories, setDataTypesCategories] = useState<string[]>(TranslateText[language].CATEGORIES_OPTIONS)
    const isDark = theme === 'dark'

    const removeCategory = (category: string) => {
        if (!CategoriesOptions.includes(category)) {
            SetCategoriesOptions(prev => [category, ...prev])
        } else {
            SetCategoriesOptions(prev => prev.filter(c => c !== category))
        }
    }

    useEffect(() => {
        setDataTypesCategories(TranslateText[language].CATEGORIES_OPTIONS)
    }, [language])

    return (
        <div className={`p-3 px-4 rounded-lg flex flex-col gap-2 font-satoshi shadow-sm
            ${isDark ? 'bg-[#050505]' : 'bg-white'}
        `}>
            <span className={`uppercase text-[0.7rem] tracking-wider font-medium
                ${isDark ? 'text-slate-400' : 'text-slate-500'}
            `}>
                {TranslateText[language].TYPES}
            </span>

            <div className='flex flex-col gap-0.5'>
                {DataTypesCategories.map((category) => {
                    const styles = getCategoryStyle(language, category)
                    const isSelected = CategoriesOptions.includes(category)

                    return (
                        <div
                            key={category}
                            onClick={() => removeCategory(category)}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-all duration-150 active:scale-[0.98]
                                ${isDark ? 'hover:bg-white/5' : 'hover:bg-[#050505]/5'}
                            `}
                        >
                            <span
                                className='w-2 h-2 rounded-full shrink-0 transition-all duration-150'
                                style={{
                                    background: isSelected ? styles.dot : isDark ? '#334155' : '#cbd5e1',
                                }}
                            />
                            <span className={`text-[0.75rem] transition-colors duration-150
                                ${isSelected
                                    ? isDark ? 'text-white' : 'text-slate-700'
                                    : 'text-slate-400'
                                }
                            `}>
                                {category}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default DataTypes