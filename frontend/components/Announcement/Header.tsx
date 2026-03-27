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
        if (IsLoading) return <AudioLines className="animate-spin w-4 h-4 text-[#ff3333]" />
        if (isPlaying) return <Pause className="w-4 h-4 text-[#ff3333]" />
        if (isPaused) return <Play className="w-4 h-4 text-[#ff3333]" />
        return <Volume2 className="w-4 h-4 text-[#ff3333]" />
    }

    const iconBtn = "flex items-center justify-center w-9 h-9 rounded border border-[#ff3333]/25 bg-transparent text-[#ff3333]/60 hover:text-[#ff3333] hover:border-[#ff3333]/60 hover:bg-[#ff3333]/5 transition-all duration-150"

    return (
        <header className="flex items-center justify-between font-satoshi">

            {/* Back button */}
            <button
                onClick={() => router.push("/#announcements")}
                className="flex items-center gap-2 text-[11px] md:text-[12px] font-semibold text-[#321F1F] border border-[#ff3333]/25 bg-transparent px-4 py-2 rounded hover:text-[#ff3333] hover:border-[#ff3333]/60 hover:bg-[#ff3333]/5 transition-all duration-150"
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
                    className={iconBtn}
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
                            className="flex items-center justify-center w-9 h-9 rounded border border-red-600/30 bg-transparent text-red-600/70 hover:text-red-600 hover:border-red-600/60 hover:bg-red-600/5 transition-all duration-150"
                        >
                            <Square className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={IsLoading ? undefined : handleAudioAction}
                        disabled={IsLoading}
                        aria-label={isPlaying ? "Pause audio" : "Play audio"}
                        className={`${iconBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {getAudioIcon()}
                    </button>
                </div>

            </nav>
        </header>
    )
}