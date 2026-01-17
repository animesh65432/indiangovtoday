"use client";
import React, { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { X, LoaderCircle } from "lucide-react"
import { addthesubscribe } from "../api/aleart"
import { toast } from "react-toastify";
import { LanguageContext } from "@/context/Lan"
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
        if (savedEmail) {
            return;
        }
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 10000);

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
        setMounted(false)
        localStorage.setItem("Email", "subscribed");
    }

    const popup = (
        <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center flex flex-col gap-2">
                <div className="flex w-full  justify-end">
                    <X className="text-black " size={28} onClick={handleClose} />
                </div>
                <h6
                    className="text-xl md:text-2xl font-semibold mb-2 text-yellow-600"
                >
                    {TranslateText[language].SUBSCRIBE_TO_ALERTS}
                </h6>
                <span className="text-black mb-4">
                    {TranslateText[language].NEVER_MISS_AN_UPDATE}
                </span>
                <form className="flex flex-col gap-3">
                    <input
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        placeholder={`${TranslateText[language].PLEASE_ENTER_YOUR_EMAIL}`}
                        className="border rounded-none p-2 text-black w-full placeholder:text-black   border-black"
                    />
                    <button
                        type="button"
                        onClick={handlesubscribe}
                        className="p-2 border border-black rounded-none text-black"
                    >
                        {IsLoading ? <LoaderCircle className="text-black P-4 mx-auto animate-spin h-6 w-6" /> : `${TranslateText[language].SUBSCRIBE}`}
                    </button>
                </form>
            </div>
        </div>
    );

    return showPopup ? createPortal(popup, document.body) : null;
};

export default Subscribe;
