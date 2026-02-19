import React from 'react';
import './ProgressBar.css';

/**
 * Visual step progress bar for Learn mode or level tracker.
 * @param {number} current — current step (1-indexed)
 * @param {number} total — total steps
 * @param {string} label — accessible label
 */
export default function ProgressBar({ current, total, label = 'Progress' }) {
    const percentage = Math.min((current / total) * 100, 100);

    return (
        <div className="progress-bar" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total} aria-label={label}>
            <div className="progress-bar__label">
                <span>{label}</span>
                <span>{current} / {total}</span>
            </div>
            <div className="progress-bar__track">
                <div className="progress-bar__fill" style={{ width: `${percentage}%` }}>
                    {percentage > 15 && <span className="progress-bar__star" aria-hidden="true">⭐</span>}
                </div>
            </div>
        </div>
    );
}
