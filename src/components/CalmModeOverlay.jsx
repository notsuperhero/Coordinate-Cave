import React, { useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import useFocusTrap from '../hooks/useFocusTrap';
import Button from './Button';
import './CalmModeOverlay.css';

/**
 * Full-screen calm mode overlay with:
 * - Focus trapping (Tab cycles inside overlay)
 * - Spacebar to resume
 * - Breathing animation
 * - Screen reader announcements
 */
export default function CalmModeOverlay() {
    const { gameState, dispatch } = useGame();
    const isActive = gameState.isCalmMode;
    const containerRef = useFocusTrap(isActive);

    // Spacebar to resume
    const handleKeyDown = useCallback((e) => {
        if (!isActive) return;
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            dispatch({ type: 'EXIT_CALM_MODE' });
        }
    }, [isActive, dispatch]);

    useEffect(() => {
        if (!isActive) return;
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, handleKeyDown]);

    // Prevent background scroll when overlay is open
    useEffect(() => {
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div
            className="calm-overlay"
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Calm mode - take a break"
        >
            <div className="calm-overlay__content">
                {/* Screen reader announcement */}
                <div role="status" aria-live="assertive" className="sr-only">
                    Calm mode activated. Take a deep breath. Press Space or click the button to resume.
                </div>

                <h2 className="calm-overlay__title">Let's Take a Break 💙</h2>
                <p className="calm-overlay__subtitle">Breathe in... and out... slowly</p>

                <div className="calm-overlay__breathing">
                    <div className="calm-overlay__circle" aria-hidden="true">
                        <span className="calm-overlay__circle-text">Breathe</span>
                    </div>
                </div>

                <div className="calm-overlay__decorations" aria-hidden="true">
                    <span className="calm-decoration calm-decoration--1">✨</span>
                    <span className="calm-decoration calm-decoration--2">🌟</span>
                    <span className="calm-decoration calm-decoration--3">💫</span>
                </div>

                <p className="calm-overlay__message">
                    You're doing an amazing job, explorer! 🦇
                    <br />
                    Come back whenever you're ready.
                </p>

                <p className="calm-overlay__hint" aria-hidden="true">
                    Press <kbd>Space</kbd> to continue
                </p>

                <Button
                    variant="mint"
                    size="large"
                    onClick={() => dispatch({ type: 'EXIT_CALM_MODE' })}
                    ariaLabel="Resume playing"
                >
                    🌈 I'm Ready to Continue!
                </Button>
            </div>
        </div>
    );
}
