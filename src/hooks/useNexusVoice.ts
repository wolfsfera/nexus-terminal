import { useCallback, useEffect, useState } from 'react';

export const useNexusVoice = () => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            setVoices(available);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const speak = useCallback((text: string, priority = false) => {
        if (!window.speechSynthesis) return;

        if (priority) {
            window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Select a futuristic voice (prefer Google US English or similar robotic ones)
        const selectedVoice = voices.find(v =>
            v.name.includes("Google US English") ||
            v.name.includes("Samantha") || // Mac default, good quality
            v.lang === 'en-US'
        );

        if (selectedVoice) utterance.voice = selectedVoice;

        // Robotic Tuning
        utterance.pitch = 0.8; // Lower pitch
        utterance.rate = 1.1;  // Slightly faster
        utterance.volume = 0.8;

        window.speechSynthesis.speak(utterance);
    }, [voices]);

    return { speak };
};
