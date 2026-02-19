import React, { useState, useCallback, useRef } from 'react';
import Grid from '../components/Grid';
import CaveGuide from '../components/CaveGuide';
import LevelTracker from '../components/LevelTracker';
import ProgressBar from '../components/ProgressBar';
import CalmModeOverlay from '../components/CalmModeOverlay';
import Button from '../components/Button';
import useGameLogic from '../hooks/useGameLogic';
import useSound from '../hooks/useSound';
import useKeyboardControls from '../hooks/useKeyboardControls';
import { useGame, getCurrentTag } from '../context/GameContext';
import { useSettings } from '../context/SettingsContext';
import './Play.css';

export default function Play() {
    const { settings } = useSettings();
    const { gameState, dispatch } = useGame();
    const {
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
    } = useGameLogic(settings.gridSize);
    const { playCorrect, playWrong, playClick } = useSound();

    const [highlightCell, setHighlightCell] = useState(null);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [inputMode, setInputMode] = useState(false);
    const [coordInput, setCoordInput] = useState('');
    const [inputFeedback, setInputFeedback] = useState('');
    const lastClickTime = useRef(0);

    // ===== Keyboard Controls =====
    useKeyboardControls({
        onEscape: useCallback(() => {
            if (!gameState.isCalmMode) {
                dispatch({ type: 'ENTER_CALM_MODE' });
            }
        }, [gameState.isCalmMode, dispatch]),

        onReset: useCallback(() => {
            if (!gameState.isCalmMode) {
                dispatch({ type: 'RESET_GAME' });
                resetLevel();
                setHighlightCell(null);
                setShowHint(false);
                setInputFeedback('');
            }
        }, [gameState.isCalmMode, dispatch, resetLevel]),

        onHint: useCallback(() => {
            if (!gameState.isCalmMode && target) {
                setShowHint(true);
                setTimeout(() => setShowHint(false), 3000);
            }
        }, [gameState.isCalmMode, target]),

        enabled: !gameState.isCalmMode || true, // always listen for Escape
    });

    // ===== Grid Cell Click =====
    const handleCellClick = useCallback((x, y) => {
        if (gameState.isPaused) return;

        // Double-click guard
        const now = Date.now();
        if (now - lastClickTime.current < 300) return;
        lastClickTime.current = now;

        playClick();

        const result = checkAnswer(x, y);
        if (result === true) {
            setHighlightCell({ x, y });
            playCorrect();
            dispatch({ type: 'CORRECT_ANSWER' });
            setShowHint(false);
        } else if (result === false) {
            playWrong();
            dispatch({ type: 'WRONG_ANSWER' });
        }
    }, [checkAnswer, playClick, playCorrect, playWrong, gameState.isPaused, dispatch]);

    // ===== Coordinate Input Mode =====
    const handleCoordInputChange = useCallback((e) => {
        const value = e.target.value;
        setCoordInput(value);

        // Real-time validation
        const match = value.match(/^\s*\(?\s*(\d+)\s*,\s*(\d+)\s*\)?\s*$/);
        if (match) {
            const x = parseInt(match[1], 10);
            const y = parseInt(match[2], 10);
            if (x >= 0 && x < settings.gridSize && y >= 0 && y < settings.gridSize) {
                setInputFeedback('✨ Great choice! Press Enter to check.');
            } else {
                setInputFeedback(`💙 Try numbers between 0 and ${settings.gridSize - 1}`);
            }
        } else if (value.length > 0) {
            setInputFeedback('💙 Type like: 2,3 or (2,3)');
        } else {
            setInputFeedback('');
        }
    }, [settings.gridSize]);

    const handleCoordInputSubmit = useCallback((e) => {
        e.preventDefault();
        const match = coordInput.match(/^\s*\(?\s*(\d+)\s*,\s*(\d+)\s*\)?\s*$/);
        if (match) {
            const x = parseInt(match[1], 10);
            const y = parseInt(match[2], 10);
            handleCellClick(x, y);
            setCoordInput('');
            setInputFeedback('');
        } else {
            setInputFeedback("💙 Let's try the format: 2,3");
        }
    }, [coordInput, handleCellClick]);

    // ===== Level Up =====
    const handleNextQuestion = useCallback(() => {
        setHighlightCell(null);
        nextQuestion();
    }, [nextQuestion]);

    const handleLevelUp = useCallback(() => {
        dispatch({ type: 'NEXT_LEVEL' });
        setShowLevelUp(true);
        resetLevel();
        setHighlightCell(null);
        setTimeout(() => setShowLevelUp(false), 2000);
    }, [dispatch, resetLevel]);

    const handleReset = useCallback(() => {
        dispatch({ type: 'RESET_GAME' });
        resetLevel();
        setHighlightCell(null);
        setShowHint(false);
    }, [dispatch, resetLevel]);

    const accuracy = gameState.totalAnswers > 0
        ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100)
        : 0;

    return (
        <div className="play">
            <CalmModeOverlay />

            <div className="play__header">
                <h1 className="play__title">🎮 Play Mode</h1>
                <LevelTracker level={gameState.level} stars={gameState.stars} badges={gameState.badges} />
            </div>

            <div className="play__content">
                <div className="play__sidebar">
                    <CaveGuide
                        mood={isCorrect === true ? 'correct' : isCorrect === false ? 'hint' : 'encourage'}
                        customMessage={message}
                    />

                    {/* Task display */}
                    {target && (
                        <div className="play__task" role="status" aria-live="polite">
                            <span className="play__task-label">🎯 Find:</span>
                            <span className="play__task-coord">({target.x}, {target.y})</span>
                        </div>
                    )}

                    {/* Hint display */}
                    {showHint && target && (
                        <div className="play__hint" role="status" aria-live="polite">
                            <p>💡 <strong>Hint:</strong> Count across to <strong>{target.x}</strong>, then up to <strong>{target.y}</strong></p>
                        </div>
                    )}

                    {/* Score and streak */}
                    <div className="play__stats">
                        <div className="play__stat">
                            <span className="play__stat-label">Score</span>
                            <span className="play__stat-value">{gameState.score}</span>
                        </div>
                        <div className="play__stat">
                            <span className="play__stat-label">Streak</span>
                            <span className="play__stat-value">{streak} 🔥</span>
                        </div>
                        <div className="play__stat">
                            <span className="play__stat-label">Accuracy</span>
                            <span className="play__stat-value">{accuracy}%</span>
                        </div>
                    </div>

                    <ProgressBar
                        current={questionsInLevel}
                        total={questionsPerLevel}
                        label="Level Progress"
                    />

                    {/* Coordinate input mode toggle */}
                    <div className="play__input-toggle">
                        <Button
                            variant="ghost"
                            size="small"
                            onClick={() => setInputMode(prev => !prev)}
                            ariaLabel={inputMode ? 'Switch to grid clicking' : 'Switch to typing coordinates'}
                        >
                            {inputMode ? '🖱️ Click Mode' : '⌨️ Type Mode'}
                        </Button>
                    </div>

                    {/* Coordinate text input */}
                    {inputMode && (
                        <form className="play__coord-input" onSubmit={handleCoordInputSubmit}>
                            <label htmlFor="coord-input" className="play__coord-input-label">
                                Type the coordinate:
                            </label>
                            <input
                                id="coord-input"
                                type="text"
                                className="play__coord-input-field"
                                value={coordInput}
                                onChange={handleCoordInputChange}
                                placeholder="e.g. 2,4"
                                aria-label="Enter coordinate like 2,4"
                                autoComplete="off"
                            />
                            {inputFeedback && (
                                <p className="play__coord-feedback" role="status" aria-live="polite">
                                    {inputFeedback}
                                </p>
                            )}
                            <Button variant="mint" size="small" type="submit" ariaLabel="Submit coordinate">
                                Check ✓
                            </Button>
                        </form>
                    )}

                    {/* Action buttons */}
                    <div className="play__actions">
                        {isCorrect === true && !isLevelComplete && (
                            <Button variant="mint" size="medium" onClick={handleNextQuestion} ariaLabel="Next coordinate">
                                Next ➡️
                            </Button>
                        )}
                        {isLevelComplete && (
                            <Button variant="primary" size="large" onClick={handleLevelUp} ariaLabel="Level up">
                                🌟 Level Up!
                            </Button>
                        )}
                        <Button variant="ghost" size="small" onClick={handleReset} ariaLabel="Reset game (also press R)">
                            🔄 Reset
                        </Button>
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => dispatch({ type: 'ENTER_CALM_MODE' })}
                            ariaLabel="Take a break (also press Escape)"
                        >
                            💙 Take a Break
                        </Button>
                    </div>

                    {/* Keyboard shortcuts hint */}
                    <div className="play__shortcuts" aria-hidden="true">
                        <span><kbd>Esc</kbd> Calm Mode</span>
                        <span><kbd>R</kbd> Reset</span>
                        <span><kbd>H</kbd> Hint</span>
                        <span><kbd>↑←↓→</kbd> Navigate</span>
                    </div>
                </div>

                <div className="play__grid-area">
                    <Grid
                        size={settings.gridSize}
                        onCellClick={handleCellClick}
                        target={target}
                        highlightCell={highlightCell}
                        mode="play"
                        showLabels={true}
                        disabled={gameState.isPaused}
                    />
                </div>
            </div>

            {/* Level up celebration with motivational tag */}
            {showLevelUp && (
                <div className="play__level-up" role="alert" aria-live="assertive">
                    <div className="play__level-up-card">
                        <span className="play__level-up-icon">🌟</span>
                        <h2>Level Up!</h2>
                        <p>You're now on Level {gameState.level}!</p>
                        <div className="play__level-up-tag">
                            <span className="play__level-up-tag-icon">{getCurrentTag(gameState.stars).icon}</span>
                            <span className="play__level-up-tag-title">{getCurrentTag(gameState.stars).title}</span>
                        </div>
                        <p className="play__level-up-encourage">
                            Amazing work! Keep exploring at your own pace! 💙
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
