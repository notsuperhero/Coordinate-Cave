import { useEffect, useCallback, useRef } from 'react';
import { throttle } from './debounce';

/**
 * Custom hook for global keyboard controls.
 * Handles Escape (calm mode), R (reset), H (hint) shortcuts.
 * Includes throttle to prevent overstimulation from rapid key presses.
 *
 * @param {Object} handlers
 * @param {Function} handlers.onEscape - Open calm mode / pause
 * @param {Function} handlers.onReset  - Reset level (R key)
 * @param {Function} handlers.onHint   - Show hint (H key)
 * @param {boolean}  enabled - Whether to listen for shortcuts
 */
export default function useKeyboardControls({ onEscape, onReset, onHint, enabled = true }) {
    const handlersRef = useRef({ onEscape, onReset, onHint });

    // Keep handlers fresh without re-registering the listener
    useEffect(() => {
        handlersRef.current = { onEscape, onReset, onHint };
    }, [onEscape, onReset, onHint]);

    const handleKeyDown = useCallback(
        throttle((e) => {
            // Don't trigger shortcuts when typing in an input
            const tag = e.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

            const { onEscape, onReset, onHint } = handlersRef.current;

            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    onEscape && onEscape();
                    break;
                case 'r':
                case 'R':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        onReset && onReset();
                    }
                    break;
                case 'h':
                case 'H':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        onHint && onHint();
                    }
                    break;
                default:
                    break;
            }
        }, 250),
        []
    );

    useEffect(() => {
        if (!enabled) return;
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, handleKeyDown]);
}
