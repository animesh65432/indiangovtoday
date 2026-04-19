"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type LanguageContextType = {
    language: string;
    onSelectLanguage: (lang: string) => void;
    isReady: boolean;
};

export const LanguageContext = createContext<LanguageContextType>({
    language: "English",
    onSelectLanguage: () => { },
    isReady: false
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState("English");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const lan = localStorage.getItem("lan");
        if (lan) setLanguage(lan);
        setIsReady(true);
    }, []);

    const onSelectLanguage = (lan: string) => {
        setLanguage(lan);
        localStorage.setItem("lan", lan);
    };

    return (
        <LanguageContext.Provider value={{ language, onSelectLanguage, isReady }}>
            {children}
        </LanguageContext.Provider>
    );
};