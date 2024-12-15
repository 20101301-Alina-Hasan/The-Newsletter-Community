/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */

import { useState, createContext, useContext, useEffect, ReactNode } from "react";
import { ThemeContextType } from "../interfaces/themeInterface";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(true);

    const toggleTheme = () => {
        setDarkMode((mode) => !mode);
    };

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            darkMode ? "halloween" : "garden"
        );
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ toggleTheme, darkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
