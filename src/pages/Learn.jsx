import React, { useState, useCallback } from 'react';
import Grid from '../components/Grid';
import CaveGuide from '../components/CaveGuide';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import './Learn.css';

const lessons = [
    {
        id: 1,
        title: "What is a Grid?",
        description: "A grid is made of rows and columns — like a treasure map! Each square has a special address.",
        guideMessage: "Think of it like a treasure map! 🗺️",
        task: null,
    },
    {
        id: 2,
        title: "X Goes Across ➡️",
        description: "The X number tells us how far to go across (left to right). Start from 0 and count!",
        guideMessage: "X goes across like a road! ➡️",
        task: null,
    },
    {
        id: 3,
        title: "Y Goes Up ⬆️",
        description: "The Y number tells us how far to go up. Start from 0 at the bottom and count up!",
        guideMessage: "Y goes up like a rocket! ⬆️",
        task: null,
    },
    {
        id: 4,
        title: "Put Them Together!",
        description: "We write coordinates as (X, Y). First go across, then go up!\nTry clicking on (3, 2) on the grid!",
        guideMessage: "First across, then up! Try (3, 2)! 📍",
        task: { x: 3, y: 2 },
    },
    {
        id: 5,
        title: "You're Ready! 🌟",
        description: "Amazing! You know how coordinates work! Now try the game and find hidden treasures in the cave!",
        guideMessage: "You're a coordinate expert now! 🏆",
        task: null,
    },
];

export default function Learn() {
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightCell, setHighlightCell] = useState(null);
    const [taskComplete, setTaskComplete] = useState(false);

    const lesson = lessons[currentStep];

    const handleCellClick = useCallback((x, y) => {
        if (lesson.task && x === lesson.task.x && y === lesson.task.y) {
            setHighlightCell({ x, y });
            setTaskComplete(true);
        }
    }, [lesson]);

    const nextStep = () => {
        if (currentStep < lessons.length - 1) {
            setCurrentStep(prev => prev + 1);
            setHighlightCell(null);
            setTaskComplete(false);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setHighlightCell(null);
            setTaskComplete(false);
        }
    };

    return (
        <div className="learn">
            <div className="learn__header">
                <h1 className="learn__title">📚 Learn Coordinates</h1>
                <ProgressBar current={currentStep + 1} total={lessons.length} label="Lesson Progress" />
            </div>

            <div className="learn__content">
                <div className="learn__lesson-card">
                    <CaveGuide mood="learn" customMessage={lesson.guideMessage} />

                    <h2 className="learn__lesson-title">{lesson.title}</h2>
                    <p className="learn__lesson-desc">{lesson.description}</p>

                    {lesson.task && !taskComplete && (
                        <div className="learn__task" role="status">
                            <span className="learn__task-label">🎯 Your Task:</span> Click on ({lesson.task.x}, {lesson.task.y})
                        </div>
                    )}
                    {taskComplete && (
                        <div className="learn__success" role="status" aria-live="polite">
                            ⭐ Amazing! You found it! Great job, explorer!
                        </div>
                    )}
                </div>

                <div className="learn__grid-area">
                    <Grid
                        size={5}
                        onCellClick={handleCellClick}
                        target={lesson.task}
                        highlightCell={highlightCell}
                        mode="learn"
                        showLabels={true}
                        disabled={!lesson.task || taskComplete}
                    />

                    {/* Axis labels */}
                    <div className="learn__axis-legend" aria-hidden="true">
                        <span className="learn__axis-x">X goes across ➡️</span>
                        <span className="learn__axis-y">Y goes up ⬆️</span>
                    </div>
                </div>
            </div>

            <div className="learn__nav">
                <Button
                    variant="ghost"
                    size="medium"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    ariaLabel="Previous lesson"
                >
                    ← Back
                </Button>
                <span className="learn__step-indicator" aria-hidden="true">
                    {currentStep + 1} / {lessons.length}
                </span>
                <Button
                    variant="mint"
                    size="medium"
                    onClick={nextStep}
                    disabled={currentStep === lessons.length - 1 || (lesson.task && !taskComplete)}
                    ariaLabel="Next lesson"
                >
                    Next →
                </Button>
            </div>
        </div>
    );
}
