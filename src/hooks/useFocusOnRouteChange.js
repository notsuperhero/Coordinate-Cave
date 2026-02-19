import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that auto-focuses the main heading whenever
 * the route changes — essential for screen reader users and
 * cognitive accessibility.
 */
export default function useFocusOnRouteChange() {
    const location = useLocation();
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip auto-focus on first render (initial page load)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Small delay to let new page render
        const timer = setTimeout(() => {
            // Try to focus the main content area first
            const main = document.getElementById('main-content');
            if (main) {
                main.focus({ preventScroll: false });
            }

            // Then announce page change to screen readers
            const heading = document.querySelector('#main-content h1');
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus({ preventScroll: false });
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [location.pathname]);
}
