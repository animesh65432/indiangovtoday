import { formatDateInLanguage } from '@/lib/formatDate'
import { Calendar, Landmark, LayoutGrid, MapPin, ExternalLink } from 'lucide-react'
import { TranslateText } from "@/lib/translatetext"
import { getCat } from '@/lib/categoryStyles'
import React, { useContext } from 'react'
import { ThemeContext } from '@/context/Theme'

type Props = {
    lan: string
    state: string
    date: string
    category: string
    department: string
    source: string
}

type RowProps = {
    icon: React.ReactNode
    children: React.ReactNode
    isDark: boolean
}

const Row: React.FC<RowProps> = ({ icon, children, isDark }) => {
    return (
        <div className={`flex items-start gap-3 font-satoshi text-[13px] leading-snug ${isDark ? "text-white/50" : "text-[#321F1F]/60"}`}>
            <span className="mt-[1px] text-[#c51057]/50 flex-shrink-0">{icon}</span>
            <span>{children}</span>
        </div>
    )
}

const Details: React.FC<Props> = ({ lan, date, source, state, department, category }) => {
    const cat = getCat(category)
    const { theme } = useContext(ThemeContext)
    const isDark = theme === "dark"

    return (
        <div className={`w-fit min-w-[300px] rounded-xl p-5 flex flex-col gap-3 border ${isDark ? "bg-[#0f0f0f] border-white/10" : "bg-white border-[#c51057]/15"}`}>

            <span
                className="font-satoshi inline-flex items-center gap-[5px] self-start rounded px-[8px] py-[3px] text-[10px] font-bold tracking-[0.06em] uppercase"
                style={{ color: cat.dot, background: `${cat.dot}15`, border: `1px solid ${cat.dot}30` }}
            >
                <span className="inline-block h-[5px] w-[5px] rounded-full flex-shrink-0" style={{ background: cat.dot }} />
                {category}
            </span>

            <div className={`h-px w-full ${isDark ? "bg-white/10" : "bg-[#321F1F]/10"}`} />

            <Row icon={<Calendar className="w-4 h-4" />} isDark={isDark}>{formatDateInLanguage(date, lan)}</Row>
            <Row icon={<MapPin className="w-4 h-4" />} isDark={isDark}>{state}</Row>
            <Row icon={<Landmark className="w-4 h-4" />} isDark={isDark}>{department}</Row>
            <Row icon={<LayoutGrid className="w-4 h-4" />} isDark={isDark}>{category}</Row>

            <div className={`h-px w-full ${isDark ? "bg-white/10" : "bg-[#321F1F]/10"}`} />

            <a href={source} target="_blank" rel="noopener noreferrer" className="font-satoshi flex items-center gap-2 text-[13px] text-[#c51057]/60 hover:text-[#c51057] transition-colors duration-150">
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                {TranslateText[lan].VIEW_OFFICIAL_SOURCE}
            </a>

        </div>
    )
}

export default Details