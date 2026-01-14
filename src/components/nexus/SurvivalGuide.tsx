import React from 'react';
import { Shield, Search, Zap, AlertTriangle, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SurvivalGuide() {
    const { language } = useLanguage();

    const content = {
        es: {
            title: "Guía de Supervivencia Solana",
            subtitle: "Domina la trinchera de las Memecoins con Inteligencia Artificial.",
            sections: [
                {
                    icon: Search,
                    title: "¿Cómo escanear tokens de Pump.fun?",
                    text: "Nexus Terminal conecta directamente con la blockchain de Solana para analizar contratos de Pump.fun en milisegundos. Simplemente pega el Contract Address (CA) y nuestra IA detectará si la curva de vinculación (bonding curve) está completa o si los desarrolladores siguen acumulando supply."
                },
                {
                    icon: AlertTriangle,
                    title: "Detector de Rug Pulls y HoneyPots",
                    text: "Evita estafas comunes. El escáner verifica si la liquidez está bloqueada (Liquidity Lock), si la autoridad de minado (Mint Authority) está revocada y si hay 'wallets fantasma' acumulando grandes porcentajes del token antes del dump."
                },
                {
                    icon: Zap,
                    title: "Auditoría de Tokens Solana en Tiempo Real",
                    text: "No confíes, verifica. Nexus analiza la antigüedad del token, el volumen real (filtrando wash-trading) y la distribución de holders. Usamos datos on-chain para darte un veredicto: SAFE, DEGEN o CRITICAL."
                },
                {
                    icon: Shield,
                    title: "La Paradoja del Firewall: ¿Por qué faltan datos?",
                    text: "A veces verás 'CONEXIÓN DE SEGURIDAD EN ESPERA'. No entres en pánico. En tokens recién nacidos (<5 min), las APIs de seguridad globales aún no han indexado el contrato. Es como buscar el DNI de un bebé nacido hace un segundo. Nexus te avisa con honestidad en lugar de inventar datos."
                },
                {
                    icon: Users,
                    title: "¿Por qué Nexus AI es diferente?",
                    text: "La mayoría de escáneres son checklists estáticos. Nexus usa 3 Agentes IA (Analyst, Sentinel, Shadow) que interpretan el contexto 'Degen'. Entendemos que una memecoin volátil no es lo mismo que un token de utilidad. Analizamos el momentum social y la estructura técnica para encontrar gemas donde otros ven caos."
                }
            ]
        },
        en: {
            title: "Solana Survival Guide",
            subtitle: "Master the Memecoin trenches with Artificial Intelligence.",
            sections: [
                {
                    icon: Search,
                    title: "How to Scan Pump.fun Tokens?",
                    text: "Nexus Terminal connects directly to the Solana blockchain to analyze Pump.fun contracts in milliseconds. Simply paste the Contract Address (CA) and our AI will detect if the bonding curve is complete or if developers are hoarding supply."
                },
                {
                    icon: AlertTriangle,
                    title: "Rug Pull & HoneyPot Detector",
                    text: "Avoid common scams. The scanner verifies if Liquidity is Locked, if Mint Authority is revoked, and checks for 'ghost wallets' sniping large percentages of the supply before the dump."
                },
                {
                    icon: Zap,
                    title: "Real-Time Solana Token Audit",
                    text: "Don't trust, verify. Nexus analyzes token age, real volume (filtering wash-trading), and holder distribution. We use on-chain data to give you a verdict: SAFE, DEGEN, or CRITICAL."
                },
                {
                    icon: Shield,
                    title: "The Firewall Paradox: Missing Data?",
                    text: "Sometimes you'll see 'SECURITY CONNECTION STANDBY'. Don't panic. For newborn tokens (<5 min), global security APIs haven't indexed the contract yet. It's like looking for a newborn's ID card. Nexus warns you honestly instead of fabricating data."
                },
                {
                    icon: Users,
                    title: "Why Nexus AI is Different?",
                    text: "Most scanners are static checklists. Nexus uses 3 AI Agents (Analyst, Sentinel, Shadow) to interpret 'Degen' context. We understand a volatile memecoin isn't a utility token. We analyze social momentum and technical structure to find gems where others see chaos."
                }
            ]
        }
    };

    const t = content[language];

    return (
        <section className="w-full max-w-6xl mx-auto py-20 px-4 mt-20 border-t border-white/10 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-gold-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-1000 blur-3xl rounded-full pointer-events-none"></div>

            <div className="text-center mb-16 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gold-primary mb-4">
                    {t.title}
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    {t.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {t.sections.map((section, index) => (
                    <div
                        key={index}
                        className="group p-8 rounded-2xl bg-black/40 border border-white/10 hover:border-gold-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                    >
                        <div className="w-12 h-12 rounded-lg bg-gold-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-gold-primary">
                            <section.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gold-primary transition-colors">
                            {section.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {section.text}
                        </p>
                    </div>
                ))}
            </div>

            {/* SEO Keywords Hidden in plain sight for bots */}
            <div className="sr-only">
                Solana Token Scanner, Pump.fun Checker, Detectar Estafas Cripto, Solana Rug Checker, Check Contract Address Solana, Raydium Audit, Jupiter Token Safety.
            </div>
        </section>
    );
}
