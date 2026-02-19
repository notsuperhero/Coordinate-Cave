import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/learn', label: 'Learn', icon: '📚' },
    { to: '/play', label: 'Play', icon: '🎮' },
    { to: '/parent', label: 'Parent', icon: '👪' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Navbar() {
    const location = useLocation();
    const { theme } = useTheme();

    return (
        <>
            <a href="#main-content" className="skip-nav" aria-label="Skip to main content">
                Skip to content
            </a>
            <nav className="navbar" role="navigation" aria-label="Main navigation">
                <div className="navbar__brand">
                    <Link to="/" className="navbar__logo" aria-label="Coordinate Cave home">
                        <span className="navbar__logo-icon" aria-hidden="true">🦇</span>
                        <span className="navbar__logo-text">Coordinate Cave</span>
                    </Link>
                </div>
                <ul className="navbar__links" role="menubar">
                    {navLinks.map(link => (
                        <li key={link.to} role="none">
                            <Link
                                to={link.to}
                                className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
                                role="menuitem"
                                aria-current={location.pathname === link.to ? 'page' : undefined}
                                aria-label={link.label}
                            >
                                <span className="navbar__link-icon" aria-hidden="true">{link.icon}</span>
                                <span className="navbar__link-label">{link.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
