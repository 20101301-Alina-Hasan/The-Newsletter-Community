import { MoonIcon } from 'lucide-react';
import { useTheme } from '../contexts/themeContext';
import { SunIcon } from './Icons/SunIcon';

export function ThemeButton() {
    const { toggleTheme, darkMode } = useTheme();

    return (
        <label className="swap swap-rotate">
            <input
                type="checkbox"
                className="theme-controller"
                onChange={toggleTheme}
                checked={darkMode}
            />
            <div className="swap-on h-6 w-6 fill-current">
                < SunIcon />
            </div>
            <div className="swap-off h-6 w-6 fill-current">
                < MoonIcon />
            </div>
        </label>
    );
}

