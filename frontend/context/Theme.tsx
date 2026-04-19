"use client"

import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext({
    theme: "light",
    onChangeTheme: (theme: "light" | "dark") => { }
})

type Props = {
    children: React.ReactNode
}

const ThemeProvider: React.FC<Props> = ({ children }) => {
    const [theme, setTheme] = useState<"light" | "dark">("light")

    useEffect(() => {
        const saved = localStorage.getItem("theme") as "light" | "dark" | null
        if (saved) setTheme(saved)
    }, [])

    const onChangeTheme = (newTheme: "light" | "dark") => {
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, onChangeTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider