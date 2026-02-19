import { useRef, useCallback, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

/**
 * Custom hook for managing gentle sound effects via useRef.
 */
export default function useSound() {
    const { settings } = useSettings();
    const correctSoundRef = useRef(null);
    const wrongSoundRef = useRef(null);
    const clickSoundRef = useRef(null);

    useEffect(() => {
        // Create AudioContext-based simple sounds
        // Using short oscillator tones for a gentle feel
        return () => {
            // Cleanup if needed
        };
    }, []);

    const playTone = useCallback((frequency, duration = 200, type = 'sine') => {
        if (!settings.soundEnabled) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

            // Gentle volume
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration / 1000);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + duration / 1000);
        } catch {
            // Silently fail if audio is not supported
        }
    }, [settings.soundEnabled]);

    const playCorrect = useCallback(() => {
        playTone(523, 150); // C5
        setTimeout(() => playTone(659, 150), 150); // E5
        setTimeout(() => playTone(784, 200), 300); // G5
    }, [playTone]);

    const playWrong = useCallback(() => {
        playTone(330, 300, 'triangle'); // Gentle low tone
    }, [playTone]);

    const playClick = useCallback(() => {
        playTone(440, 80); // Short A4
    }, [playTone]);

    return { playCorrect, playWrong, playClick };
}
