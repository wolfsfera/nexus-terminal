"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Cpu, Vote, BookOpen, Zap } from 'lucide-react';

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

                                        {/* Section 4: Operative Security */}
                                        <div className="space-y-4 pt-6 text-left">
                                            <div className="flex items-center gap-3 text-red-500 border-b border-white/10 pb-3">
                                                <BookOpen size={20} />
                                                <h3 className="text-xl font-bold">4. Protocolo de Seguridad del Operador</h3>
                                            </div>
                                            <ul className="text-sm text-gray-400 space-y-2 list-disc pl-5">
                                                <li><strong className="text-white">Burner Wallets:</strong> Usa siempre una billetera secundaria para operar tokens de riesgo alto.</li>
                                                <li><strong className="text-white">Verificar CA:</strong> Asegúrate de que el Contract Address coincide con el oficial. Los estafadores crean clones.</li>
                                                <li><strong className="text-white">Take Profit:</strong> Si ves una subida parabólica, retira tu inversión inicial. No seas avaricioso.</li>
                                            </ul>
                                        </div>

                                        {/* Section 5: Troubleshooting & Tips */}
                                        <div className="space-y-4 pt-6 text-left border-t border-white/10 mt-6">
                                            <div className="flex items-center gap-3 text-blue-400 border-b border-white/10 pb-3">
                                                <Cpu size={20} />
                                                <h3 className="text-xl font-bold">5. Solución de Problemas (Troubleshooting)</h3>
                                            </div>

                                            <div className="bg-blue-900/10 border border-blue-500/30 p-4 rounded-xl space-y-4">
                                                {/* Tip 1: Pump.fun CA */}
                                                <div>
                                                    <h4 className="text-blue-300 font-bold text-sm mb-1 flex items-center gap-2">
                                                        💊 TRUCO PUMP.FUN
                                                    </h4>
                                                    <p className="text-xs text-gray-400 leading-relaxed">
                                                        ¿Buscas un token nuevo de Pump.fun y no sale?
                                                        <br />
                                                        <span className="text-white font-bold">SOLUCIÓN:</span> No busques por nombre (ej: "PEPE").
                                                        Copia la <span className="text-gold-primary">CONTRACT ADDRESS (CA)</span> de Pump.fun y pégala aquí.
                                                        <br />
                                                        <em>Ejemplo: HeLp6...9xV</em>
                                                    </p>
                                                </div>

                                                {/* Tip 2: Error 403 */}
                                                <div className="border-t border-white/10 pt-3">
                                                    <h4 className="text-red-300 font-bold text-sm mb-1 flex items-center gap-2">
                                                        ⚠️ ERROR 403 / "ACCESS FORBIDDEN"
                                                    </h4>
                                                    <p className="text-xs text-gray-400 leading-relaxed">
                                                        Si ves este error al pagar, significa que <strong className="text-white">Solana Mainnet está saturada</strong>.
                                                        <br />
                                                        Inténtalo de nuevo en unos minutos o asegúrate de tener suficiente SOL para el gas (0.002 SOL extra).
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 6: Pricing Table */}
                                        <div className="space-y-4 pt-6 text-left">
                                            <div className="flex items-center gap-3 text-purple-400 border-b border-white/10 pb-3">
                                                <Zap size={20} />
                                                <h3 className="text-xl font-bold">6. Tarifas de Inteligencia</h3>
                                            </div>

                                            <div className="overflow-hidden rounded-xl border border-white/10">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-white/5 text-gray-400 font-mono uppercase text-xs">
                                                        <tr>
                                                            <th className="p-3">Plan</th>
                                                            <th className="p-3">Créditos</th>
                                                            <th className="p-3 text-right">Precio SOL</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/10 text-gray-300">
                                                        <tr className="hover:bg-white/5 transition-colors">
                                                            <td className="p-3 font-bold text-white">INVITADO</td>
                                                            <td className="p-3">3 (Gratis)</td>
                                                            <td className="p-3 text-right text-green-400">0.00 SOL</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5 transition-colors">
                                                            <td className="p-3 font-bold text-white">STARTER</td>
                                                            <td className="p-3">10</td>
                                                            <td className="p-3 text-right text-gold-primary">0.01 SOL</td>
                                                        </tr>
                                                        <tr className="bg-purple-900/20 hover:bg-purple-900/30 transition-colors">
                                                            <td className="p-3 font-bold text-purple-300 flex items-center gap-2">TRADER <span className="bg-purple-500 text-white text-[10px] px-1 rounded">POPULAR</span></td>
                                                            <td className="p-3 font-bold text-white">50</td>
                                                            <td className="p-3 text-right text-gold-primary font-bold">0.04 SOL</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5 transition-colors">
                                                            <td className="p-3 font-bold text-white">WHALE</td>
                                                            <td className="p-3">100</td>
                                                            <td className="p-3 text-right text-gold-primary">0.08 SOL</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p className="text-[10px] text-gray-500 text-center font-mono">
                                                * Los pagos van directos a la blockchain. No hay reembolsos.
                                            </p>
                                        </div>

                                        {/* Section 7: Human Support */}
                                        <div className="space-y-4 pt-6 text-left">
                                            <div className="flex items-center gap-3 text-green-400 border-b border-white/10 pb-3">
                                                <Zap size={20} />
                                                <h3 className="text-xl font-bold">7. Soporte Humano (Direct Uplink)</h3>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                                ¿Tienes problemas con un pago o has encontrado un error en la Matrix? Contacta directamente con el comando central.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <a
                                                    href="https://wa.me/34667400799"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-green-900/20 border border-green-500/50 hover:bg-green-500/20 text-green-400 p-4 rounded-xl flex items-center justify-center gap-3 transition-all group"
                                                >
                                                    {/* WhatsApp Icon SVG directly to avoid import issues if Lucide doesn't have it or for custom styling */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                                                    <span className="font-bold">WHATSAPP SUPPORT</span>
                                                </a>
                                                <a
                                                    href="mailto:adnwolf@wolfsfera.com"
                                                    className="flex-1 bg-blue-900/20 border border-blue-500/50 hover:bg-blue-500/20 text-blue-400 p-4 rounded-xl flex items-center justify-center gap-3 transition-all group"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                                    <span className="font-bold">EMAIL SUPPORT</span>
                                                </a>
                                            </div>
                                        </div>

                                        {/* Usage Example */}
                                        <div className="bg-gold-primary/10 border border-gold-primary/30 p-4 rounded-xl mt-8">
                                            <h4 className="text-gold-primary font-bold mb-2 text-sm">⚔️ EJEMPLO DE MISIÓN:</h4>
                                            <ol className="text-xs text-gray-300 space-y-2 font-mono list-decimal pl-4">
                                                <li>Encuentras un token en Twitter/Telegram ($PUMP).</li>
                                                <li>Copias su <strong>Contract Address</strong>.</li>
                                                <li>Lo pegas en la terminal NEXUS y activas el escáner.</li>
                                                <li>El enjambre detecta <strong>Riesgo: DEGEN (Amarillo)</strong>.</li>
                                                <li>Decides entrar con el 0.5 SOL de tu "Cartera de Riesgo".</li>
                                            </ol>
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
