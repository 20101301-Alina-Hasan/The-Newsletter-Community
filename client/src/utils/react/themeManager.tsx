export const getStoredTheme = (): string => {
    return localStorage.getItem('theme') || 'retro';
};

export const setStoredTheme = (theme: string): void => {
    localStorage.setItem('theme', theme);
};

export const applyTheme = (theme: string): void => {
    document.documentElement.setAttribute('data-theme', theme);
};
