"use client";
import { useEffect } from "react";

export default function ScrollBackgroundEffect() {
    useEffect(() => {
        const handleScroll = () => {

            if (window.scrollY > 100) {
                document.body.classList.add("scrolled");
            } else {
                document.body.classList.remove("scrolled");
            }
        };

        window.addEventListener("scroll", handleScroll);
        console.log("✅ Scroll listener attached to body");

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return null;
}
