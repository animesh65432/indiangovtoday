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
    className: string
    bgColor: string
    hoverColor: string
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
            icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
            url: `https://wa.me/?text=${encodedMessageWithUrl}`,
            className: "text-[#E0614B]",
            bgColor: "bg-[#ffff]",
            hoverColor: "hover:bg-[#ffff]"
        },
        {
            name: "X (Twitter)",
            icon: <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />,
            url: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
            className: "text-[#E0614B]",
            bgColor: "bg-[#ffff]",
            hoverColor: "hover:bg-[#ffff]"
        },
        {
            name: "Email",
            icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
            url: `mailto:?subject=${encodeURIComponent("Check this amazing recipe!")}&body=${encodedMessageWithUrl}`,
            className: "text-[#E0614B]",
            bgColor: "bg-[#ffff]",
            hoverColor: "hover:bg-[#ffff]"
        },
    ]

    useClickOutside(modalRef, () => {
        setisShareOPen(false)
    })

    const handleShare = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer")
    }

    const handleClose = () => {
        setisShareOPen(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in slide-in-from-bottom-4 duration-300"
            >
                {/* Header */}
                <div className="relative p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100">
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Close modal"
                        style={{ border: 0 }}
                    >
                        <X
                            className="text-black w-5 h-5 sm:w-6 sm:h-6"
                            id="closeShareModal"
                        />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <div >
                            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-black">{TranslateText[language].SHARE_ANNOUNCEMENT}</h3>
                    </div>
                    <p className="text-gray-800 text-sm sm:text-base">{TranslateText[language].HELP_OTHERS_DISCOVER}</p>
                </div>

                {/* Share Preview */}
                <div className="p-4 sm:p-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-100">
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-sm sm:text-base font-medium text-gray-900 mb-2 leading-relaxed">
                            {shareMessage}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-800 underline truncate font-mono  px-2 py-1 rounded">
                            {shareUrl}
                        </p>
                    </div>
                </div>

                {/* Share Options */}
                <div className="p-4 sm:p-6 pt-3 sm:pt-4 ">
                    <div className="grid gap-2 sm:gap-3">
                        {shareOptions.map((option) => (
                            <button
                                key={option.name}
                                onClick={() => handleShare(option.url)}
                                className={`flex items-center gap-3 border  border-slate-200 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${option.bgColor} ${option.hoverColor} ${option.className} shadow-md hover:shadow-lg`}
                                aria-label={`Share on ${option.name}`}
                            >
                                <div className="flex-shrink-0">
                                    {option.icon}
                                </div>
                                <div className="flex-1 text-left">
                                    <span className="font-medium sm:font-semibold text-sm sm:text-base">
                                        {TranslateText[language].SHARE_ON} {option.name}
                                    </span>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-2 h-2 bg-white bg-opacity-30 rounded-full"></div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="rounded-lg p-3 text-center">
                        <p className="text-xs  text-black leading-relaxed">
                            💡 {TranslateText[language].CLICK_OPTION_TO_SHARE}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}