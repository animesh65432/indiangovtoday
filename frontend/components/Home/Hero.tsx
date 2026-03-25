import React from 'react'
import AnnoucementsHeader from '../AnnoucementsHeader'
import CategoryOptions from './CategoryOptions'
import Herotitle from './Herotitle'
import InputBox from './InputBox'
import HeroAnnoucments from './HeroAnnoucments'

type Props = {
    categoryOptions: string[]
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>
}

const Hero: React.FC<Props> = ({ categoryOptions, setCategoryOptions }) => {
    return (
        <div className='h-dvh flex flex-col gap-3 md:gap-6  w-full bg-[url(/bg.png)] bg-cover bg-center'>
            <AnnoucementsHeader />
            <CategoryOptions
                categoryOptions={categoryOptions}
                setCategoryOptions={setCategoryOptions}
            />
            <Herotitle />
            <InputBox />
            <HeroAnnoucments />
        </div>
    )
}

export default Hero