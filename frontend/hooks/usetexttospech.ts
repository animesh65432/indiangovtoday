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
    const chunksRef = useRef<string[]>([])
    const currentChunkIndexRef = useRef(0)

    // Function to split text into chunks
    const splitTextIntoChunks = (text: string, maxLength: number = 2500): string[] => {
        const chunks: string[] = []
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

        let currentChunk = ""

        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim()

            // If single sentence is longer than maxLength, split it by words
            if (trimmedSentence.length > maxLength) {
                if (currentChunk) {
                    chunks.push(currentChunk.trim())
                    currentChunk = ""
                }

                const words = trimmedSentence.split(' ')
                let wordChunk = ""

                for (const word of words) {
                    if ((wordChunk + ' ' + word).length > maxLength) {
                        if (wordChunk) chunks.push(wordChunk.trim())
                        wordChunk = word
                    } else {
                        wordChunk += (wordChunk ? ' ' : '') + word
                    }
                }

                if (wordChunk) chunks.push(wordChunk.trim())
                continue
            }

            // Check if adding this sentence exceeds the limit
            if ((currentChunk + ' ' + trimmedSentence).length > maxLength) {
                if (currentChunk) chunks.push(currentChunk.trim())
                currentChunk = trimmedSentence
            } else {
                currentChunk += (currentChunk ? ' ' : '') + trimmedSentence
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim())
        }

        return chunks
    }

    // Function to play a specific chunk
    const playChunk = async (chunkIndex: number) => {
        if (chunkIndex >= chunksRef.current.length) {
            // All chunks played
            setIsPlaying(false)
            setIsPaused(false)
            audioRef.current = null
            chunksRef.current = []
            currentChunkIndexRef.current = 0
            return
        }

        const chunk = chunksRef.current[chunkIndex]
        const cleanedChunk = chunk.replace(/[.,/*]/g, "")

        try {
            if (!context) return

            const { language } = context
            const response = await Call({
                method: "POST",
                path: "/texttospech",
                request: {
                    text: cleanedChunk,
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
                // Play next chunk automatically
                currentChunkIndexRef.current++
                playChunk(currentChunkIndexRef.current)
            }

            audio.onerror = () => {
                setIsPlaying(false)
                setIsPaused(false)
                audioRef.current = null
                chunksRef.current = []
                currentChunkIndexRef.current = 0
            }

            audio.play()
        } catch (error) {
            console.error("Error playing chunk:", error)
            setIsPlaying(false)
            setIsPaused(false)
            audioRef.current = null
            chunksRef.current = []
            currentChunkIndexRef.current = 0
        }
    }

    async function call(text: string) {
        setloading(true)
        try {
            // Split text into chunks
            const chunks = splitTextIntoChunks(text, 2500)
            chunksRef.current = chunks
            currentChunkIndexRef.current = 0

            // Start playing from the first chunk
            await playChunk(0)
        } finally {
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
        // Reset chunks
        chunksRef.current = []
        currentChunkIndexRef.current = 0
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