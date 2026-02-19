import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
    score: 0,
    level: 1,
    totalGames: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    stars: 0,
    badges: [],
    isPaused: false,
    isCalmMode: false,
    levelsCompleted: [],
};

/**
 * Motivational tags — earned based on stars, accuracy, and levels.
 * Designed to gently encourage without pressure.
 */
const MOTIVATIONAL_TAGS = [
    { id: 'newcomer', minStars: 0, icon: '🌱', title: 'Little Sprout', message: "You're just getting started! 🌱" },
    { id: 'explorer', minStars: 3, icon: '🦇', title: 'Cave Explorer', message: "You're exploring the cave! 🦇" },
    { id: 'learner', minStars: 8, icon: '📚', title: 'Pro Learner', message: "You're learning so fast! 📚" },
    { id: 'navigator', minStars: 15, icon: '🗺️', title: 'Grid Navigator', message: "You know your way around! 🗺️" },
    { id: 'star', minStars: 25, icon: '⭐', title: 'Star Collector', message: "Look at all your stars! ⭐" },
    { id: 'champ', minStars: 35, icon: '🥇', title: 'Coordinate Champ', message: "You're a true champion! 🥇" },
    { id: 'master', minStars: 50, icon: '🏆', title: 'Cave Master', message: "Master of the cave! 🏆" },
    { id: 'legend', minStars: 75, icon: '👑', title: 'Cave Legend', message: "A legendary explorer! 👑" },
    { id: 'mythical', minStars: 100, icon: '🌟', title: 'Mythical Explorer', message: "You're truly mythical! 🌟" },
];

/**
 * Get the current motivational tag based on star count.
 */
export function getCurrentTag(stars) {
    let current = MOTIVATIONAL_TAGS[0];
    for (const tag of MOTIVATIONAL_TAGS) {
        if (stars >= tag.minStars) {
            current = tag;
        }
    }
    return current;
}

/**
 * Get the next tag to unlock (for progress encouragement).
 */
export function getNextTag(stars) {
    for (const tag of MOTIVATIONAL_TAGS) {
        if (stars < tag.minStars) {
            return tag;
        }
    }
    return null; // All unlocked!
}

/**
 * Get all tags the player has unlocked so far.
 */
export function getUnlockedTags(stars) {
    return MOTIVATIONAL_TAGS.filter(tag => stars >= tag.minStars);
}

/**
 * Level-up trophies awarded at specific level milestones.
 */
function getBadgeForLevel(level) {
    const badges = {
        1: { id: 'first-steps', name: 'First Steps', icon: '🐾' },
        2: { id: 'explorer', name: 'Cave Explorer', icon: '🦇' },
        3: { id: 'navigator', name: 'Grid Navigator', icon: '🗺️' },
        5: { id: 'pro-learner', name: 'Pro Learner', icon: '📚' },
        7: { id: 'champ', name: 'Coordinate Champ', icon: '🥇' },
        10: { id: 'master', name: 'Cave Master', icon: '🏆' },
        15: { id: 'legend', name: 'Cave Legend', icon: '👑' },
    };
    return badges[level] || null;
}

function gameReducer(state, action) {
    switch (action.type) {
        case 'CORRECT_ANSWER':
            return {
                ...state,
                score: state.score + 10,
                correctAnswers: state.correctAnswers + 1,
                totalAnswers: state.totalAnswers + 1,
                stars: state.stars + 1,
            };
        case 'WRONG_ANSWER':
            return {
                ...state,
                totalAnswers: state.totalAnswers + 1,
            };
        case 'NEXT_LEVEL': {
            const newLevel = state.level + 1;
            const badge = getBadgeForLevel(state.level);
            return {
                ...state,
                level: newLevel,
                levelsCompleted: [...state.levelsCompleted, state.level],
                badges: badge ? [...state.badges, badge] : state.badges,
                totalGames: state.totalGames + 1,
            };
        }
        case 'FINISH_GAME':
            return {
                ...state,
                totalGames: state.totalGames + 1,
            };
        case 'TOGGLE_PAUSE':
            return { ...state, isPaused: !state.isPaused };
        case 'ENTER_CALM_MODE':
            return { ...state, isPaused: true, isCalmMode: true };
        case 'EXIT_CALM_MODE':
            return { ...state, isPaused: false, isCalmMode: false };
        case 'RESET_GAME':
            return {
                ...initialState,
                totalGames: state.totalGames,
                badges: state.badges,
                stars: state.stars,
                correctAnswers: state.correctAnswers,
                totalAnswers: state.totalAnswers,
                levelsCompleted: state.levelsCompleted,
            };
        case 'LOAD_PROGRESS':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    // Load progress from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('cc-progress');
            if (saved) {
                dispatch({ type: 'LOAD_PROGRESS', payload: JSON.parse(saved) });
            }
        } catch { /* ignore */ }
    }, []);

    // Save progress when key values change
    useEffect(() => {
        const toSave = {
            totalGames: state.totalGames,
            correctAnswers: state.correctAnswers,
            totalAnswers: state.totalAnswers,
            stars: state.stars,
            badges: state.badges,
            levelsCompleted: state.levelsCompleted,
        };
        localStorage.setItem('cc-progress', JSON.stringify(toSave));
    }, [state.totalGames, state.correctAnswers, state.totalAnswers, state.stars, state.badges, state.levelsCompleted]);

    return (
        <GameContext.Provider value={{ gameState: state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within GameProvider');
    return context;
}

export default GameContext;
