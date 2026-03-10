"use client";
import React, { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { X, LoaderCircle } from "lucide-react";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative bg-[#f5f3ef] w-full max-w-md mx-4 p-8 flex flex-col gap-6">

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-[#999] hover:text-black transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col gap-1">
                    <div className="w-8 h-[2px] bg-black mb-3" />
                    <h3 className="font-display text-black text-2xl font-bold leading-tight">
                        {TranslateText[language].SUBSCRIBE_TO_ALERTS}
                    </h3>
                    <span className="font-body text-[#888] text-[11px] uppercase tracking-[0.14em]">
                        {TranslateText[language].NEVER_MISS_AN_UPDATE}
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder={`${TranslateText[language].PLEASE_ENTER_YOUR_EMAIL}`}
                        className="border border-[#d0ccc5] bg-white text-black placeholder:text-[#bbb] placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest p-3 w-full outline-none focus:border-black transition-colors rounded-none font-body text-sm"
                    />
                    <button
                        type="button"
                        onClick={handlesubscribe}
                        className="bg-black text-white uppercase text-[10px] font-bold tracking-[0.16em] p-3 hover:bg-[#333] transition-colors rounded-none font-body"
                    >
                        {IsLoading
                            ? <LoaderCircle className="animate-spin h-4 w-4 mx-auto" />
                            : `${TranslateText[language].SUBSCRIBE}`}
                    </button>
                </div>

                <p className="font-body text-[10px] text-[#bbb] tracking-wide text-center">
                    No spam. Unsubscribe anytime.
                </p>

            </div>
        </div>
    );

    return showPopup ? createPortal(popup, document.body) : null;
};

export default Subscribe;