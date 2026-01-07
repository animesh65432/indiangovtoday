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
        <div className='flex-1 border border-black p-5 flex flex-col gap-2 bg-white w-fit'>
            <div className='text-slate-800 flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                {formatDateInLanguage(date, LANGUAGE_CODES[lan])}
            </div>
            <div className='text-slate-800  flex items-center gap-2'>
                <MapPin className='w-4 h-4' />
                {state}
            </div>
            <div className='text-slate-800  flex items-center gap-2'>
                <Landmark className='w-4 h-4' />
                {department}
            </div>
            <div className='text-slate-800  flex items-center gap-2'>
                <LayoutGrid className='w-4 h-4' />
                {category}
            </div>
            <a className='text-slate-800  hover:text-[#181717] flex items-center gap-2 underline' href={source} >
                <Link className='w-4 h-4' /> {TranslateText[lan].SOURCE}
            </a>
        </div>
    )
}

export default Details