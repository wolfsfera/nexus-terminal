"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Cpu, Vote, BookOpen } from 'lucide-react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-zinc-950 border border-gold-primary/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.1)] relative">

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-8 md:p-12">
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter">PROTOCOLO <span className="text-gold-primary">WOLFSFERA NEXUS</span></h2>
                                    <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Manual de Operaciones & Inteligencia Descentralizada</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                                    {/* Section 1: The Swarm */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-gold-primary border-b border-white/10 pb-3">
                                            <Cpu size={20} />
                                            <h3 className="text-xl font-bold">1. El Enjambre (The Swarm)</h3>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Nexus no es un solo bot, es una red de **tres agentes de IA especializados** que analizan cada proyecto desde ángulos opuestos. No confían entre ellos; compiten por encontrar fallos.
                                        </p>

                                        <ul className="space-y-4">
                                            <li className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-gold-primary/30 transition-colors">
                                                <strong className="block text-white mb-1">🔍 The Analyst (Oracle)</strong>
                                                <p className="text-xs text-gray-500">Lee el código fuente (Solidity). Busca "backdoors", funciones de "mint" ocultas y vulnerabilidades matemáticas que un humano pasaría por alto.</p>
                                            </li>
                                            <li className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-gold-primary/30 transition-colors">
                                                <strong className="block text-white mb-1">🛡️ The Sentinel (Risk)</strong>
                                                <p className="text-xs text-gray-500">Analiza el comportamiento social y financiero. Detecta manipulación de precios, liquidez falsa y patrones de "rug pull" antes de que ocurran.</p>
                                            </li>
                                            <li className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-gold-primary/30 transition-colors">
                                                <strong className="block text-white mb-1">👻 The Shadow (On-Chain)</strong>
                                                <p className="text-xs text-gray-500">Rastrea las carteras de los desarrolladores. Sabe si vendieron en secreto o si hay transferencias sospechosas a "mixers".</p>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Section 2: The 5 Intelligence Tiers */}
                                    <div className="space-y-8">

                                        {/* Tiers */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-gold-primary border-b border-white/10 pb-3">
                                                <Vote size={20} />
                                                <h3 className="text-xl font-bold">2. Niveles de Inteligencia</h3>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                El sistema ya no es binario. Clasificamos cada activo en 5 niveles de riesgo precisos:
                                            </p>
                                            <ul className="space-y-3 mt-4">
                                                <li className="flex items-center gap-3 text-sm">
                                                    <span className="text-purple-400">💎 ELITE</span>
                                                    <span className="text-gray-500">- La "Alpha" perfecta. Liquidez bloqueada, auditada, sin riesgo.</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-sm">
                                                    <span className="text-green-500">🛡️ SAFE</span>
                                                    <span className="text-gray-500">- Consenso positivo. Zona de entrada estándar.</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-sm">
                                                    <span className="text-yellow-500">⚠️ DEGEN</span>
                                                    <span className="text-gray-500">- Alto riesgo / High Reward. Solo para expertos en volatilidad.</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-sm">
                                                    <span className="text-orange-500">☣️ DANGER</span>
                                                    <span className="text-gray-500">- Banderas rojas graves (Mint Authority, Holders concentrados).</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-sm">
                                                    <span className="text-red-500">☠️ CRITICAL</span>
                                                    <span className="text-gray-500">- ESTAFA CONFIRMADA. Honeypot o Rug Pull inminente.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Real Security Firewall */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-gold-primary border-b border-white/10 pb-3">
                                                <ShieldCheck size={20} />
                                                <h3 className="text-xl font-bold">3. Firewall de Seguridad Real</h3>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                Nexus se conecta en tiempo real a la blockchain (vía GoPlus API) para una auditoría de grado militar:
                                            </p>
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-gray-400 space-y-2">
                                                <p>1. <span className="text-white">HONEYPOT CHECK:</span> ¿Se puede vender el token?</p>
                                                <p>2. <span className="text-white">MINT AUTHORITY:</span> ¿Puede el dev imprimir más dinero?</p>
                                                <p>3. <span className="text-white">WHALE SCAN:</span> Concentración real de holders.</p>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <div className="mt-12 text-center">
                                    <button
                                        onClick={onClose}
                                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gold-primary transition-colors text-sm tracking-wide"
                                    >
                                        ENTENDIDO, CERRAR MANUAL
                                    </button>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
