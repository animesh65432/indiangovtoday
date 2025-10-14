"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, LoaderCircle } from "lucide-react"
import { addthesubscribe } from "../api/aleart"
import { toast } from "react-toastify";

const Subscribe: React.FC = () => {
    const [mounted, setMounted] = useState(false);
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
            toast.error("Please enter your email");
            return;
        }

        SetIsLoading(true);
        try {
            await addthesubscribe(Email);
            setShowPopup(false);
            localStorage.setItem("Email", JSON.stringify(Email));
            toast.success("Successfully subscribed");
        } catch (err) {
            toast.error("Failed to subscribe");
        } finally {
            SetIsLoading(false);
        }
    };

    const popup = (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
                <div className="flex w-full  justify-end">
                    <X className="text-[#E0614B] " size={28} onClick={() => setMounted(false)} />
                </div>
                <p className="text-xl font-semibold mb-2 text-[#E0614B] ">Subscribe to Alerts
                </p>
                <p className="text-gray-600 mb-4">
                    Never miss an update — get daily announcement alerts.
                </p>
                <form className="flex flex-col gap-3">
                    <input
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        placeholder="Enter your Email"
                        className="border rounded-md p-2 text-gray-600 w-full placeholder:text-gray-600 "
                    />
                    <button
                        type="button"
                        onClick={handlesubscribe}
                        className="bg-[#E0614B] text-white py-2 rounded-md hover:bg-[#dd8272] transition"
                    >
                        {IsLoading ? <LoaderCircle className="text-white mx-auto animate-spin h-6 w-6" /> : " Subscribe"}
                    </button>
                </form>
            </div>
        </div>
    );

    return showPopup ? createPortal(popup, document.body) : null;
};

export default Subscribe;
