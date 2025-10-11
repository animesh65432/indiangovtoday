import React, { useState } from 'react'
import { AudioLines, Pause, Play, Share, Square, Volume2 } from "lucide-react"
import ShareSection from '../Share'
import { usetexttospech } from '@/hooks/usetexttospech'
import { toast } from 'react-toastify'
import { TranslateText } from "@/lib/translatetext"

type Props = {
    title: string
    content: string
    source: string
    lan: string
}

const ShowAnnouncement: React.FC<Props> = ({ title, content, source, lan }) => {
    const [toggle, setToggle] = useState<boolean>(false)
    const { call, stop, togglePlayPause, IsLoading, isPlaying, isPaused } = usetexttospech()


    const handleAudioAction = async () => {
        if (content.length > 2500) {
            toast.error("Text is too long")
            return
        }

        if (IsLoading) return

        const cleanedContent = content.replace(/[.,/*]/g, "");

        if (isPlaying || isPaused) {
            togglePlayPause()
        } else {
            await call(cleanedContent)
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
        <div className='w-[82%] mx-auto  flex flex-col gap-6 pt-7 '>
            <div className='flex items-center justify-between text-[1rem] sm:text-[1.3rem] lg:text-[1.6rem] text-[#1a1919]'>
                <h1 className='text-[#E0614B]'>{title}</h1>
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
                className="whitespace-pre-line text-[#2B2B2B] h-[60vh] custom-scroll overflow-x-auto leading-8 md:leading-9 text-[0.9rem] md:text-[1rem] lg:text-[1.1rem]"
            >
                {content.replace(/\\n/g, '\n')}
            </div>


            <div className='text-[#353535]   text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]'>
                <p className="text-gray-500 italic">
                    {TranslateText[lan].SOURCE}:{" "}
                    <a
                        href={`${source}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E0614B] hover:underline"
                    >
                        {`${source}`}
                    </a>
                </p>
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
