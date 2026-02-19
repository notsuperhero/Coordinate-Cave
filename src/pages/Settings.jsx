import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/Button';
import './Settings.css';

export default function Settings() {
    const { theme, setTheme } = useTheme();
    const { settings, updateSetting } = useSettings();

    return (
        <div className="settings">
            <h1 className="settings__title">⚙️ Settings</h1>
            <p className="settings__subtitle">Customize your cave adventure!</p>

            <div className="settings__grid">
                {/* Sound */}
                <div className="settings__card">
                    <h3 className="settings__card-title">🔊 Sound</h3>
                    <p className="settings__card-desc">Toggle sound effects on or off</p>
                    <label className="settings__toggle" htmlFor="sound-toggle">
                        <input
                            id="sound-toggle"
                            type="checkbox"
                            checked={settings.soundEnabled}
                            onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                            aria-label="Toggle sound effects"
                        />
                        <span className="settings__toggle-slider" />
                        <span className="settings__toggle-label">{settings.soundEnabled ? 'On' : 'Off'}</span>
                    </label>
                </div>

                {/* Theme */}
                <div className="settings__card">
                    <h3 className="settings__card-title">🎨 Theme</h3>
                    <p className="settings__card-desc">Choose your favorite look</p>
                    <div className="settings__options" role="radiogroup" aria-label="Theme selection">
                        {[
                            { value: 'light', label: '☀️ Light Pastel', color: '#F8F9FA' },
                            { value: 'soft-dark', label: '🌙 Soft Dark', color: '#1E2A33' },
                            { value: 'high-contrast', label: '👁️ High Contrast', color: '#000000' },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                className={`settings__option ${theme === opt.value ? 'settings__option--active' : ''}`}
                                onClick={() => setTheme(opt.value)}
                                role="radio"
                                aria-checked={theme === opt.value}
                                aria-label={opt.label}
                            >
                                <span className="settings__option-swatch" style={{ background: opt.color }} />
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Size */}
                <div className="settings__card">
                    <h3 className="settings__card-title">📐 Grid Size</h3>
                    <p className="settings__card-desc">Adjust the difficulty of the grid</p>
                    <div className="settings__options" role="radiogroup" aria-label="Grid size selection">
                        {[4, 6, 8].map(size => (
                            <button
                                key={size}
                                className={`settings__option ${settings.gridSize === size ? 'settings__option--active' : ''}`}
                                onClick={() => updateSetting('gridSize', size)}
                                role="radio"
                                aria-checked={settings.gridSize === size}
                                aria-label={`${size} by ${size} grid`}
                            >
                                {size}×{size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Text Size */}
                <div className="settings__card">
                    <h3 className="settings__card-title">🔤 Text Size</h3>
                    <p className="settings__card-desc">Make text bigger or smaller</p>
                    <div className="settings__options" role="radiogroup" aria-label="Text size selection">
                        {['small', 'medium', 'large'].map(size => (
                            <button
                                key={size}
                                className={`settings__option ${settings.textSize === size ? 'settings__option--active' : ''}`}
                                onClick={() => updateSetting('textSize', size)}
                                role="radio"
                                aria-checked={settings.textSize === size}
                                aria-label={`${size} text`}
                            >
                                {size.charAt(0).toUpperCase() + size.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reduce Motion */}
                <div className="settings__card">
                    <h3 className="settings__card-title">✋ Animations</h3>
                    <p className="settings__card-desc">Disable all animations if you prefer</p>
                    <label className="settings__toggle" htmlFor="motion-toggle">
                        <input
                            id="motion-toggle"
                            type="checkbox"
                            checked={settings.reduceMotion}
                            onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
                            aria-label="Reduce all animations"
                        />
                        <span className="settings__toggle-slider" />
                        <span className="settings__toggle-label">{settings.reduceMotion ? 'Animations Off' : 'Animations On'}</span>
                    </label>
                </div>

                {/* Animation Speed */}
                <div className="settings__card">
                    <h3 className="settings__card-title">🐢 Animation Speed</h3>
                    <p className="settings__card-desc">How fast should things move?</p>
                    <div className="settings__options" role="radiogroup" aria-label="Animation speed selection">
                        {['slow', 'very slow'].map(speed => (
                            <button
                                key={speed}
                                className={`settings__option ${settings.animationSpeed === speed ? 'settings__option--active' : ''}`}
                                onClick={() => updateSetting('animationSpeed', speed)}
                                role="radio"
                                aria-checked={settings.animationSpeed === speed}
                                aria-label={`${speed} animation speed`}
                            >
                                {speed === 'slow' ? '🐇 Slow' : '🐢 Very Slow'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
