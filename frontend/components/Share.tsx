import type React from "react"
import { MessageCircle, Twitter, Mail, X, Share2 } from "lucide-react"
import { useRef } from "react"
import { useClickOutside } from "@/hooks/useClickoutside"

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
    const shareUrl = window.location.href
    const shareMessage = `📢 Check out this amazing Announcement: ${Announcement} 🚀`
    const encodedMessage = encodeURIComponent(shareMessage)
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedMessageWithUrl = encodeURIComponent(`${shareMessage} ${shareUrl}`)

    const shareOptions: ShareOption[] = [
        {
            name: "WhatsApp",
            icon: <MessageCircle size={24} />,
            url: `https://wa.me/?text=${encodedMessageWithUrl}`,
            className: "text-white",
            bgColor: "bg-green-500",
            hoverColor: "hover:bg-green-600"
        },
        {
            name: "X (Twitter)",
            icon: <Twitter size={24} />,
            url: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
            className: "text-white",
            bgColor: "bg-gray-800",
            hoverColor: "hover:bg-gray-900"
        },
        {
            name: "Email",
            icon: <Mail size={24} />,
            url: `mailto:?subject=${encodeURIComponent("Check this amazing recipe!")}&body=${encodedMessageWithUrl}`,
            className: "text-white",
            bgColor: "bg-green-600",
            hoverColor: "hover:bg-green-700"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in slide-in-from-bottom-4 duration-300"
            >
                <div className="relative p-6 pb-4 border-b border-gray-100">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Close modal"
                    >
                        <X className="text-gray-500 h-[24] w-[24]" />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-full">
                            <Share2 size={24} className="text-[#168B5D]" />
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm">Help others discover this Announcement!</p>
                </div>

                {/* Share Preview */}
                <div className="p-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-900 mb-2">{shareMessage}</p>
                        <p className="text-xs text-green-600 truncate font-mono bg-green-50 px-2 py-1 rounded">
                            {shareUrl}
                        </p>
                    </div>
                </div>

                {/* Share Options */}
                <div className="p-6 pt-4">
                    <div className="grid gap-3">
                        {shareOptions.map((option) => (
                            <button
                                key={option.name}
                                onClick={() => handleShare(option.url)}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${option.bgColor} ${option.hoverColor} ${option.className} shadow-md hover:shadow-lg`}
                                aria-label={`Share on ${option.name}`}
                            >
                                <div className="flex-shrink-0">
                                    {option.icon}
                                </div>
                                <div className="flex-1 text-left">
                                    <span className="font-semibold">Share on {option.name}</span>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-2 h-2 bg-white bg-opacity-30 rounded-full"></div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-green-700">
                            💡 Click any option above to share with your network
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}