import React from 'react'
import Logo from '../ui/Logo'
import { useContext } from 'react'
import { LanguageContext } from '@/context/Lan'
import { TranslateText } from '@/lib/translatetext'
import CategoryOptions from './CategoryOptions'

type Props = {
    categoryOptions: string[]
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>
    CategorySelected: string
    SetCategorySelected: React.Dispatch<React.SetStateAction<string>>
}

const Header: React.FC<Props> = ({
    categoryOptions,
    setCategoryOptions,
    CategorySelected,
    SetCategorySelected
}) => {
    const { language } = useContext(LanguageContext)
    return (
        <div className='bg-white rounded-lg flex flex-col'>
            <div className='p-1 px-2'>
                <Logo
                    fst={TranslateText[language].INDIAN}
                    snd={TranslateText[language].GOVTODAY}
                />
            </div>
            <CategoryOptions
                categoryOptions={categoryOptions}
                setCategoryOptions={setCategoryOptions}
                CategorySelected={CategorySelected}
                SetCategorySelected={SetCategorySelected}
            />
        </div>
    )
}

export default Header