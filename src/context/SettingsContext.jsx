import React, { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
    soundEnabled: true,
    gridSize: 6,
    difficulty: 'easy',
    reduceMotion: false,
    textSize: 'medium',
    animationSpeed: 'slow',
};

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('cc-settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    useEffect(() => {
        localStorage.setItem('cc-settings', JSON.stringify(settings));

        // Apply text size
        const sizes = { small: '14px', medium: '16px', large: '20px' };
        document.documentElement.style.setProperty('--base-font-size', sizes[settings.textSize] || '16px');

        // Apply reduce motion
        if (settings.reduceMotion) {
            document.documentElement.classList.add('reduce-motion');
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
}

export default SettingsContext;
