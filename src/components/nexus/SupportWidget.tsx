"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mail, Headphones, X } from 'lucide-react';

export default function SupportWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-black/90 backdrop-blur-xl border border-gold-primary/30 p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col gap-3 min-w-[200px]"
                    >
                        <div className="text-gold-primary text-xs font-bold font-mono border-b border-white/10 pb-2 mb-1">
                            DIRECT UPLINK
                        </div>

                        <a
                            href="https://wa.me/34667400799"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-sm text-gray-300 hover:text-green-400 hover:bg-white/5 p-2 rounded-lg transition-all group"
                        >
                            <div className="p-2 bg-green-500/10 rounded-full group-hover:bg-green-500/20 text-green-500">
                                <MessageCircle size={18} />
                            </div>
                            <span>WhatsApp</span>
                        </a>

                        <a
                            href="mailto:adnwolf@wolfsfera.com"
                            className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 hover:bg-white/5 p-2 rounded-lg transition-all group"
                        >
                            <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 text-blue-500">
                                <Mail size={18} />
                            </div>
                            <span>Email Support</span>
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center
                    ${isOpen
                        ? 'bg-red-500/20 border-red-500 text-red-500 rotate-90'
                        : 'bg-gold-primary/20 border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-black animate-pulse-slow'
                    }
                    border backdrop-blur-md
                `}
            >
                {isOpen ? <X size={24} /> : <Headphones size={24} />}
            </button>

        </div>
    );
}
