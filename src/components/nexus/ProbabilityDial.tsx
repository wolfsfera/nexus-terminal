"use client";

import { motion } from 'framer-motion';

interface ProbabilityDialProps {
    value: number; // 0 to 100
    loading: boolean;
}

export default function ProbabilityDial({ value, loading }: ProbabilityDialProps) {
    // Map 0-100 to rotation degrees (-90 to 90)
    const rotation = (value / 100) * 180 - 90;

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[2/1] overflow-hidden">
            {/* Gauge Background */}
            <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#333"
                    strokeWidth="20"
                    strokeLinecap="round"
                />
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={loading ? 251.2 : 251.2 - (251.2 * (value / 100))}
                    className="transition-all duration-1000 ease-out"
                />

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" /> {/* Red */}
                        <stop offset="50%" stopColor="#eab308" /> {/* Yellow */}
                        <stop offset="100%" stopColor="#22c55e" /> {/* Green */}
                    </linearGradient>
                </defs>
            </svg>

            {/* Needle */}
            <motion.div
                className="absolute bottom-0 left-1/2 w-1 h-[85%] bg-white origin-bottom rounded-full z-10"
                style={{ x: '-50%' }}
                animate={{ rotate: loading ? [-90, 90, -90] : rotation }}
                transition={loading ? { duration: 2, repeat: Infinity, ease: "linear" } : { type: "spring", stiffness: 50 }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white]"></div>
            </motion.div>

            {/* Center Pivot */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-800 border-4 border-gray-600 rounded-full z-20"></div>

            {/* Value Text */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-16 text-center">
                <h2 className="text-4xl font-bold text-white">{loading ? '---' : `${value}%`}</h2>
                <p className="text-gray-400 text-sm uppercase tracking-widest">Confianza</p>
            </div>
        </div>
    );
}
