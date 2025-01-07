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
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme === "light" ? false : true;
    const [darkMode, setDarkMode] = useState(initialTheme);

    const toggleTheme = () => {
        // setDarkMode((mode) => !mode);
        setDarkMode((mode) => {
            const newMode = !mode;
            localStorage.setItem("theme", newMode ? "dark" : "light");
            return newMode;
        });
    };

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            darkMode ? "halloween" : "cupcake"
        );
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ toggleTheme, darkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
