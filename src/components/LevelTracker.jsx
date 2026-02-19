import React from 'react';
import './LevelTracker.css';

/**
 * Displays current level and collected stars/badges.
 */
export default function LevelTracker({ level, stars, badges = [] }) {
    return (
        <div className="level-tracker" role="status" aria-label={`Level ${level}, ${stars} stars collected`}>
            <div className="level-tracker__level">
                <span className="level-tracker__icon" aria-hidden="true">🏔️</span>
                <span className="level-tracker__text">Level {level}</span>
            </div>
            <div className="level-tracker__stars">
                <span aria-hidden="true">⭐</span>
                <span className="level-tracker__count">{stars}</span>
            </div>
            {badges.length > 0 && (
                <div className="level-tracker__badges" aria-label={`Badges earned: ${badges.length}`}>
                    {badges.slice(-3).map(badge => (
                        <span key={badge.id} className="level-tracker__badge" title={badge.name}>
                            {badge.icon}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
