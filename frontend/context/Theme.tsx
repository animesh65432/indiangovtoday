"use client"

import React, { createContext, useState } from 'react'

export const ThemeContext = createContext({
    theme: "light",
    onChangeTheme: (theme: "light" | "dark") => { }
})

type Props = {
    children: React.ReactNode
}

const ThemeProvider: React.FC<Props> = ({ children }) => {
    const [theme, setTheme] = useState("light")

    const onChangeTheme = (newTheme: "light" | "dark") => {
        setTheme(newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, onChangeTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider