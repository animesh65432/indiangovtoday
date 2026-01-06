// lib/animations.ts
import { Variants } from "framer-motion";

export const fadeInContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
} as const; // <--- Add this

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeInOut", // This is now treated as a literal type
        },
    },
} as const; // <--- Add this