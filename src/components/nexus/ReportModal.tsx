import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldAlert, ShieldCheck, Shield, Activity, DollarSign, Clock, Lock, Users, FileWarning, Globe, Search, Bell, BellRing, LogOut } from 'lucide-react';
import { AnalysisResult } from '@/lib/nexus-types';
import { useLanguage } from '@/context/LanguageContext';
import { useCredits } from '@/context/CreditsContext';
import { useState } from 'react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: AnalysisResult | null;
    onTopUp: () => void;
}

import { useSoundFX } from '@/hooks/useSoundFX';

export default function ReportModal({ isOpen, onClose, result, onTopUp }: ReportModalProps) {
    const { t } = useLanguage();
    const { spendCredits, balance } = useCredits(); // Correct property is 'balance' not 'credits'
    const { playSuccess, playClick, playAlert } = useSoundFX();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const handleSubscribe = () => {
        if (isSubscribed) return;

        // Confirmation Step
        if (!confirming) {
            playClick();
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000); // Reset after 3s if no confirm
            return;
        }

        playClick();

        // 1. Check if user has enough credits
        if (balance > 0) {
            // 2. Start Decryption Sequence
            const success = spendCredits(1);
            if (success) {
                setIsUnlocking(true);
                setConfirming(false);
                // Simulate "Heavy Decryption" process
                setTimeout(() => {
                    playSuccess(); // BINGO SOUND
                    setIsUnlocking(false);
                    setIsSubscribed(true);
                }, 2000);
            }
        } else {
            // 3. No credits? Redirect to Payment Gateway
            playAlert(); // Access Denied Sound
            onTopUp(); // Open PaymentModal
        }
    };

    if (!result) return null;

    const pair = result.pairData;
    const security = result.securityData;

    // Calculate Top 10 percentage if available
    let top10Percent = 0;
    if (security?.top_holders) {
        top10Percent = security.top_holders.reduce((acc, h) => acc + parseFloat(h.percent || "0"), 0) * 100;
    }

    // Determine "Safe" Values for display
    const isMintSafe = security ? security.mintable !== "1" : false;
    const isHoneyPotSafe = security ? security.is_honeypot !== "1" : false;
    const isHoldersSafe = security ? top10Percent < 50 : false;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        className="relative w-full max-w-5xl bg-black border border-gold-primary/30 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.1)] flex flex-col max-h-[92vh]"
                    >
                        {/* Header with ID */}
                        <div className="p-6 border-b border-gold-primary/20 flex justify-between items-start bg-gradient-to-r from-gold-primary/10 to-transparent">
                            <div>
                                <h2 className="text-3xl font-black text-gold-primary tracking-tighter flex items-center gap-3 uppercase font-mono">
                                    <Shield size={32} />
                                    {t('report.title')}
                                </h2>
                                <div className="flex items-center gap-4 mt-2 text-xs font-mono text-gray-400">
                                    <span className="bg-white/10 px-2 py-1 rounded text-white">{t('report.case_id')}: {result.findings.analyst.id}-{Math.floor(Math.random() * 1000)}</span>
                                    <span>{t('report.target')}: {pair?.baseToken?.symbol || "UNKNOWN"}</span>
                                    <span>{t('report.time')}: {new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                                <button
                                    onClick={handleSubscribe}
                                    className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition-all ${isSubscribed
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                        : confirming
                                            ? 'bg-red-500/20 text-red-500 border-red-500 animate-pulse'
                                            : 'bg-gold-primary/10 text-gold-primary border border-gold-primary/30 hover:bg-gold-primary/20'
                                        }`}
                                >
                                    {isSubscribed ? <BellRing size={16} /> : <Bell size={16} />}
                                    {isSubscribed
                                        ? "ACTIVE"
                                        : confirming
                                            ? "CONFIRM?"
                                            : "UNLOCK (1 CR)"}
                                </button>

                                <button
                                    onClick={onClose}
                                    className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 font-mono uppercase tracking-wider group"
                                >
                                    <span>EXIT</span>
                                    <LogOut size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-10 custom-scrollbar flex flex-col">

                            {/* SECTION 1: PREMIUM CONTENT (LOCKED/UNLOCKED) */}
                            {/* This is now FIRST so users see the Lock/Paywall immediately */}
                            <div className="relative order-1">

                                <div className={`transition-all duration-500 ${!isSubscribed ? 'blur-lg opacity-50 select-none pointer-events-none' : 'blur-0 opacity-100'}`}>

                                    {/* VERDICT & SCORE (Moved inside Premium visual block) */}
                                    <div className={`p-8 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-8 mb-10 ${result.riskLevel === 'ELITE' ? 'bg-purple-500/10 border-purple-500/50' :
                                        result.riskLevel === 'SAFE' ? 'bg-green-500/10 border-green-500/50' :
                                            result.riskLevel === 'DEGEN' ? 'bg-yellow-500/10 border-yellow-500/50' :
                                                result.riskLevel === 'DANGER' ? 'bg-orange-500/10 border-orange-500/50' :
                                                    'bg-red-500/10 border-red-500/50'
                                        }`}>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-mono uppercase tracking-widest opacity-70 mb-2">{t('report.verdict_header')}</h4>
                                            <div className={`text-4xl md:text-5xl font-black uppercase leading-none mb-2 ${result.riskLevel === 'ELITE' ? 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]' :
                                                result.riskLevel === 'SAFE' ? 'text-green-500' :
                                                    result.riskLevel === 'DEGEN' ? 'text-yellow-400' :
                                                        result.riskLevel === 'DANGER' ? 'text-orange-500' :
                                                            'text-red-600 glitch-text'
                                                }`} data-text={result.verdict}>
                                                {result.verdict}
                                            </div>
                                            <p className="text-gray-300 max-w-xl">
                                                {t(`descriptions.${result.riskLevel.toLowerCase()}`)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-4 min-w-[200px]">
                                            <div className="text-6xl font-black text-white font-mono">{result.score}</div>
                                            <div className="text-xs uppercase tracking-widest text-gray-500">{t('report.score_label')}</div>
                                            {pair && (
                                                <a href={pair.url} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-white text-black font-bold rounded hover:scale-105 transition-transform flex items-center gap-2">
                                                    {t('ui.view_chart')} <ExternalLink size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* SWARM INTELLIGENCE */}
                                    <div className="mb-10">
                                        <h3 className="text-sm font-mono text-gold-primary font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Activity size={14} /> {t('report.swarm_header')}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <AgentFindingCard agent={result.findings.analyst} name={t('agents.analyst.name')} role={t('agents.analyst.role')} />
                                            <AgentFindingCard agent={result.findings.sentinel} name={t('agents.sentinel.name')} role={t('agents.sentinel.role')} />
                                            <AgentFindingCard agent={result.findings.shadow} name={t('agents.shadow.name')} role={t('agents.shadow.role')} />
                                        </div>
                                    </div>

                                    {/* EXTERNAL INTELLIGENCE UPLINK */}
                                    <div className="mb-10">
                                        <h3 className="text-sm font-mono text-blue-400 font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <ExternalLink size={14} /> {t('report.uplink_header')}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <ExternalLinkButton
                                                label={t('links.explorer')}
                                                icon={<Globe size={16} />}
                                                href={getExplorerUrl(pair?.chainId, pair?.baseToken?.address)}
                                                color="blue"
                                            />
                                            <ExternalLinkButton
                                                label={t('links.rugcheck')}
                                                icon={<ShieldCheck size={16} />}
                                                href={getAuditUrl(pair?.chainId, pair?.baseToken?.address)}
                                                color="green"
                                            />
                                            <ExternalLinkButton
                                                label={t('links.twitter')}
                                                icon={<Search size={16} />}
                                                href={`https://twitter.com/search?q=${pair?.baseToken?.address || pair?.baseToken?.symbol}&src=typed_query`}
                                                color="sky"
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* LOCK / DECRYPT OVERLAY */}
                                {!isSubscribed && (
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-20">

                                        {isUnlocking ? (
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="bg-black/90 backdrop-blur-xl border border-green-500/50 p-8 rounded-2xl flex flex-col items-center text-center max-w-md shadow-[0_0_50px_rgba(34,197,94,0.3)]"
                                            >
                                                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <h3 className="text-2xl font-black text-green-500 mb-2 animate-pulse">DECRYPTING...</h3>
                                                <p className="text-gray-400 font-mono text-xs">
                                                    EXTRACTING ON-CHAIN METADATA...
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                                                className="bg-black/80 backdrop-blur-xl border border-gold-primary/50 p-8 rounded-2xl flex flex-col items-center text-center max-w-md shadow-[0_0_50px_rgba(212,175,55,0.2)]"
                                            >
                                                <Lock size={40} className="text-gold-primary mb-4 animate-bounce" />
                                                <h3 className="text-2xl font-black text-white mb-2">CLASSIFIED INTEL</h3>
                                                <p className="text-gray-400 mb-6 text-sm">
                                                    The <strong>Risk Score</strong>, <strong>Agent Findings</strong>, and <strong>Social Sentiment</strong> are encrypted.
                                                </p>
                                                <button
                                                    onClick={handleSubscribe}
                                                    className={`bg-gold-primary text-black text-lg font-bold px-8 py-3 rounded-full hover:scale-105 hover:bg-white transition-all shadow-lg flex items-center gap-2 ${confirming ? 'animate-pulse bg-red-500 text-white' : ''}`}
                                                >
                                                    {confirming ? "CONFIRM SPEND?" : "UNLOCK REPORT"} <span className="bg-black/20 px-2 py-0.5 rounded text-xs ml-2">1 CREDIT</span>
                                                </button>
                                            </motion.div>
                                        )}

                                    </div>
                                )}
                            </div>

                            {/* DISCLAIMER FOOTER (Moved Up) */}
                            <div className="border-t border-white/10 pt-6 mt-8 order-2">
                                <div className="flex items-start gap-4 text-gray-500 text-[10px] md:text-xs font-mono leading-relaxed">
                                    <FileWarning size={24} className="shrink-0 text-gray-600" />
                                    <p>
                                        <span className="font-bold text-gray-400">{t('report.disclaimer_title')}</span> {t('report.disclaimer_text')}
                                    </p>
                                </div>
                            </div>

                            {/* SECTION 2: THE FIREWALL (Technical Details - NOW LAST) */}
                            <div className="order-3 border-t border-white/10 pt-8">
                                <h3 className="text-[10px] md:text-sm font-mono text-gray-500 font-bold uppercase tracking-[0.2em] mb-2 md:mb-4 flex items-center gap-2">
                                    <Lock size={12} className="md:w-3.5 md:h-3.5" /> {t('report.security_header')}
                                </h3>
                                {security ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                        <FirewallCard
                                            label={t('report.firewall.honeypot')}
                                            status={isHoneyPotSafe ? "PASSED" : "FAILED"}
                                            isSafe={isHoneyPotSafe}
                                            details={isHoneyPotSafe ? t('report.firewall.honeypot_safe') : t('report.firewall.honeypot_danger')}
                                        />
                                        <FirewallCard
                                            label={t('report.firewall.mint')}
                                            status={isMintSafe ? "DISABLED" : "ENABLED"}
                                            isSafe={isMintSafe}
                                            details={isMintSafe ? t('report.firewall.mint_disabled') : t('report.firewall.mint_enabled')}
                                        />
                                        <FirewallCard
                                            label={t('report.firewall.holders')}
                                            status={`TOP 10: ${top10Percent.toFixed(1)}%`}
                                            isSafe={isHoldersSafe}
                                            details={isHoldersSafe ? t('report.firewall.holders_safe') : t('report.firewall.holders_danger')}
                                        />
                                    </div>
                                ) : (
                                    <div className="p-4 border border-gray-500/20 bg-gray-900/10 rounded-lg text-gray-400 font-mono text-[10px] md:text-xs opacity-80 leading-relaxed">
                                        <div className="flex items-center gap-2 mb-2 text-yellow-500/80">
                                            <Activity size={14} className="animate-pulse" />
                                            <span className="font-bold">STATUS: OFFLINE</span>
                                        </div>
                                        {t('report.security_error')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function FirewallCard({ label, status, isSafe, details }: { label: string, status: string, isSafe: boolean, details: string }) {
    return (
        <div className={`p-4 rounded-xl border flex flex-col gap-2 ${isSafe ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'
            }`}>
            <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{label}</span>
                {isSafe ? <ShieldCheck size={16} className="text-green-500" /> : <ShieldAlert size={16} className="text-red-500" />}
            </div>
            <div className={`text-xl font-bold font-mono ${isSafe ? 'text-green-400' : 'text-red-500'}`}>
                {status}
            </div>
            <div className="text-[10px] text-gray-500 leading-tight">
                {details}
            </div>
        </div>
    );
}

function AgentFindingCard({ agent, name, role }: { agent: any, name: string, role: string }) {
    return (
        <div className={`p-5 rounded-xl border relative overflow-hidden group ${agent.level === 'ELITE' ? 'bg-purple-500/5 border-purple-500/20' :
            agent.level === 'SAFE' ? 'bg-green-500/5 border-green-500/20' :
                agent.level === 'DEGEN' ? 'bg-yellow-500/5 border-yellow-500/20' :
                    agent.level === 'DANGER' ? 'bg-orange-500/5 border-orange-500/20' :
                        'bg-red-500/5 border-red-500/20'
            }`}>
            <div className="absolute top-0 right-0 p-3 opacity-20">
                <Users size={40} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`w-2 h-2 rounded-full ${agent.level === 'ELITE' ? 'bg-purple-500' :
                        agent.level === 'SAFE' ? 'bg-green-500' :
                            agent.level === 'DEGEN' ? 'bg-yellow-500' :
                                agent.level === 'DANGER' ? 'bg-orange-500' : 'bg-red-500'
                        }`}></span>
                    <h4 className="font-bold text-sm text-gray-200 tracking-wider uppercase">{name}</h4>
                </div>

                <div className="text-xs font-mono text-gold-primary/70 mb-2 uppercase">{role}</div>

                <p className="text-sm font-medium mb-2 text-white">{agent.message}</p>
                <div className="h-px bg-white/10 my-2"></div>
                <p className="text-xs text-gray-400 font-mono italic">"{agent.details}"</p>
            </div>
        </div>
    );
}

function ExternalLinkButton({ label, icon, href, color }: { label: string, icon: any, href: string, color: string }) {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20",
        green: "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20",
        sky: "bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20",
    };

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`border px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 font-mono text-xs font-bold uppercase tracking-wider ${colorClasses[color] || colorClasses.blue}`}
        >
            {icon}
            {label}
        </a>
    );
}

function getExplorerUrl(chainId: string | undefined, address: string | undefined) {
    if (!chainId || !address) return "#";
    switch (chainId) {
        case 'solana': return `https://solscan.io/token/${address}`;
        case 'ethereum': return `https://etherscan.io/token/${address}`;
        case 'base': return `https://basescan.org/token/${address}`;
        case 'bsc': return `https://bscscan.com/token/${address}`;
        default: return `https://dexscreener.com/${chainId}/${address}`;
    }
}

function getAuditUrl(chainId: string | undefined, address: string | undefined) {
    if (!chainId || !address) return "#";
    if (chainId === 'solana') return `https://rugcheck.xyz/tokens/${address}`;
    return `https://gopluslabs.io/token-security/${chainId}/${address}`;
}
