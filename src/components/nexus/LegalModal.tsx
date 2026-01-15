"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Scale, FileWarning } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LegalModal({ isOpen, onClose }: LegalModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-2xl bg-black border border-red-500/30 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)] p-8 max-h-[80vh] overflow-y-auto custom-scrollbar"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-2xl font-black text-red-500 flex items-center gap-2 mb-1">
                                    <ShieldAlert /> PROTOCOL DISCLAIMER
                                </h2>
                                <p className="text-gray-400 text-xs font-mono uppercase">Read Carefully Before Operating Terminal</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-6 text-sm text-gray-300 font-mono leading-relaxed">

                            <section>
                                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                                    <Scale size={16} className="text-gold-primary" /> 1. NOT FINANCIAL ADVICE
                                </h3>
                                <p className="opacity-80">
                                    The information provided by the Nexus Intelligence Terminal is for <strong>informational and educational purposes only</strong>. usage of this tool does not constitute financial, investment, legal, or tax advice. You are solely responsible for your own investment decisions.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                                    <FileWarning size={16} className="text-gold-primary" /> 2. HIGH RISK WARNING
                                </h3>
                                <p className="opacity-80">
                                    Trading cryptocurrencies, specifically "Memecoins" on the Solana network, involves an <strong>extreme level of risk</strong>. These assets can be highly volatile and may lose all value ("Rug Pulls"). Never invest money you cannot afford to lose. The Protocol assumes no liability for any loss of funds.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                                    <ShieldAlert size={16} className="text-gold-primary" /> 3. NO GUARANTEES
                                </h3>
                                <p className="opacity-80">
                                    While our "Agents" (Analyst, Sentinel, Shadow) use advanced algorithms to analyze blockchain data, we cannot guarantee the accuracy, completeness, or timeliness of the data. External factors and smart contract exploits can occur at any time. <strong>Use this tool at your own risk.</strong>
                                </p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                                    <ShieldAlert size={16} className="text-gold-primary" /> 4. ABSOLUTE PRIVACY POLICY
                                </h3>
                                <p className="opacity-80">
                                    Wolfsfera Nexus is a decentralized, client-side tool. <strong>We DO NOT store or track your wallet data, transaction history, or personal information on any server.</strong> All data (such as credit balance) is stored locally on your device (LocalStorage). Your privacy is absolute.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                                    <ShieldAlert size={16} className="text-gold-primary" /> 5. FAIR USE & REFUNDS
                                </h3>
                                <p className="opacity-80">
                                    <strong>Credits are only deducted for successful analyses.</strong> If the scanner cannot find a token ("Ghost Token") or if an error occurs, the credit is automatically refunded to your balance. Purchase of Credit Packs with SOL is final and non-refundable on the blockchain.
                                </p>
                            </section>

                            <div className="bg-white/5 p-4 rounded border border-white/10 mt-8 text-xs text-center">
                                <p>BY USING THIS INTERFACE, YOU AGREE TO HOLD THE CREATORS AND DEVELOPERS HARMLESS FROM ANY CLAIMS OR DAMAGES.</p>
                            </div>

                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={onClose}
                                className="bg-red-500/20 border border-red-500 text-red-400 px-8 py-2 rounded hover:bg-red-500/30 transition-all font-bold tracking-widest text-xs"
                            >
                                I UNDERSTAND & ACCEPT RISKS
                            </button>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
