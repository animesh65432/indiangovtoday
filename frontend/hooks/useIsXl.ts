// ✅ hooks/useIsXl.ts
import { useState, useEffect } from "react";

export const useIsXl = () => {
    const [isXl, setIsXl] = useState(false);

    useEffect(() => {
        const check = () => setIsXl(window.innerWidth >= 1280);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return isXl;
};