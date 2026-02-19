import useFocusOnRouteChange from '../hooks/useFocusOnRouteChange';

/**
 * FocusManager - A component that hooks into route changes
 * and auto-focuses the main heading for accessibility.
 * Must be rendered inside <Router>.
 */
export default function FocusManager() {
    useFocusOnRouteChange();
    return null; // Renders nothing — just manages focus
}
