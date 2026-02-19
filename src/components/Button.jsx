import React from 'react';
import './Button.css';

/**
 * Reusable large, rounded button with ARIA support and focus ring.
 */
export default function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'large',
    ariaLabel,
    disabled = false,
    className = '',
    icon,
    ...props
}) {
    return (
        <button
            className={`btn btn--${variant} btn--${size} ${className}`}
            onClick={onClick}
            aria-label={ariaLabel || undefined}
            disabled={disabled}
            {...props}
        >
            {icon && <span className="btn__icon" aria-hidden="true">{icon}</span>}
            <span className="btn__text">{children}</span>
        </button>
    );
}
