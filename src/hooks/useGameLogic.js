import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for game logic — generates random coordinates,
 * validates answers, manages level progression,
 * and AUTO-ADVANCES to the next coordinate after a correct answer.
 */
export default function useGameLogic(gridSize = 6) {
    const [target, setTarget] = useState(null);
    const [message, setMessage] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [streak, setStreak] = useState(0);
    const [questionsInLevel, setQuestionsInLevel] = useState(0);
    const autoAdvanceTimer = useRef(null);

    const questionsPerLevel = 5;

    const generateTarget = useCallback(() => {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        setTarget({ x, y });
        setIsCorrect(null);
        setMessage('');
    }, [gridSize]);

    // Generate first target on mount or grid size change
    useEffect(() => {
        generateTarget();
        setStreak(0);
        setQuestionsInLevel(0);
    }, [generateTarget]);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        };
    }, []);

    const encouragingMessages = [
        "Great job! You found it! ⭐",
        "You are doing amazing! 🌟",
        "Wonderful! Keep exploring! 🦇",
        "Incredible work, explorer! 💎",
        "You're a coordinate superstar! ✨",
        "Pro Learner! You nailed it! 🏆",
        "Champ move! That was perfect! 🥇",
    ];

    const hintMessages = [
        "Almost there! Let's try again together! 💙",
        "That's okay! Look at the numbers on the sides! 🔍",
        "No worries! Try counting across, then up! 🗺️",
        "You're learning! Give it another try! 🌈",
        "So close! You've got this, explorer! 🌟",
    ];

    const checkAnswer = useCallback((clickedX, clickedY) => {
        if (!target) return null;
        // Don't allow answering while showing a correct result
        if (isCorrect === true) return null;

        if (clickedX === target.x && clickedY === target.y) {
            const msg = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
            setMessage(msg);
            setIsCorrect(true);
            setStreak(prev => prev + 1);
            setQuestionsInLevel(prev => {
                const next = prev + 1;
                // Auto-advance to the next question after 1.5s
                // UNLESS this would complete the level
                if (next < questionsPerLevel) {
                    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
                    autoAdvanceTimer.current = setTimeout(() => {
                        generateTarget();
                        autoAdvanceTimer.current = null;
                    }, 1500);
                }
                return next;
            });
            return true;
        } else {
            const hint = hintMessages[Math.floor(Math.random() * hintMessages.length)];
            setMessage(hint);
            setIsCorrect(false);
            setStreak(0);
            return false;
        }
    }, [target, isCorrect, gridSize, generateTarget]);

    const isLevelComplete = questionsInLevel >= questionsPerLevel;

    const nextQuestion = useCallback(() => {
        if (autoAdvanceTimer.current) {
            clearTimeout(autoAdvanceTimer.current);
            autoAdvanceTimer.current = null;
        }
        generateTarget();
    }, [generateTarget]);

    const resetLevel = useCallback(() => {
        if (autoAdvanceTimer.current) {
            clearTimeout(autoAdvanceTimer.current);
            autoAdvanceTimer.current = null;
        }
        setQuestionsInLevel(0);
        setStreak(0);
        generateTarget();
    }, [generateTarget]);

    return {
        target,
        message,
        isCorrect,
        streak,
        questionsInLevel,
        questionsPerLevel,
        isLevelComplete,
        checkAnswer,
        nextQuestion,
        resetLevel,
        generateTarget,
    };
}
