import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to trap focus inside a container (e.g., modal overlay).
 * When active, Tab and Shift+Tab cycle through focusable children only.
 * On deactivation, restores focus to the previously focused element.
 *
 * @param {boolean} isActive - Whether the focus trap is active
 * @returns {React.RefObject} - Ref to attach to the container element
 */
export default function useFocusTrap(isActive) {
    const containerRef = useRef(null);
    const previousFocusRef = useRef(null);

    // Save the previously focused element when entering
    useEffect(() => {
        if (isActive) {
            previousFocusRef.current = document.activeElement;

            // Auto-focus the first focusable element inside
            requestAnimationFrame(() => {
                if (containerRef.current) {
                    const focusable = getFocusableElements(containerRef.current);
                    if (focusable.length > 0) {
                        focusable[0].focus();
                    }
                }
            });
        } else {
            // Restore focus
            if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
                previousFocusRef.current.focus();
                previousFocusRef.current = null;
            }
        }
    }, [isActive]);

    // Trap tab key inside container
    const handleKeyDown = useCallback((e) => {
        if (!isActive || !containerRef.current) return;
        if (e.key !== 'Tab') return;

        const focusable = getFocusableElements(containerRef.current);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isActive, handleKeyDown]);

    return containerRef;
}

function getFocusableElements(container) {
    const selectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ];
    return Array.from(container.querySelectorAll(selectors.join(',')));
}
