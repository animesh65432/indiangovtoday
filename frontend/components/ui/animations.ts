// animations.ts

import { Transition } from "framer-motion";

export const tileVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -4, transition: { duration: 0.2 } },
};

export const tileTransition = (index: number): Transition => ({
    duration: 0.4,
    delay: index * 0.06,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // ✅ tuple, not number[]
});

export const arrowVariants = {
    whileHover: { scale: 1.12 },
    whileTap: { scale: 0.95 },
};

export const arrowTransition: Transition = {
    duration: 0.2,
};