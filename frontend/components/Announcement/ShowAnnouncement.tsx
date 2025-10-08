import React, { useState } from 'react'
import { AudioLines, Pause, Play, Share, Square, Volume2 } from "lucide-react"
import ShareSection from '../Share'
import { usetexttospech } from '@/hooks/usetexttospech'
import { toast } from 'react-toastify'

type Props = {
    title: string
    content: string
    source: string
}

const ShowAnnouncement: React.FC<Props> = ({ title, content, source }) => {
    const [toggle, setToggle] = useState<boolean>(false)
    const { call, stop, togglePlayPause, IsLoading, isPlaying, isPaused } = usetexttospech()


    const handleAudioAction = async () => {
        if (!content) {
            toast.error("No content to read")
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
        <div className='h-[75vh] w-[100%] overflow-y-auto   flex flex-col gap-6 pt-7 '>

            <div className='flex w-[85%] mx-auto items-center justify-between text-[1rem] sm:text-[1.1rem] lg:text-[1.4rem] text-[#1a1919]'>
                <div>{title}</div>
                <div>
                    <Share
                        onClick={() => setToggle(prev => !prev)}
                        role="button"
                        aria-label="Share announcement"
                    />
                    {toggle && <ShareSection Announcement={title} setisShareOPen={setToggle} />}
                </div>
            </div>


            <div className='text-[#353535] w-[85%] mx-auto leading-relaxed text-[0.85rem] md:text-[1rem] lg:text-[1.1rem] whitespace-pre-line'>
                {content}
            </div>

            <div className='text-[#353535] w-[85%] mx-auto text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]'>
                <p className="text-gray-500 italic">
                    Source:{" "}
                    <a
                        href={`${source}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {`${source}`}
                    </a>
                </p>
            </div>

            <div className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-50">
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
