import { formatDateInLanguage } from '@/lib/formatDate'
import { Calendar, Landmark, LayoutGrid, Link, MapPin } from 'lucide-react'
import { TranslateText } from "@/lib/translatetext"
import { getCat } from '@/lib/categoryStyles'
import React from 'react'

type Props = {
    lan: string
    state: string
    date: string
    category: string
    department: string
    source: string
}

const Row = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="flex items-start gap-3 font-satoshi text-[13px] text-[#321F1F]/60 leading-snug">
        <span className="mt-[1px] text-[#ff3333]/50 flex-shrink-0">{icon}</span>
        <span>{children}</span>
    </div>
)

const Details: React.FC<Props> = ({ lan, date, source, state, department, category }) => {
    const cat = getCat(category)

    return (
        <div className="w-fit min-w-[300px] bg-white border border-[#ff3333]/15 rounded-xl p-5 flex flex-col gap-3">

            {/* Category badge */}
            <span
                className="font-satoshi inline-flex items-center gap-[5px] self-start rounded px-[8px] py-[3px] text-[10px] font-bold tracking-[0.06em] uppercase"
                style={{
                    color: cat.dot,
                    background: `${cat.dot}15`,
                    border: `1px solid ${cat.dot}30`,
                }}
            >
                <span className="inline-block h-[5px] w-[5px] rounded-full flex-shrink-0" style={{ background: cat.dot }} />
                {category}
            </span>

            <div className="h-px bg-[#321F1F]/8" />

            <Row icon={<Calendar className="w-4 h-4" />}>
                {formatDateInLanguage(date, lan)}
            </Row>
            <Row icon={<MapPin className="w-4 h-4" />}>
                {state}
            </Row>
            <Row icon={<Landmark className="w-4 h-4" />}>
                {department}
            </Row>
            <Row icon={<LayoutGrid className="w-4 h-4" />}>
                {category}
            </Row>

            <div className="h-px bg-[#321F1F]/8" />


            <a
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="font-satoshi flex items-center gap-2 text-[13px] text-[#ff3333]/60 hover:text-[#ff3333] transition-colors duration-150"
            >
                <Link className="w-4 h-4 flex-shrink-0" />
                {TranslateText[lan].VIEW_OFFICIAL_SOURCE}
            </a>
        </div >
    )
}

export default Details