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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            style={{ fontFamily: "var(--font-satoshi)" }}>
            <div className="relative w-full max-w-md mx-4 overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* Top red accent bar */}
                <div className="h-1 w-full" style={{ backgroundColor: "#ff3333" }} />

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 transition-opacity opacity-40 hover:opacity-80"
                    style={{ color: "#321F1F" }}
                >
                    <X size={18} />
                </button>

                <div className="p-8 flex flex-col gap-6">

                    {/* Icon + Heading */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Bell size={13} style={{ color: "#ff3333" }} />
                            <span
                                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                                style={{ color: "#ff3333" }}
                            >
                                {TranslateText[language].NEVER_MISS_AN_UPDATE}
                            </span>
                        </div>

                        <h3
                            className="text-2xl font-bold leading-snug"
                            style={{ color: "#ff3333", fontFamily: "var(--font-literata)" }}
                        >
                            {TranslateText[language].SUBSCRIBE_TO_ALERTS}
                        </h3>

                        <p className="text-[13px] leading-relaxed mt-1" style={{ color: "#321F1F", opacity: 0.6 }}>
                            Get notified when new government announcements are published — filtered to what matters to you.
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full" style={{ backgroundColor: "#321F1F", opacity: 0.08 }} />

                    {/* Input + Button */}
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
                                borderColor: "rgba(50,31,31,0.15)",
                                color: "#321F1F",
                                backgroundColor: "#fafafa",
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = "#ff3333")}
                            onBlur={e => (e.currentTarget.style.borderColor = "rgba(50,31,31,0.15)")}
                        />

                        <button
                            type="button"
                            onClick={handlesubscribe}
                            className="font-bold text-[11px] uppercase tracking-[0.16em] py-3 px-4 rounded-lg w-full transition-all duration-200 active:scale-[0.98] text-white"
                            style={{ backgroundColor: "#ff3333" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e02020")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ff3333")}
                        >
                            {IsLoading
                                ? <LoaderCircle className="animate-spin h-4 w-4 mx-auto" />
                                : TranslateText[language].SUBSCRIBE}
                        </button>
                    </div>

                    {/* Footer note */}
                    <p className="text-[11px] text-center tracking-wide" style={{ color: "#321F1F", opacity: 0.35 }}>
                        No spam. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </div>
    );

    return showPopup ? createPortal(popup, document.body) : null;
};

export default Subscribe;