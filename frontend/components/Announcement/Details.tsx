import { formatDateInLanguage } from '@/lib/formatDate'
import { LANGUAGE_CODES } from '@/lib/lan'
import { Calendar, Landmark, LayoutGrid, Link, MapPin } from 'lucide-react'
import { TranslateText } from "@/lib/translatetext"
import React from 'react'

type Props = {
    lan: string,
    state: string,
    date: string,
    category: string,
    department: string,
    source: string
}

const Details: React.FC<Props> = ({ lan, date, source, state, department, category }) => {
    return (
        <div className='flex-1 text-multiselect mx-auto sm:mx-0  border border-[#a8c0e0]/40  p-5 ml-0 sm:ml-3 flex flex-col gap-2 bg-white w-fit'>
            <div className='flex items-center gap-2 font-satoshi'>
                <Calendar className='w-4 h-4' />
                {formatDateInLanguage(date, LANGUAGE_CODES[lan])}
            </div>
            <div className='flex items-center gap-2 font-satoshi'>
                <MapPin className='w-4 h-4' />
                {state}
            </div>
            <div className='text-nowrap  flex items-center gap-2 font-satoshi'>
                <Landmark className='w-4 h-4' />
                {department}
            </div>
            <div className='flex items-center gap-2 font-satoshi'>
                <LayoutGrid className='w-4 h-4' />
                {category}
            </div>
            <a className='font-satoshi  flex items-center gap-2 underline' href={source} >
                <Link className='w-4 h-4' /> {TranslateText[lan].VIEW_OFFICIAL_SOURCE}
            </a>
        </div>
    )
}

export default Details