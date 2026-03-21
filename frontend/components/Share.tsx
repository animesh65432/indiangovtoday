import type React from "react"
import { MessageCircle, Twitter, Mail, X, Share2 } from "lucide-react"
import { useRef } from "react"
import { useClickOutside } from "@/hooks/useClickoutside"
import { useContext } from "react"
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"

interface ShareOption {
    name: string
    icon: React.ReactNode
    url: string
    color: string
}

type Props = {
    Announcement: string,
    setisShareOPen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ShareSection({ Announcement, setisShareOPen }: Props) {
    const modalRef = useRef<HTMLDivElement>(null);
    const { language } = useContext(LanguageContext);
    const shareUrl = window.location.href
    const shareMessage = `📢 ${TranslateText[language].CHECK_OUT_THIS_AMAZING}: ${Announcement} 🚀`
    const encodedMessage = encodeURIComponent(shareMessage)
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedMessageWithUrl = encodeURIComponent(`${shareMessage} ${shareUrl}`)

    const shareOptions: ShareOption[] = [
        {
            name: "WhatsApp",
            icon: <MessageCircle className="w-4 h-4" />,
            url: `https://wa.me/?text=${encodedMessageWithUrl}`,
            color: "#25D366",
        },
        {
            name: "X (Twitter)",
            icon: <Twitter className="w-4 h-4" />,
            url: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
            color: "#ffffff",
        },
        {
            name: "Email",
            icon: <Mail className="w-4 h-4" />,
            url: `mailto:?subject=${encodeURIComponent("Check this announcement!")}&body=${encodedMessageWithUrl}`,
            color: "#FF9933",
        },
    ]

    useClickOutside(modalRef, () => setisShareOPen(false))

    return (
        <div className="fixed font-satoshi inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="relative w-full max-w-md mx-4 overflow-hidden rounded-xl
                           bg-[#111111] border border-white/[0.08]
                           shadow-[0_24px_60px_rgba(0,0,0,0.8)]
                           animate-in slide-in-from-bottom-4 duration-300"
            >
                {/* Top accent line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF9933] to-transparent" />

                {/* Close */}
                <button
                    onClick={() => setisShareOPen(false)}
                    className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="p-8 flex flex-col gap-6">

                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Share2 size={13} className="text-[#FF9933]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF9933]">
                                {TranslateText[language].SHARE_ANNOUNCEMENT}
                            </span>
                        </div>
                        <p className="text-white/40 text-[12px] leading-relaxed">
                            {TranslateText[language].HELP_OTHERS_DISCOVER}
                        </p>
                    </div>

                    {/* Preview box */}
                    <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-4 flex flex-col gap-2">
                        <p className="text-white/70 text-[12px] leading-relaxed line-clamp-2">
                            {shareMessage}
                        </p>
                        <p className="text-[#FF9933]/60 text-[11px] font-mono truncate">
                            {shareUrl}
                        </p>
                    </div>

                    {/* Share buttons */}
                    <div className="flex flex-col gap-2">
                        {shareOptions.map((option) => (
                            <button
                                key={option.name}
                                onClick={() => window.open(option.url, "_blank", "noopener,noreferrer")}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg
                                           bg-white/[0.04] border border-white/[0.07]
                                           hover:bg-white/[0.08] hover:border-white/[0.14]
                                           transition-all duration-200 hover:scale-[1.01]
                                           active:scale-[0.99]"
                            >
                                <span style={{ color: option.color }}>
                                    {option.icon}
                                </span>
                                <span className="text-white/70 text-[13px] font-medium flex-1 text-left">
                                    {TranslateText[language].SHARE_ON} {option.name}
                                </span>
                                <span className="text-white/20 text-[11px]">↗</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}