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

        if (isPlaying || isPaused) {
            togglePlayPause()
        } else {
            await call(content)
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
        <div className='w-[85%] mx-auto flex flex-col gap-6 pt-7'>

            <div className='flex items-center justify-between text-[1rem] sm:text-[1.1rem] lg:text-[1.4rem] text-[#1a1919]'>
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


            <div className='text-[#353535] leading-relaxed text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]'>
                {content}
            </div>


            <div className='text-[#353535] text-[0.85rem] md:text-[1rem] lg:text-[1.1rem]'>
                <p className="text-gray-500 italic">
                    Source:{" "}
                    <a
                        href={`https://www.pib.gov.in${source}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {`https://www.pib.gov.in${source}`}
                    </a>
                </p>
            </div>


            <div className="flex gap-2 ml-auto">
                {(isPlaying || isPaused) && (
                    <div
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                        onClick={handleStopAudio}
                        role="button"
                        aria-label="Stop audio"
                    >
                        <Square className="text-red-500 w-4 h-4" />
                    </div>
                )}

                <div
                    className={`bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${IsLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                    onClick={IsLoading ? undefined : handleAudioAction}
                    role="button"
                    aria-label={isPlaying ? "Pause audio" : "Play audio"}
                >
                    {getAudioIcon()}
                </div>
            </div>
        </div>
    )
}

export default ShowAnnouncement
