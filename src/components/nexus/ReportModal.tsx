import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldAlert, ShieldCheck, Shield, Activity, DollarSign, Clock, Lock, Users, FileWarning, Globe, Search, Bell, BellRing, LogOut, Copy, Check, Share2, Rocket } from 'lucide-react';
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

import { jsPDF } from "jspdf";

export default function ReportModal({ isOpen, onClose, result, onTopUp }: ReportModalProps) {
    const { t } = useLanguage();
    const { spendCredits, balance } = useCredits();
    const { playSuccess, playClick, playAlert, playScan } = useSoundFX();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyCA = () => {
        if (!result?.pairData?.baseToken?.address) return;
        navigator.clipboard.writeText(result.pairData.baseToken.address);
        setCopied(true);
        playClick();
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareTwitter = () => {
        if (!result) return;
        playClick();
        const text = `Just scanned $${result.pairData?.baseToken?.symbol} with Nexus Terminal. 🐺\n\n🔎 VERDICT: ${result.riskLevel} (${result.score}/100)\n\nScan any token for free & catch rugs before they happen.\n👇👇👇\nscanner.wolfsfera.com`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleDownloadPDF = async () => {
        if (!result) return;

        // 1. Check & Spend Credit (Download is Premium Feature)
        if (balance < 1) {
            onTopUp(); // Open Payment Modal if insufficient
            return;
        }

        const spent = await spendCredits(1);
        if (!spent) return;

        playSuccess(); // Ching!

        // 2. Generate PDF
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let y = 20;

        // --- TITLE ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text("WOLFSFERA NEXUS INTELLIGENCE", pageWidth / 2, y, { align: "center" });
        y += 10;

        // --- SUBTITLE & DATE ---
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`CONFIDENTIAL REPORT | ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: "center" });
        y += 20;

        // --- TARGET IDENTITY ---
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`TARGET: ${result.pairData?.baseToken?.name || "UNKNOWN"} (${result.pairData?.baseToken?.symbol || "???"})`, margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont("courier", "normal");
        doc.text(`CONTRACT: ${result.pairData?.baseToken?.address || "UNKNOWN"}`, margin, y);
        y += 15;

        doc.setFont("helvetica", "normal");
        doc.line(margin, y, pageWidth - margin, y);
        y += 15;

        // --- VERDICT SECTION ---
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`RISK LEVEL: ${result.riskLevel}`, margin, y);

        doc.setFontSize(14);
        doc.text(`SCORE: ${result.score}/100`, pageWidth - margin - 40, y);
        y += 10;

        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text(`VERDICT: ${result.verdict}`, margin, y);
        y += 20;

        // --- SWARM FINDINGS ---
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("SWARM INTELLIGENCE AGENTS:", margin, y);
        y += 10;

        const agents = [
            { name: "ANALYST (Liquidity)", data: result.findings.analyst },
            { name: "SENTINEL (Activity)", data: result.findings.sentinel },
            { name: "SHADOW (Security)", data: result.findings.shadow }
        ];

        agents.forEach(agent => {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`> ${agent.name}: [${agent.data.level}]`, margin, y);
            y += 6;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`${agent.data.message}`, margin + 5, y);
            y += 5;

            doc.setFont("courier", "italic");
            doc.setTextColor(80, 80, 80);
            doc.text(`"${agent.data.details}"`, margin + 5, y);
            doc.setTextColor(0, 0, 0);
            y += 10;
        });

        // --- FOOTER ---
        y = doc.internal.pageSize.getHeight() - 20;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Generated by Wolfsfera Nexus Scanner. DYOR. Not Financial Advice.", pageWidth / 2, y, { align: "center" });

        // Save
        const filename = `NEXUS_REPORT_${result.pairData?.baseToken?.symbol || "UNKNOWN"}_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(filename);
    };

    const handleSubscribe = () => {
        if (isSubscribed) return;
        playClick();
        setIsUnlocking(true);
        setConfirming(false);
        setTimeout(() => {
            playSuccess();
            setIsUnlocking(false);
            setIsSubscribed(true);
        }, 1500);
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

    // Badges Data
    const findingsList = [result.findings.analyst, result.findings.sentinel, result.findings.shadow];

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
                        {/* Header with ID - Mobile Optimized Stack */}
                        <div className="p-4 md:p-6 border-b border-gold-primary/20 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gold-primary/10 to-transparent gap-4 md:gap-0">
                            <div className="w-full md:w-auto">
                                <h2 className="text-2xl md:text-3xl font-black text-gold-primary tracking-tighter flex items-center gap-3 uppercase font-mono mb-2 md:mb-0">
                                    <Shield size={24} className="md:w-8 md:h-8" />
                                    {t('report.title')}
                                </h2>

                                <div className="space-y-2 mt-2">
                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs font-mono text-gray-400">
                                        <span className="bg-white/10 px-2 py-1 rounded text-white whitespace-nowrap">{t('report.case_id')}: {result.findings.analyst.id}-{Math.floor(Math.random() * 1000)}</span>
                                        <span className="text-white font-bold">{pair?.baseToken?.name} ({pair?.baseToken?.symbol})</span>
                                        <span className="hidden md:inline">{t('report.time')}: {new Date().toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 bg-black/40 px-2 py-1 rounded w-full md:w-fit border border-white/5 break-all">
                                        <Lock size={10} className="shrink-0" />
                                        <span className="hidden md:inline">CONTRACT:</span>
                                        <span className="text-gold-primary select-all truncate">{pair?.baseToken?.address || "UNKNOWN"}</span>
                                        {/* COPY CA BUTTON */}
                                        <button
                                            onClick={handleCopyCA}
                                            className="ml-1 p-1 hover:text-white transition-colors relative"
                                            title="Copy CA"
                                        >
                                            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                {/* SHARE BUTTON */}
                                <button
                                    onClick={handleShareTwitter}
                                    className="px-3 py-2 rounded-full border border-sky-500/30 text-[10px] text-sky-400 hover:bg-sky-500/10 transition-all flex items-center gap-2 font-mono uppercase tracking-wider group"
                                >
                                    <Share2 size={14} className="md:w-4 md:h-4 group-hover:rotate-12 transition-transform" />
                                    <span className="hidden md:inline">SHARE</span>
                                </button>

                                {/* PDF DOWNLOAD BUTTON */}
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex-1 md:flex-none justify-center px-4 py-2 rounded-full font-bold text-[10px] md:text-xs flex items-center gap-2 transition-all bg-gold-primary text-black hover:bg-white hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] whitespace-nowrap"
                                >
                                    <FileWarning size={14} className="md:w-4 md:h-4" />
                                    DOWNLOAD PDF (1 CR)
                                </button>

                                <button
                                    onClick={onClose}
                                    className="px-3 py-2 md:py-1.5 rounded-full border border-white/10 text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 font-mono uppercase tracking-wider group"
                                >
                                    <LogOut size={14} className="md:w-3 md:h-3" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-10 custom-scrollbar flex flex-col">

                            {/* SECTION 1: VERDICT & SCORE */}
                            <div className={`p-8 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-8 ${result.riskLevel === 'ELITE' ? 'bg-purple-500/10 border-purple-500/50' :
                                result.riskLevel === 'SAFE' ? 'bg-green-500/10 border-green-500/50' :
                                    result.riskLevel === 'DEGEN' ? 'bg-yellow-500/10 border-yellow-500/50' :
                                        result.riskLevel === 'DANGER' ? 'bg-orange-500/10 border-orange-500/50' :
                                            'bg-red-500/10 border-red-500/50'
                                }`}>
                                <div className="flex-1">
                                    <h4 className="text-sm font-mono uppercase tracking-widest opacity-70 mb-2 flex items-center gap-3">
                                        {t('report.verdict_header')}
                                        {/* RISK LEVEL STAMP */}
                                        <span className={`px-3 py-0.5 rounded-full text-xs font-black border tracking-wider ${result.riskLevel === 'ELITE' ? 'bg-purple-500 text-black border-purple-400' :
                                            result.riskLevel === 'SAFE' ? 'bg-green-500 text-black border-green-400' :
                                                result.riskLevel === 'DEGEN' ? 'bg-yellow-500 text-black border-yellow-400' :
                                                    result.riskLevel === 'DANGER' ? 'bg-orange-500 text-black border-orange-400' :
                                                        'bg-red-600 text-white border-red-500'
                                            }`}>
                                            {result.riskLevel}
                                        </span>
                                    </h4>
                                    <div className={`text-4xl md:text-5xl font-black uppercase leading-none mb-2 ${result.riskLevel === 'ELITE' ? 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]' :
                                        result.riskLevel === 'SAFE' ? 'text-green-500' :
                                            result.riskLevel === 'DEGEN' ? 'text-yellow-400' :
                                                result.riskLevel === 'DANGER' ? 'text-orange-500' :
                                                    'text-red-600 glitch-text'
                                        }`} data-text={result.verdict}>
                                        {result.verdict}
                                    </div>
                                    <p className="text-gray-300 max-w-xl mb-4">
                                        {t(`descriptions.${result.riskLevel.toLowerCase()}`)}
                                    </p>

                                    {/* (Badges moved to right column) */}
                                </div>

                                <div className="flex flex-col items-center gap-4 min-w-[200px]">
                                    <div className="text-6xl font-black text-white font-mono leading-none">{result.score}</div>
                                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">{t('report.score_label')}</div>

                                    {/* TOP 3 MOTIVES (UNDER SCORE) */}
                                    <div className="w-full space-y-2 mb-2">
                                        {/* 1. LIQUIDITY */}
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${result.findings.analyst.level === 'ELITE' || result.findings.analyst.level === 'SAFE' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
                                            result.findings.analyst.level === 'DEGEN' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' :
                                                'bg-red-500/20 border-red-500/30 text-red-300'
                                            }`}>
                                            <DollarSign size={12} strokeWidth={3} />
                                            <span className="truncate">{result.findings.analyst.message}</span>
                                        </div>

                                        {/* 2. VOLUME */}
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${result.findings.sentinel.level === 'ELITE' || result.findings.sentinel.level === 'SAFE' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
                                            result.findings.sentinel.level === 'DEGEN' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' :
                                                'bg-red-500/20 border-red-500/30 text-red-300'
                                            }`}>
                                            <Activity size={12} strokeWidth={3} />
                                            <span className="truncate">{result.findings.sentinel.message}</span>
                                        </div>

                                        {/* 3. ON-CHAIN */}
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${result.findings.shadow.level === 'ELITE' || result.findings.shadow.level === 'SAFE' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
                                            result.findings.shadow.level === 'DEGEN' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' :
                                                'bg-red-500/20 border-red-500/30 text-red-300'
                                            }`}>
                                            <Lock size={12} strokeWidth={3} />
                                            <span className="truncate">{result.findings.shadow.message}</span>
                                        </div>
                                    </div>

                                    {pair && (
                                        <a href={pair.url} target="_blank" rel="noopener noreferrer" className="w-full px-4 py-2 bg-white text-black font-bold rounded hover:scale-105 transition-transform flex items-center justify-center gap-2 whitespace-nowrap text-xs">
                                            {t('ui.view_chart')} <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* SECTION 2: DEGEN TRADING TOOLS (NEW) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* TRADE ACTIONS */}
                                <div>
                                    <h3 className="text-sm font-mono text-green-400 font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Rocket size={14} /> TRADE ON
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <a
                                            href={`https://pump.fun/${pair?.baseToken?.address}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-3 bg-[#16A678]/10 border border-[#16A678]/40 hover:bg-[#16A678]/20 text-[#16A678] rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 uppercase tracking-wide transition-all"
                                        >
                                            💊 PUMP.FUN
                                        </a>
                                        <a
                                            href={`https://bullx.io/terminal?chainId=1399811149&address=${pair?.baseToken?.address}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-3 bg-[#a855f7]/10 border border-[#a855f7]/40 hover:bg-[#a855f7]/20 text-[#a855f7] rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 uppercase tracking-wide transition-all"
                                        >
                                            🐮 BULLX
                                        </a>
                                    </div>
                                </div>

                                {/* RESEARCH ACTIONS */}
                                <div>
                                    <h3 className="text-sm font-mono text-blue-400 font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Search size={14} /> DEEP DIVE
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <ExternalLinkButton
                                            label="SOLSCAN"
                                            icon={<Globe size={16} />}
                                            href={getExplorerUrl(pair?.chainId, pair?.baseToken?.address)}
                                            color="blue"
                                        />
                                        <ExternalLinkButton
                                            label="RUGCHECK"
                                            icon={<ShieldCheck size={16} />}
                                            href={getAuditUrl(pair?.chainId, pair?.baseToken?.address)}
                                            color="green"
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* SECTION 3: SWARM INTELLIGENCE */}
                            <div>
                                <h3 className="text-sm font-mono text-gold-primary font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Activity size={14} /> {t('report.swarm_header')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <AgentFindingCard agent={result.findings.analyst} name={t('agents.analyst.name')} role={t('agents.analyst.role')} />
                                    <AgentFindingCard agent={result.findings.sentinel} name={t('agents.sentinel.name')} role={t('agents.sentinel.role')} />
                                    <AgentFindingCard agent={result.findings.shadow} name={t('agents.shadow.name')} role={t('agents.shadow.role')} />
                                </div>
                            </div>

                            {/* SECTION 4: THE FIREWALL (Technical Details) */}
                            <div className="border-t border-white/10 pt-8">
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

                            {/* DISCLAIMER FOOTER */}
                            <div className="border-t border-white/10 pt-6 mt-2">
                                <div className="flex items-start gap-4 text-gray-500 text-[10px] md:text-xs font-mono leading-relaxed">
                                    <FileWarning size={24} className="shrink-0 text-gray-600" />
                                    <p>
                                        <span className="font-bold text-gray-400">{t('report.disclaimer_title')}</span> {t('report.disclaimer_text')}
                                    </p>
                                </div>
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
