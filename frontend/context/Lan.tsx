import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type LanguageContextType = {
    language: string;
    onSelectLanguage: (lang: string) => void;
};

type Props = {
    children: ReactNode;
};

export const LanguageContext = createContext<LanguageContextType>({
    language: "English",
    onSelectLanguage: () => { }
});

export const LanguageProvider = ({ children }: Props) => {
    const [language, setLanguage] = useState("English");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const lan = localStorage.getItem("lan");
            if (lan) setLanguage(lan);
        }
    }, []);

    const onSelectLanguage = (lan: string) => {
        setLanguage(lan);
        if (typeof window !== "undefined") {
            localStorage.setItem("lan", lan);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, onSelectLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const UseLanguageContext = () => {
    const context = useContext(LanguageContext)

    if (!context) {
        return null
    }

    return context
}