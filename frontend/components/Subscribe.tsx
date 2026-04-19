"use client";
import React, { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { X, LoaderCircle, Bell } from "lucide-react";
import { addthesubscribe } from "../api/aleart";
import { toast } from "react-toastify";
import { LanguageContext } from "@/context/Lan";
import { TranslateText } from "@/lib/translatetext";
import { ThemeContext } from "@/context/Theme";

type Props = {
    forceOpen?: boolean;
    onClose?: () => void;
}

const Subscribe: React.FC<Props> = ({ forceOpen = false, onClose }) => {
    const [mounted, setMounted] = useState(false);
    const { theme } = useContext(ThemeContext);
    const { language } = useContext(LanguageContext);
    const [showPopup, setShowPopup] = useState(false);
    const [Email, setEmail] = useState<string>("");
    const [IsLoading, SetIsLoading] = useState<boolean>(false);
    const isDark = theme === "dark";

    useEffect(() => {
        setMounted(true);

        if (forceOpen) {
            setShowPopup(true);
            return;
        }

        const savedEmail = localStorage.getItem("Email");
        if (savedEmail) return;
        const timer = setTimeout(() => setShowPopup(true), 10000);
        return () => clearTimeout(timer);
    }, [forceOpen]);

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
            onClose?.();
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
        onClose?.();
    };

    const popup = (
        <div
            className="fixed inset-0 z-800 flex items-center justify-center bg-[#050505]/40 backdrop-blur-sm"
            style={{ fontFamily: "var(--font-satoshi)" }}
        >
            <div className={`relative w-full max-w-md mx-4 overflow-hidden rounded-2xl shadow-2xl ${isDark ? "bg-[#0f0f0f]" : "bg-white"}`}>

                <div className="h-1 w-full" style={{ backgroundColor: "#c51057" }} />

                <button
                    onClick={handleClose}
                    className={`absolute top-4 right-4 transition-opacity opacity-40 hover:opacity-80 ${isDark ? "text-white" : "text-[#321F1F]"}`}
                >
                    <X size={18} />
                </button>

                <div className="p-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Bell size={13} style={{ color: "#c51057" }} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#c51057" }}>
                                {TranslateText[language].NEVER_MISS_AN_UPDATE}
                            </span>
                        </div>

                        <h3
                            className="text-2xl font-bold leading-snug"
                            style={{ color: "#c51057", fontFamily: "var(--font-literata)" }}
                        >
                            {TranslateText[language].SUBSCRIBE_TO_ALERTS}
                        </h3>

                        <p className={`text-[13px] leading-relaxed mt-1 ${isDark ? "text-white/60" : "text-[#321F1F]/60"}`}>
                            {TranslateText[language].GET_NOTIFIED_WHEN_NEW_GOVERNMENT_ANNOUNCEMENTS_ARE_PUBLISHED_FILTERED_TO_WHAT_MATTERS_TO_YOU}
                        </p>
                    </div>

                    <div className={`h-px w-full ${isDark ? "bg-white/10" : "bg-[#321F1F]/10"}`} />

                    <div className="flex flex-col gap-3">
                        <input
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handlesubscribe()}
                            type="email"
                            placeholder={`${TranslateText[language].PLEASE_ENTER_YOUR_EMAIL}`}
                            className="rounded-lg text-sm px-4 py-3 w-full outline-none transition-all duration-200"
                            style={{
                                border: "1.5px solid",
                                borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(50,31,31,0.15)",
                                color: isDark ? "white" : "#321F1F",
                                backgroundColor: isDark ? "#1a1a1a" : "#fafafa",
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = "#c51057")}
                            onBlur={e => (e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(50,31,31,0.15)")}
                        />

                        <button
                            type="button"
                            onClick={handlesubscribe}
                            className="font-bold text-[11px] uppercase tracking-[0.16em] py-3 px-4 rounded-lg w-full transition-all duration-200 active:scale-[0.98] text-white"
                            style={{ backgroundColor: "#c51057" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e02020")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#c51057")}
                        >
                            {IsLoading
                                ? <LoaderCircle className="animate-spin h-4 w-4 mx-auto" />
                                : TranslateText[language].SUBSCRIBE}
                        </button>
                    </div>

                    <p className={`text-[11px] text-center tracking-wide ${isDark ? "text-white/35" : "text-[#321F1F]/35"}`}>
                        {TranslateText[language].NO_SPAM_UNSUBSCRIBE_ANYTIME}
                    </p>
                </div>
            </div>
        </div>
    );

    return showPopup ? createPortal(popup, document.body) : null;
};

export default Subscribe;