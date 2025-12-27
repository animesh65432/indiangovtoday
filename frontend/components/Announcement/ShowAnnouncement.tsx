import React, { useState } from 'react'
import { AudioLines, Pause, Play, Share, Square, Volume2, MapPin, Calendar, LayoutGrid, Landmark, Link } from "lucide-react"
import ShareSection from '../Share'
import { usetexttospech } from '@/hooks/usetexttospech'
import { TranslateText } from "@/lib/translatetext"
import { SectionTypes } from '@/types'
import { formatDateInLanguage } from '@/lib/formatDate'
import { LANGUAGE_CODES } from "@/lib/lan"


type Props = {
    title: string
    source: string
    lan: string,
    announcementId: string,
    state: string,
    date: string,
    category: string,
    department: string,
    sections: SectionTypes[]
}

const ShowAnnouncement: React.FC<Props> = ({ title, source, lan, date, state, sections, department, category }) => {
    const [toggle, setToggle] = useState<boolean>(false)
    const { call, stop, togglePlayPause, IsLoading, isPlaying, isPaused } = usetexttospech()


    const handleAudioAction = async () => {
        if (IsLoading) return
        if (isPlaying || isPaused) {
            togglePlayPause()
        } else {
            await call(sections[0].heading + ". " + ('content' in sections[0] ? sections[0].content : '') + " " +
                sections[1].heading + ". " + ('content' in sections[1] ? sections[1].content : '') + " " +
                sections[2].heading + ". " + (sections[2].type === "keypoints" && 'points' in sections[2] ? sections[2].points.join('. ') : '')
            )
        }
    }

    const handleStopAudio = () => {
        stop()
    }


    const getAudioIcon = () => {
        if (IsLoading) return <AudioLines className="animate-spin text-[#757575] w-5 h-5" />
        if (isPlaying) return <Pause className="text-[#757575] w-5 h-5" />
        if (isPaused) return <Play className="text-[#757575] w-5 h-5" />
        return <Volume2 className="text-[#757575] w-5 h-5" />
    }

    return (
        <div className='w-[82%] mx-auto  flex flex-col gap-6 pt-7  pb-8'>
            <div className='flex justify-end text-[1rem] sm:text-[1.3rem] lg:text-[1.6rem] text-[#1a1919]'>
                <div>
                    <Share
                        onClick={() => setToggle(prev => !prev)}
                        role="button"
                        aria-label="Share announcement"
                        className='text-[#E0614B]'
                    />
                    {toggle && <ShareSection Announcement={title} setisShareOPen={setToggle} />}
                </div>
            </div>

            <div
                className="whitespace-pre-line text-[#2B2B2B] custom-scroll overflow-x-auto leading-8 md:leading-9 text-[1rem] md:text-[1.2rem] lg:text-[1.4rem]"
            >
                {title}
            </div>

            <div className='flex flex-col gap-2'>
                <div className='text-[#2B2B2B] flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    {formatDateInLanguage(date, LANGUAGE_CODES[lan])}
                </div>
                <div className='text-[#2B2B2B] flex items-center gap-2'>
                    <MapPin className='w-4 h-4' />
                    {state}
                </div>
                <div className='text-[#2B2B2B] flex items-center gap-2'>
                    <Landmark className='w-4 h-4' />
                    {department}
                </div>
                <div className='text-[#2B2B2B] flex items-center gap-2'>
                    <LayoutGrid className='w-4 h-4' />
                    {category}
                </div>
                <a className='text-[#2B2B2B] hover:text-[#181717] flex items-center gap-2 underline' href={source} >
                    <Link className='w-4 h-4' /> {TranslateText[lan].SOURCE}
                </a>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className='text-[#2B2B2B] text-[1.2rem]'>{sections[0].heading}</div>
                    <div className='text-gray-700'>{'content' in sections[0] ? sections[0].content : 'Content not available'}</div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='text-[#2B2B2B] text-[1.2rem]'>{sections[1].heading}</div>
                    <div className='text-gray-700'>{'content' in sections[1] ? sections[1].content : 'Content not available'}</div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='text-[#2B2B2B] text-[1.2rem]'>{sections[2].heading}</div>
                    <div className='text-gray-700'>{sections[2].type === "keypoints" && 'points' in sections[2] ? (
                        <div className='flex flex-col gap-2'>
                            {sections[2].points.map((point, index) => (
                                <div key={index} className='flex items-start gap-2'>
                                    <span className='font-bold'>•</span>
                                    <span>{point}</span>
                                </div>
                            ))}
                        </div>
                    ) : null}</div>
                </div>
            </div>
            <div className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-20">
                <div className="flex items-center gap-3">
                    {(isPlaying || isPaused) && (
                        <button
                            className="group relative bg-white/90 backdrop-blur-sm p-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                            onClick={handleStopAudio}
                            aria-label="Stop audio"
                        >
                            <Square className="text-red-500 w-5 h-5" />
                            <div className="absolute inset-0 rounded-full bg-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    )}
                    <button
                        className={`group relative bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 ${IsLoading
                            ? 'cursor-not-allowed opacity-60'
                            : 'hover:scale-110 active:scale-95'
                            }`}
                        onClick={IsLoading ? undefined : handleAudioAction}
                        disabled={IsLoading}
                        aria-label={isPlaying ? "Pause audio" : "Play audio"}
                    >
                        {getAudioIcon()}
                        <div className="absolute inset-0 rounded-full bg-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {IsLoading && (
                            <div className="absolute inset-0 rounded-full border-2 border-gray-300/50 border-t-gray-600 animate-spin" />
                        )}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ShowAnnouncement