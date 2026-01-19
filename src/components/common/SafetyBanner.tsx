"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SafetyBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-yellow-500/10 border-b border-yellow-500/20 backdrop-blur-md relative z-50"
            >
                <div className="container mx-auto px-4 py-3 flex items-start sl:items-center justify-between gap-4">

                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500/20 p-2 rounded-lg shrink-0 animate-pulse">
                            <AlertTriangle size={18} className="text-yellow-500" />
                        </div>
                        <div className="text-sm font-mono text-gray-300">
                            <span className="font-bold text-yellow-500">NEW DOMAIN NOTICE:</span>
                            {" "}If your wallet shows a <span className="text-red-400 font-bold">"Malicious Site"</span> warning, it is a
                            <span className="text-white font-bold decoration-yellow-500 underline decoration-dashed ml-1">Temporary False Positive</span>.
                            We are currently verifying our domain with Phantom/Blowfish.
                            <span className="block sl:inline mt-1 sl:mt-0 sl:ml-2 text-xs opacity-60">
                                <ShieldCheck size={12} className="inline mr-1" />
                                Audit & Verification in progress.
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
                    >
                        <X size={18} className="text-gray-500 hover:text-white" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
