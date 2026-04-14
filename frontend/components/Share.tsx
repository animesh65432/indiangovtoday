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
            color: "#321F1F",
        },
        {
            name: "Email",
            icon: <Mail className="w-4 h-4" />,
            url: `mailto:?subject=${encodeURIComponent("Check this announcement!")}&body=${encodedMessageWithUrl}`,
            color: "#ff3333",
        },
    ]

    useClickOutside(modalRef, () => setisShareOPen(false))

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/40 backdrop-blur-sm"
            style={{ fontFamily: "var(--font-satoshi)" }}>
            <div
                ref={modalRef}
                className="relative w-full max-w-md mx-4 overflow-hidden rounded-2xl bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
            >
                {/* Top red accent bar */}
                <div className="h-1 w-full" style={{ backgroundColor: "#ff3333" }} />

                {/* Close */}
                <button
                    onClick={() => setisShareOPen(false)}
                    className="absolute top-4 right-4 transition-opacity opacity-40 hover:opacity-80"
                    style={{ color: "#321F1F" }}
                >
                    <X size={18} />
                </button>

                <div className="p-8 flex flex-col gap-6">

                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Share2 size={13} style={{ color: "#ff3333" }} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em]"
                                style={{ color: "#ff3333" }}>
                                {TranslateText[language].SHARE_ANNOUNCEMENT}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold leading-snug"
                            style={{ color: "#ff3333", fontFamily: "var(--font-literata)" }}>
                            {TranslateText[language].SHARE_ANNOUNCEMENT}
                        </h3>
                        <p className="text-[13px] leading-relaxed mt-1"
                            style={{ color: "#321F1F", opacity: 0.6 }}>
                            {TranslateText[language].HELP_OTHERS_DISCOVER}
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full" style={{ backgroundColor: "#321F1F", opacity: 0.08 }} />

                    {/* Preview box */}
                    <div className="rounded-lg p-4 flex flex-col gap-2"
                        style={{ backgroundColor: "#fafafa", border: "1.5px solid rgba(50,31,31,0.1)" }}>
                        <p className="text-[12px] leading-relaxed line-clamp-2"
                            style={{ color: "#321F1F", opacity: 0.7 }}>
                            {shareMessage}
                        </p>
                        <p className="text-[11px] font-mono truncate"
                            style={{ color: "#ff3333", opacity: 0.7 }}>
                            {shareUrl}
                        </p>
                    </div>

                    {/* Share buttons */}
                    <div className="flex flex-col gap-2">
                        {shareOptions.map((option) => (
                            <button
                                key={option.name}
                                onClick={() => window.open(option.url, "_blank", "noopener,noreferrer")}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                                style={{
                                    backgroundColor: "#fafafa",
                                    border: "1.5px solid rgba(50,31,31,0.1)",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(50,31,31,0.25)")}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(50,31,31,0.1)")}
                            >
                                <span style={{ color: option.color }}>
                                    {option.icon}
                                </span>
                                <span className="text-[13px] font-medium flex-1 text-left"
                                    style={{ color: "#321F1F" }}>
                                    {TranslateText[language].SHARE_ON} {option.name}
                                </span>
                                <span className="text-[11px]"
                                    style={{ color: "#321F1F", opacity: 0.3 }}>↗</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}