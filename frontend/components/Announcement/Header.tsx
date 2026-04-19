import React, { useContext } from "react";
import { SectionTypes } from "@/types";
import { useRouter } from "next/navigation";
import { Share2, Play, Pause, Square, AudioLines, Volume2, ArrowLeft } from "lucide-react";
import ShareSection from "../Share";
import { LanguageContext } from "@/context/Lan"
import { usetexttospech } from "@/hooks/usetexttospech";
import { TranslateText } from "@/lib/translatetext";
import { ThemeContext } from "@/context/Theme";

type Props = {
    title: string
    sections: SectionTypes[]
    toggle: boolean
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Header({ sections, title, toggle, setToggle }: Props) {
    const router = useRouter();
    const { theme } = useContext(ThemeContext)
    const isDark = theme === "dark"
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
        if (IsLoading) return <AudioLines className="animate-spin w-4 h-4 text-[#c51057]" />
        if (isPlaying) return <Pause className="w-4 h-4 text-[#c51057]" />
        if (isPaused) return <Play className="w-4 h-4 text-[#c51057]" />
        return <Volume2 className="w-4 h-4 text-[#c51057]" />
    }

    const iconBtn = `flex items-center justify-center w-9 h-9 rounded border transition-all duration-150
        ${isDark
            ? "border-white/10 bg-transparent text-white/50 hover:text-[#c51057] hover:border-[#c51057]/40 hover:bg-[#c51057]/10"
            : "border-[#c51057]/25 bg-transparent text-[#c51057]/60 hover:text-[#c51057] hover:border-[#c51057]/60 hover:bg-[#c51057]/5"
        }`

    const backBtn = `flex items-center gap-2 text-[11px] md:text-[12px] font-semibold border px-4 py-2 rounded transition-all duration-150
        ${isDark
            ? "border-white/10 text-white/60 hover:text-[#c51057] hover:border-[#c51057]/40 hover:bg-[#c51057]/10"
            : "border-[#c51057]/25 text-[#321F1F] hover:text-[#c51057] hover:border-[#c51057]/60 hover:bg-[#c51057]/5"
        }`

    const stopBtn = `flex items-center justify-center w-9 h-9 rounded border transition-all duration-150
        ${isDark
            ? "border-red-600/20 bg-transparent text-red-400/70 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10"
            : "border-red-600/30 bg-transparent text-red-600/70 hover:text-red-600 hover:border-red-600/60 hover:bg-red-600/5"
        }`

    return (
        <header className="flex items-center justify-between font-satoshi">

            <button onClick={() => router.push("/#announcements")} className={backBtn}>
                <ArrowLeft className="w-3.5 h-3.5" />
                {TranslateText[language].BACK}
            </button>

            <nav className="flex items-center gap-4">

                <button
                    onClick={() => setToggle(prev => !prev)}
                    aria-label="Share announcement"
                    className={iconBtn}
                >
                    <Share2 className="w-4 h-4" />
                </button>
                {toggle && <ShareSection Announcement={title} setisShareOPen={setToggle} />}

                <div className="flex items-center gap-2">
                    {(isPlaying || isPaused) && (
                        <button onClick={stop} aria-label="Stop audio" className={stopBtn}>
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