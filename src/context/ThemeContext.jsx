import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

const themes = {
    light: {
        '--bg-color': '#F8F9FA',
        '--bg-secondary': '#FFFFFF',
        '--card-bg': '#FFFFFF',
        '--text-primary': '#2F3E46',
        '--text-secondary': '#5A6B73',
        '--nav-bg': 'rgba(255,255,255,0.85)',
        '--grid-bg': '#F0F7F4',
        '--grid-line': '#D4E8E0',
        '--cell-hover': 'rgba(168,218,220,0.3)',
        '--shadow': '0 4px 20px rgba(0,0,0,0.06)',
        '--accent': '#A8DADC',
        '--accent-secondary': '#B8E0D2',
        '--overlay-bg': 'rgba(248,249,250,0.95)',
    },
    'soft-dark': {
        '--bg-color': '#1E2A33',
        '--bg-secondary': '#253340',
        '--card-bg': '#2A3A48',
        '--text-primary': '#E8F0F2',
        '--text-secondary': '#A0B4C0',
        '--nav-bg': 'rgba(30,42,51,0.9)',
        '--grid-bg': '#253340',
        '--grid-line': '#3A5060',
        '--cell-hover': 'rgba(168,218,220,0.15)',
        '--shadow': '0 4px 20px rgba(0,0,0,0.2)',
        '--accent': '#7BC8CC',
        '--accent-secondary': '#8ED0C0',
        '--overlay-bg': 'rgba(30,42,51,0.95)',
    },
    'high-contrast': {
        '--bg-color': '#000000',
        '--bg-secondary': '#1A1A1A',
        '--card-bg': '#1A1A1A',
        '--text-primary': '#FFFFFF',
        '--text-secondary': '#E0E0E0',
        '--nav-bg': 'rgba(0,0,0,0.95)',
        '--grid-bg': '#1A1A1A',
        '--grid-line': '#FFFFFF',
        '--cell-hover': 'rgba(255,255,255,0.2)',
        '--shadow': '0 4px 20px rgba(255,255,255,0.1)',
        '--accent': '#00FFFF',
        '--accent-secondary': '#00FF88',
        '--overlay-bg': 'rgba(0,0,0,0.97)',
    },
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('cc-theme');
        return saved || 'light';
    });

    useEffect(() => {
        const vars = themes[theme];
        if (vars) {
            Object.entries(vars).forEach(([key, value]) => {
                document.documentElement.style.setProperty(key, value);
            });
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cc-theme', theme);
    }, [theme]);

    const cycleTheme = () => {
        const order = ['light', 'soft-dark', 'high-contrast'];
        const idx = order.indexOf(theme);
        setTheme(order[(idx + 1) % order.length]);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
}

export default ThemeContext;
