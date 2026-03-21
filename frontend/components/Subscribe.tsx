"use client";
import React, { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { X, LoaderCircle, Bell } from "lucide-react";
import { addthesubscribe } from "../api/aleart";
import { toast } from "react-toastify";
import { LanguageContext } from "@/context/Lan";
import { TranslateText } from "@/lib/translatetext";

const Subscribe: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { language } = useContext(LanguageContext);
    const [showPopup, setShowPopup] = useState(false);
    const [Email, setEmail] = useState<string>("");
    const [IsLoading, SetIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        const savedEmail = localStorage.getItem("Email");
        if (savedEmail) return;
        const timer = setTimeout(() => setShowPopup(true), 10000);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    const handlesubscribe = async () => {
        if (!Email) {
            toast.error(`${TranslateText[language].PLEASE_ENTER_YOUR_EMAIL}`);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email)) {
            toast.error(`${TranslateText[language].PLEASE_ENTER_A_VALID_EMAIL}`);
            return;
        }
        SetIsLoading(true);
        try {
            await addthesubscribe(Email);
            setShowPopup(false);
            localStorage.setItem("Email", JSON.stringify(Email));
            toast.success(`${TranslateText[language].SUCCESSFULLY_SUBSCRIBED}`);
        } catch (err) {
            toast.error(`${TranslateText[language].FAILED_TO_SUBSCRIBE}`);
        } finally {
            SetIsLoading(false);
        }
    };

    const handleClose = () => {
        setShowPopup(false);
        setMounted(false);
        localStorage.setItem("Email", "subscribed");
    };

    const popup = (
        <div className="fixed inset-0 z-50 font-satoshi flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 overflow-hidden rounded-xl
                            bg-[#111111] border border-white/[0.08]
                            shadow-[0_24px_60px_rgba(0,0,0,0.8)]">

                {/* Top orange accent line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF9933] to-transparent" />

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="p-8 flex flex-col gap-6">

                    {/* Icon + Heading */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Bell size={14} className="text-[#FF9933]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF9933]">
                                {TranslateText[language].NEVER_MISS_AN_UPDATE}
                            </span>
                        </div>
                        <h3 className="text-white text-xl font-bold leading-snug">
                            {TranslateText[language].SUBSCRIBE_TO_ALERTS}
                        </h3>
                        <p className="text-white/40 text-[12px] leading-relaxed">
                            Get notified when new government announcements are published — filtered to what matters to you.
                        </p>
                    </div>

                    {/* Input + Button */}
                    <div className="flex flex-col gap-3">
                        <input
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handlesubscribe()}
                            type="email"
                            placeholder={`${TranslateText[language].PLEASE_ENTER_YOUR_EMAIL}`}
                            className="bg-white/[0.05] border border-white/[0.08] rounded-lg
                                       text-white text-sm placeholder:text-white/25
                                       px-4 py-3 w-full outline-none
                                       focus:border-[#FF9933]/50 focus:ring-1 focus:ring-[#FF9933]/20
                                       transition-all duration-200"
                        />
                        <button
                            type="button"
                            onClick={handlesubscribe}
                            className="bg-[#FF9933] hover:bg-[#e88820]
                                       text-black font-bold text-[11px] uppercase tracking-[0.14em]
                                       py-3 px-4 rounded-lg w-full
                                       transition-all duration-200
                                       hover:shadow-[0_0_20px_rgba(255,153,51,0.3)]
                                       active:scale-[0.98]"
                        >
                            {IsLoading
                                ? <LoaderCircle className="animate-spin h-4 w-4 mx-auto" />
                                : `${TranslateText[language].SUBSCRIBE}`}
                        </button>
                    </div>

                    {/* Footer note */}
                    <p className="text-white/20 text-[11px] text-center tracking-wide">
                        No spam. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </div>
    );

    return showPopup ? createPortal(popup, document.body) : null;
};

export default Subscribe;