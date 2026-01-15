import { useCallback } from 'react';

export const useSoundFX = () => {

    // Helper to create oscillator sounds
    const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol = 0.1) => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext(); // Ideally should reuse context, but safe for sparse SFX
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }, []);

    const playHover = () => playTone(800, 'sine', 0.05, 0.02);
    const playClick = () => playTone(1200, 'square', 0.05, 0.05);
    const playScan = () => {
        // RADICAL CHANGE: Ultra-clean high-tech blip (No reverb/low freq)
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // Crisper than sine, cleaner than saw
        osc.frequency.setValueAtTime(1500, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.03, ctx.currentTime); // Lower volume (high pitch cuts through)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    };

    const playAlert = () => {
        playTone(200, 'sawtooth', 0.4, 0.2);
        setTimeout(() => playTone(200, 'sawtooth', 0.4, 0.2), 200);
    };

    const playSuccess = () => {
        playTone(600, 'sine', 0.1, 0.1);
        setTimeout(() => playTone(1200, 'sine', 0.4, 0.1), 100);
    };

    return { playHover, playClick, playScan, playAlert, playSuccess };
};
