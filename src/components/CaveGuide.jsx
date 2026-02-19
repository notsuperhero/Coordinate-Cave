import React, { useState, useEffect } from 'react';
import './CaveGuide.css';

const guideMessages = {
    welcome: [
        "Hi there, explorer! I'm Luna the bat! 🦇",
        "Welcome to the Coordinate Cave! ✨",
        "Let's discover coordinates together! 🗺️",
    ],
    correct: [
        "Great job! You found it! ⭐",
        "You are doing amazing! 🌟",
        "Wonderful! Keep exploring! 💎",
        "Incredible work! ✨",
        "You're a superstar! 🏆",
    ],
    hint: [
        "Let's try again together! 💙",
        "You're learning so well! Keep going! 🦇",
        "Almost there! You can do it! 🌈",
    ],
    learn: [
        "X goes across like a road! ➡️",
        "Y goes up like a rocket! ⬆️",
        "Together they make a point on the grid! 📍",
    ],
    encourage: [
        "Take your time, there's no rush! 💙",
        "You're doing so well! 🌟",
        "Every explorer learns at their own pace! 🦇",
    ],
};

/**
 * CaveGuide — Friendly animated bat character that provides encouragement.
 * @param {string} mood — 'welcome' | 'correct' | 'hint' | 'learn' | 'encourage'
 * @param {string} customMessage — Optional override message
 */
export default function CaveGuide({ mood = 'welcome', customMessage = '' }) {
    const [currentMessage, setCurrentMessage] = useState('');

    useEffect(() => {
        if (customMessage) {
            setCurrentMessage(customMessage);
        } else {
            const messages = guideMessages[mood] || guideMessages.welcome;
            const randMsg = messages[Math.floor(Math.random() * messages.length)];
            setCurrentMessage(randMsg);
        }
    }, [mood, customMessage]);

    return (
        <div className="cave-guide" role="status" aria-live="polite">
            <div className="cave-guide__character" aria-hidden="true">
                <svg viewBox="0 0 120 100" className="cave-guide__bat">
                    {/* Bat body */}
                    <ellipse cx="60" cy="55" rx="18" ry="20" fill="#6B5B7B" />
                    {/* Left wing */}
                    <path d="M42,50 Q20,30 10,45 Q20,50 30,48 Q25,55 15,60 Q30,58 42,55" fill="#7B6B8B" opacity="0.9">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="-2 42 50;2 42 50;-2 42 50"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                    </path>
                    {/* Right wing */}
                    <path d="M78,50 Q100,30 110,45 Q100,50 90,48 Q95,55 105,60 Q90,58 78,55" fill="#7B6B8B" opacity="0.9">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="2 78 50;-2 78 50;2 78 50"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                    </path>
                    {/* Eyes */}
                    <circle cx="52" cy="48" r="5" fill="white" />
                    <circle cx="68" cy="48" r="5" fill="white" />
                    <circle cx="53" cy="48" r="3" fill="#2F3E46" />
                    <circle cx="69" cy="48" r="3" fill="#2F3E46" />
                    {/* Eye sparkle */}
                    <circle cx="54" cy="47" r="1" fill="white" opacity="0.8" />
                    <circle cx="70" cy="47" r="1" fill="white" opacity="0.8" />
                    {/* Smile */}
                    <path d="M54,58 Q60,64 66,58" fill="none" stroke="#2F3E46" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Ears */}
                    <path d="M48,38 L44,25 L52,35" fill="#6B5B7B" />
                    <path d="M72,38 L76,25 L68,35" fill="#6B5B7B" />
                    {/* Inner ears */}
                    <path d="M48,36 L46,28 L51,34" fill="#EAD7FF" />
                    <path d="M72,36 L74,28 L69,34" fill="#EAD7FF" />
                </svg>
            </div>
            <div className="cave-guide__speech">
                <p className="cave-guide__message">{currentMessage}</p>
            </div>
        </div>
    );
}

export { guideMessages };
