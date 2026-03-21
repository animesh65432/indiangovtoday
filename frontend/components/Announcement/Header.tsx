import React, { useContext } from "react";
import { SectionTypes } from "@/types";
import { useRouter } from "next/navigation";
import { Share2, Play, Pause, Square, AudioLines, Volume2, ArrowLeft } from "lucide-react";
import ShareSection from "../Share";
import { LanguageContext } from "@/context/Lan"
import { usetexttospech } from "@/hooks/usetexttospech";
import { TranslateText } from "@/lib/translatetext";

type Props = {
    title: string
    sections: SectionTypes[]
    toggle: boolean
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Header({ sections, title, toggle, setToggle }: Props) {
    const router = useRouter();
    const { language } = useContext(LanguageContext);
    const { call, stop, togglePlayPause, IsLoading, isPlaying, isPaused } = usetexttospech()

    const handleAudioAction = async () => {
        if (IsLoading) return
        if (isPlaying || isPaused) {
            togglePlayPause()
        } else {
            await call(
                sections[0].heading + ". " + ('content' in sections[0] ? sections[0].content : '') + " " +
                sections[1].heading + ". " + ('content' in sections[1] ? sections[1].content : '') + " " +
                sections[2].heading + ". " + (sections[2].type === "keypoints" && 'points' in sections[2] ? sections[2].points.join('. ') : '')
            )
        }
    }

    const getAudioIcon = () => {
        if (IsLoading) return <AudioLines className="animate-spin text-[#FF9933] w-4 h-4" />
        if (isPlaying) return <Pause className="text-[#FF9933] w-4 h-4" />
        if (isPaused) return <Play className="text-[#FF9933] w-4 h-4" />
        return <Volume2 className="text-[#FF9933] w-4 h-4" />
    }

    return (
        <header className="flex items-center justify-between">
            {/* Back button */}
            <button
                onClick={() => router.push("/#announcements")}
                className="flex items-center gap-2 font-satoshi text-[11px] md:text-[12px] font-semibold text-white/70 border border-[#FF9933]/25 bg-transparent px-4 py-2 rounded hover:text-[#FF9933] hover:border-[#FF9933]/60 hover:bg-[#FF9933]/5 transition-all duration-150"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                {TranslateText[language].BACK}
            </button>

            {/* Right controls */}
            <nav className="flex items-center gap-4">
                {/* Share */}
                <button
                    onClick={() => setToggle(prev => !prev)}
                    aria-label="Share announcement"
                    className="flex items-center justify-center w-9 h-9 rounded border border-[#FF9933]/25 bg-transparent text-[#FF9933]/60 hover:text-[#FF9933] hover:border-[#FF9933]/60 hover:bg-[#FF9933]/5 transition-all duration-150"
                >
                    <Share2 className="w-4 h-4" />
                </button>
                {toggle && <ShareSection Announcement={title} setisShareOPen={setToggle} />}

                {/* Audio controls */}
                <div className="flex items-center gap-2">
                    {(isPlaying || isPaused) && (
                        <button
                            onClick={stop}
                            aria-label="Stop audio"
                            className="flex items-center justify-center w-9 h-9 rounded border border-red-500/30 bg-transparent text-red-500/70 hover:text-red-500 hover:border-red-500/60 hover:bg-red-500/5 transition-all duration-150"
                        >
                            <Square className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={IsLoading ? undefined : handleAudioAction}
                        disabled={IsLoading}
                        aria-label={isPlaying ? "Pause audio" : "Play audio"}
                        className={`flex items-center justify-center w-9 h-9 rounded border border-[#FF9933]/25 bg-transparent transition-all duration-150
                            ${IsLoading
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:text-[#FF9933] hover:border-[#FF9933]/60 hover:bg-[#FF9933]/5'
                            }`}
                    >
                        {getAudioIcon()}
                    </button>
                </div>
            </nav>
        </header>
    )
}