import { UseLanguageContext } from "@/context/Lan"
import { Call } from "@/service/call"
import { useState, useRef } from "react"
import { useTranslation } from "react-i18next"

export const usetexttospech = () => {
    const { i18n } = useTranslation()
    const context = UseLanguageContext()
    const [IsLoading, setloading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    async function call(text: string) {
        setloading(true)
        try {
            if (!context) {
                return
            }
            const { language } = context
            const response = await Call({
                method: "POST",
                path: "/texttospeech",
                request: {
                    text,
                    target_language: language
                }
            }) as { audioContent: string }


            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }

            const audio = new Audio(`data:audio/mp3;base64,${response.audioContent}`)
            audioRef.current = audio

            audio.onplay = () => {
                setIsPlaying(true)
                setIsPaused(false)
            }

            audio.onpause = () => {
                setIsPlaying(false)
                setIsPaused(true)
            }

            audio.onended = () => {
                setIsPlaying(false)
                setIsPaused(false)
                audioRef.current = null
            }

            audio.onerror = () => {
                setIsPlaying(false)
                setIsPaused(false)
                audioRef.current = null
            }

            audio.play()
        }
        finally {
            setloading(false)
        }
    }

    function pause() {
        if (audioRef.current && isPlaying) {
            audioRef.current.pause()
        }
    }

    function resume() {
        if (audioRef.current && isPaused) {
            audioRef.current.play()
        }
    }

    function stop() {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            setIsPlaying(false)
            setIsPaused(false)
            audioRef.current = null
        }
    }

    function togglePlayPause() {
        if (isPlaying) {
            pause()
        } else if (isPaused) {
            resume()
        }
    }

    return {
        call,
        pause,
        resume,
        stop,
        togglePlayPause,
        IsLoading,
        isPlaying,
        isPaused
    }
}