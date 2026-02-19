import React from 'react';
import { Link } from 'react-router-dom';
import CaveGuide from '../components/CaveGuide';
import Button from '../components/Button';
import { useGame, getCurrentTag, getNextTag, getUnlockedTags } from '../context/GameContext';
import './Home.css';

/**
 * Home Page — Welcome screen with motivational tags,
 * trophy showcase, and gentle encouragement.
 */
export default function Home() {
    const { gameState } = useGame();
    const currentTag = getCurrentTag(gameState.stars);
    const nextTag = getNextTag(gameState.stars);
    const unlockedTags = getUnlockedTags(gameState.stars);
    const hasProgress = gameState.stars > 0 || gameState.totalGames > 0;

    return (
        <div className="home">
            {/* Cave Background Decorations */}
            <div className="home__cave-bg" aria-hidden="true">
                <svg className="home__cave-svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMax slice">
                    {/* Cave ceiling stalactites */}
                    <path d="M0,0 L0,80 Q50,120 100,70 Q130,50 160,90 Q200,140 240,60 Q280,20 320,100 Q360,150 400,80 Q440,30 480,110 Q520,160 560,70 Q600,20 640,100 Q680,140 720,60 Q760,30 800,90 L800,0 Z" fill="var(--grid-bg)" opacity="0.5" />
                    {/* Crystals */}
                    <g className="home__crystals">
                        <polygon points="120,280 130,240 140,280" fill="#EAD7FF" opacity="0.6" />
                        <polygon points="125,280 132,250 139,280" fill="#D4C0F0" opacity="0.4" />
                        <polygon points="650,270 660,220 670,270" fill="#A8DADC" opacity="0.6" />
                        <polygon points="655,270 662,235 669,270" fill="#88C8CB" opacity="0.4" />
                        <polygon points="380,285 388,250 396,285" fill="#B8E0D2" opacity="0.5" />
                    </g>
                    {/* Glowing orbs */}
                    <circle cx="200" cy="100" r="4" fill="#FFF3B0" opacity="0.7">
                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="500" cy="80" r="3" fill="#EAD7FF" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="7s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="700" cy="130" r="5" fill="#B8E0D2" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
                    </circle>
                </svg>
            </div>

            {/* Welcome Section */}
            <div className="home__content">
                <div className="home__hero">
                    <CaveGuide mood="welcome" />
                    <h1 className="home__title">Welcome Explorer!</h1>
                    <p className="home__subtitle">
                        Let's discover coordinates together! 🗺️
                    </p>
                </div>

                {/* Current Motivational Tag */}
                {hasProgress && (
                    <div className="home__current-tag" role="status" aria-label={`Your title: ${currentTag.title}`}>
                        <span className="home__tag-icon">{currentTag.icon}</span>
                        <div className="home__tag-info">
                            <span className="home__tag-title">{currentTag.title}</span>
                            <span className="home__tag-message">{currentTag.message}</span>
                        </div>
                    </div>
                )}

                {/* Next tag encouragement — gentle, no pressure */}
                {hasProgress && nextTag && (
                    <div className="home__next-tag" aria-label={`Next milestone: ${nextTag.title}`}>
                        <span className="home__next-tag-text">
                            ✨ {nextTag.minStars - gameState.stars} more stars to become
                        </span>
                        <span className="home__next-tag-name">
                            {nextTag.icon} {nextTag.title}
                        </span>
                        <span className="home__next-tag-note">
                            No rush — enjoy the adventure!
                        </span>
                    </div>
                )}

                {/* Trophy Showcase — all earned badges */}
                {gameState.badges.length > 0 && (
                    <div className="home__trophies" aria-label="Your trophies">
                        <h3 className="home__trophies-title">🏆 Your Trophy Shelf</h3>
                        <div className="home__trophy-grid">
                            {gameState.badges.map((badge) => (
                                <div key={badge.id} className="home__trophy" title={badge.name}>
                                    <span className="home__trophy-icon">{badge.icon}</span>
                                    <span className="home__trophy-name">{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Unlocked Tags Gallery */}
                {unlockedTags.length > 1 && (
                    <div className="home__tags-gallery" aria-label="Your unlocked titles">
                        <h3 className="home__trophies-title">🏅 Titles Earned</h3>
                        <div className="home__tags-list">
                            {unlockedTags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className={`home__tag-chip ${tag.id === currentTag.id ? 'home__tag-chip--active' : ''}`}
                                >
                                    {tag.icon} {tag.title}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                {hasProgress && (
                    <div className="home__quick-stats">
                        <div className="home__quick-stat">
                            <span className="home__quick-stat-value">⭐ {gameState.stars}</span>
                            <span className="home__quick-stat-label">Stars</span>
                        </div>
                        <div className="home__quick-stat">
                            <span className="home__quick-stat-value">🏔️ {gameState.levelsCompleted.length}</span>
                            <span className="home__quick-stat-label">Levels</span>
                        </div>
                        <div className="home__quick-stat">
                            <span className="home__quick-stat-value">🎮 {gameState.totalGames}</span>
                            <span className="home__quick-stat-label">Games</span>
                        </div>
                    </div>
                )}

                {/* Treasure chest SVG */}
                <div className="home__treasure" aria-hidden="true">
                    <svg viewBox="0 0 80 60" className="home__treasure-svg">
                        <rect x="10" y="25" width="60" height="30" rx="5" fill="#C9956B" />
                        <rect x="10" y="25" width="60" height="10" rx="5" fill="#B8834D" />
                        <rect x="35" y="30" width="10" height="8" rx="2" fill="#FFF3B0" />
                        <path d="M10,25 Q40,10 70,25" fill="#B8834D" stroke="#A0703A" strokeWidth="1" />
                        {/* Glow from chest */}
                        <ellipse cx="40" cy="25" rx="15" ry="8" fill="#FFF3B0" opacity="0.3">
                            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
                        </ellipse>
                    </svg>
                </div>

                {/* Action Buttons */}
                <div className="home__actions">
                    <Link to="/play" tabIndex={-1}>
                        <Button variant="primary" size="large" icon="🎮" ariaLabel="Start Playing">
                            {hasProgress ? 'Continue Playing' : 'Start Playing'}
                        </Button>
                    </Link>
                    <Link to="/learn" tabIndex={-1}>
                        <Button variant="secondary" size="large" icon="📚" ariaLabel="Learn First">
                            Learn First
                        </Button>
                    </Link>
                    <Link to="/parent" tabIndex={-1}>
                        <Button variant="ghost" size="medium" icon="👪" ariaLabel="Parent Mode">
                            Parent Mode
                        </Button>
                    </Link>
                </div>

                {/* Encouraging footer */}
                <p className="home__footer-message" role="status">
                    {hasProgress
                        ? "Every step forward is an adventure! Come back anytime! ✨"
                        : "Every great explorer starts with a single step! ✨"
                    }
                </p>
            </div>
        </div>
    );
}
