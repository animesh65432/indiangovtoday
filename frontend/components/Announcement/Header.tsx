import React, { useState } from "react";
import Image from "next/image";
import { SectionTypes } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Share2, Play, Pause, Square, AudioLines, Volume2 } from "lucide-react";
import ShareSection from "../Share";
import { usetexttospech } from "@/hooks/usetexttospech";

type Props = {
    title: string
    sections: SectionTypes[]
}

export default function Header({ sections, title }: Props) {
    const router = useRouter();
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
        if (IsLoading) return <AudioLines className="animate-spin text-black w-5 h-5" />
        if (isPlaying) return <Pause className="text-black w-5 h-5" />
        if (isPaused) return <Play className="text-black w-5 h-5" />
        return <Volume2 className="text-black w-5 h-5" />
    }

    return (
        <header className='flex items-center justify-between'>
            <Button
                onClick={() => router.push("/#announcements")}
                className='text-[#2C3143] border border-[#000000] rounded-none font-poppins'
            >
                <Image src="/Left.svg" alt='arrow' width={14} height={14} />
                Back
            </Button>
            <nav className='flex items-center gap-6 '>
                <ul>
                    <Share2
                        onClick={() => setToggle(prev => !prev)}
                        role="button"
                        aria-label="Share announcement"
                        className='text-black'
                        id='sharebutton'
                    />
                    {toggle && <ShareSection Announcement={title} setisShareOPen={setToggle} />}
                </ul>

                <ul className="flex items-center gap-3">
                    {(isPlaying || isPaused) && (
                        <button
                            className="group relative bg-white/90 backdrop-blur-sm p-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                            onClick={handleStopAudio}
                            aria-label="Stop audio"
                            style={{ border: 0 }}
                        >
                            <Square className="text-red-500  h-10 w-10" />
                            <li className="absolute inset-0 rounded-full bg-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                        style={{ border: 0 }}
                    >
                        {getAudioIcon()}
                        <li className="absolute inset-0 rounded-full bg-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {IsLoading && (
                            <li className="absolute inset-0 rounded-full border-2 border-gray-300/50 border-t-gray-600 animate-spin" />
                        )}
                    </button>
                </ul>
            </nav>
        </header>
    );
}