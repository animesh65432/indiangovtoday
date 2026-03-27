// hooks/useIsMobile.ts
import { useState, useEffect } from "react";

export const useIsMobile = (breakpoint = 750) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < breakpoint);
        check(); // run on mount
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [breakpoint]);

    return isMobile;
};