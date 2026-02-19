/**
 * Creates a debounced version of a function to prevent
 * overstimulating rapid-fire events (keyboard, click).
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function}
 */
export function debounce(fn, delay = 200) {
    let timer = null;
    const debounced = (...args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, delay);
    };
    debounced.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = null;
    };
    return debounced;
}

/**
 * Throttle a function so it fires at most once per interval.
 * Better for keyboard navigation where we want the first press
 * to register immediately but prevent rapid repeats.
 * @param {Function} fn
 * @param {number} interval
 */
export function throttle(fn, interval = 150) {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= interval) {
            lastCall = now;
            fn(...args);
        }
    };
}
