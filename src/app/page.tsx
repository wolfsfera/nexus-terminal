"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AgentCard from '@/components/nexus/AgentCard';
import ProbabilityDial from '@/components/nexus/ProbabilityDial';
import InfoModal from '@/components/nexus/InfoModal';
import ReportModal from '@/components/nexus/ReportModal';
import { Play, Lock, BookOpen, ExternalLink, Globe, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { nexusBrain } from '@/lib/nexus-brain';
import { AnalysisResult } from '@/lib/nexus-types';
import { useLanguage } from '@/context/LanguageContext';
import { useCredits } from '@/context/CreditsContext';
import TrendingTicker from '@/components/nexus/TrendingTicker';
import CreditBalance from '@/components/nexus/CreditBalance';
import PaymentModal from '@/components/nexus/PaymentModal';
import LegalModal from '@/components/nexus/LegalModal';
import SurvivalGuide from '@/components/nexus/SurvivalGuide';

import { useSoundFX } from '@/hooks/useSoundFX';

export default function NexusPage() {
  const { language, setLanguage, t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [tokenInput, setTokenInput] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const { spendCredits, addCredits } = useCredits();

  const { playHover, playClick, playScan, playAlert, playSuccess } = useSoundFX();

  // Boot Sequence Voice

  const runAnalysis = async () => {
    if (!tokenInput) return;

    // CHECK CREDITS
    if (!spendCredits(1)) {
      playAlert();
      setIsPaymentOpen(true);
      return;
    }

    playClick();
    playScan();


    setAnalyzing(true);
    setResult(null);
    setLogs([`> LOCKING TARGET: ${tokenInput.toUpperCase()}...`]);

    // Simulation Logs
    const logSequence = [
      "> ESTABLISHING x/402 PAYMENT CHANNEL...",
      "> AGENTS DEPLOYED TO MAINNET...",
      "> INTERCEPTING MEMPOOL DATA...",
      "> CRACKING LIQUIDITY LOCK...",
    ];

    // Start log sequence
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logSequence.length) {
        setLogs(prev => [...prev, logSequence[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 500);

    try {
      // MAGIC WORD BYPASS FOR TESTING
      if (tokenInput === 'REFUND') {
        throw new Error("TEST_REFUND");
      }

      // Call the Real Brain with Language
      const data = await nexusBrain.analyze(tokenInput, language);

      // DEBUG LOG
      // data.logs.push(`> DEBUG ID: ${data.findings.analyst.id}`);

      // AUTO-REFUND LOGIC (Fair Play)
      if (data.findings.analyst.id === 'ERR') {
        addCredits(1);
        const refundMsg = language === 'es'
          ? "> ERROR: NO ENCONTRADO. CRÉDITO DEVUELTO."
          : "> ERROR: NOT FOUND. CREDIT REFUNDED.";
        data.logs.push(refundMsg);
      }

      setResult(data);
      setLogs(data.logs); // Update logs with full analysis history

      // Voice Verdict (After result is set)
      if (data.riskLevel === 'CRITICAL') {
        playAlert();
      } else if (data.riskLevel === 'SAFE') {
        playSuccess();
      } else {
        // No sound or neutral sound
      }

    } catch (error: any) {
      console.error("Analysis failed", error);
      // Refund on Crash
      addCredits(1);

      let errorMsg = language === 'es'
        ? "> ERROR DE SISTEMA. CRÉDITO REEMBOLSADO."
        : "> SYSTEM ERROR. CREDIT REFUNDED.";

      if (error.message === 'TEST_REFUND') {
        errorMsg = language === 'es'
          ? "> PRUEBA DE REEMBOLSO EXITOSA. +1 CRÉDITO."
          : "> REFUND TEST SUCCESS. +1 CREDIT.";
      }

      setLogs(prev => [...prev, errorMsg]);

    } finally {
      setAnalyzing(false);
      clearInterval(logInterval);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-primary/30 overflow-x-hidden relative scanlines">

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/nexus/motherboard-bg.png"
          alt="Nexus Motherboard"
          fill
          priority
          className={`object-cover opacity-40 transition-all duration-1000 ${result?.riskLevel === 'CRITICAL' ? 'grayscale brightness-50 sepiahue-rotate-[-50deg] saturate-200' : // Red tint for danger
            result?.riskLevel === 'SAFE' ? 'grayscale-0' :
              'grayscale'
            }`}
        />
        <div className="absolute inset-0 bg-[url('/images/nexus/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className={`absolute inset-0 bg-radial-gradient from-transparent to-black transition-colors duration-1000 ${result?.riskLevel === 'CRITICAL' ? 'via-red-950/20' : ''
          }`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-4 pb-20 min-h-screen flex flex-col">

        {/* 3D Logo Header - Compact Version */}
        <header className="flex flex-col items-center mb-6 shrink-0 relative w-full max-w-6xl">

          {/* Language Toggle (Left) */}
          <div className="absolute left-0 top-0 md:left-4 md:top-4 z-30">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={playHover}
              onClick={() => { playClick(); setLanguage(language === 'es' ? 'en' : 'es'); }}
              className="text-xs font-mono text-gold-primary border border-gold-primary/30 px-3 py-1 rounded hover:bg-gold-primary/10 flex items-center gap-2 pointer-events-auto bg-black/50 backdrop-blur"
            >
              <Globe size={14} />
              <span className="font-bold">{language.toUpperCase()}</span>
            </motion.button>
          </div>

          {/* Right Side Controls (Manual + Credits) */}
          <div className="absolute right-0 top-0 md:right-4 md:top-4 z-30 flex items-center gap-4">
            {/* Info Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={playHover}
              onClick={() => { playClick(); setShowInfo(true); }}
              className="text-xs font-mono text-gold-primary border border-gold-primary/30 px-3 py-1 rounded hover:bg-gold-primary/10 flex items-center gap-2 pointer-events-auto bg-black/50 backdrop-blur"
            >
              <BookOpen size={14} />
              <span className="hidden md:inline">{t('ui.manual_btn')}</span>
            </motion.button>

            {/* Credit Balance / Buy Button */}
            <CreditBalance onTopUp={() => { playClick(); setIsPaymentOpen(true); }} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-32 h-32 md:w-40 md:h-40 -mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-8 md:mt-0"
          >
            <Image
              src="/images/nexus/logo-3d.png"
              alt="Wolfsfera Nexus Logo"
              fill
              priority
              className="object-contain"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[10px] md:text-xs text-gray-400 max-w-2xl mx-auto flex items-center justify-center gap-2 font-mono tracking-widest uppercase bg-black/50 backdrop-blur-sm px-4 py-1 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
          >
            <Lock size={12} className="text-green-500" />
            <span className="text-green-400 font-bold">{t('ui.firewall_title')}</span>
            <span className="text-gray-600 hidden md:inline">|</span>
            <span className="hidden md:inline">{t('ui.subtitle')}</span>
          </motion.p>

          {/* SECURITY TRUST BADGE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-3 flex items-center justify-center gap-2"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-gray-500 hover:text-white transition-colors cursor-help group relative">
              <ShieldCheck size={12} className="text-blue-500" />
              <span>INTELLIGENCE POWERED BY</span>
              <span className="font-bold text-gray-400">RUGCHECK</span>
              <span>&</span>
              <span className="font-bold text-gray-400">GOPLUS</span>

              {/* Tooltip */}
              <div className="absolute top-full text-center mt-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-black border border-white/20 rounded text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                VERIFIED SECURITY DATA PROVIDERS
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-gray-500">
              <Lock size={12} className="text-green-500" />
              <span>SSL ENCRYPTED</span>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center perspective-1000 flex-1 content-center">

          {/* Left Column: Agents - Compact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px bg-gold-primary/50 flex-1"></div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold-primary font-bold">Agents Swarm</h2>
              <div className="h-px bg-gold-primary/50 flex-1"></div>
            </div>

            <div className="space-y-3" onMouseEnter={playHover}>
              <AgentCard
                name={t('agents.analyst.name')}
                role={t('agents.analyst.role')}
                image="/images/nexus/agent-analyst.png"
                id="********"
                price="0.05 USDC"
                status={analyzing ? 'analyzing' : result ? 'complete' : 'idle'}
                finding={result?.findings.analyst}
              />
              <AgentCard
                name={t('agents.sentinel.name')}
                role={t('agents.sentinel.role')}
                image="/images/nexus/agent-sentinel.png"
                id="********"
                price="0.02 USDC"
                status={analyzing ? 'analyzing' : result ? 'complete' : 'idle'}
                finding={result?.findings.sentinel}
              />
              <AgentCard
                name={t('agents.shadow.name')}
                role={t('agents.shadow.role')}
                image="/images/nexus/agent-shadow.png"
                id="********"
                price="0.10 USDC"
                status={analyzing ? 'analyzing' : result ? 'complete' : 'idle'}
                finding={result?.findings.shadow}
              />
            </div>
          </div>

          {/* Center Column: Dial & Action - Compact */}
          <div className={`lg:col-span-2 border transition-all duration-1000 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group h-full max-h-[500px] flex flex-col items-center justify-center ${result?.riskLevel === 'CRITICAL' ? 'bg-red-950/30 border-red-500/30 shadow-red-900/20' :
            result?.riskLevel === 'SAFE' ? 'bg-green-950/30 border-green-500/30 shadow-green-900/20' :
              'bg-black/40 border-white/10'
            }`}>

            {/* Decorative HUD Elements */}
            <div className="absolute top-0 right-0 p-3 opacity-50">
              <div className={`w-12 h-12 border-t-2 border-r-2 rounded-tr-xl ${result?.riskLevel === 'CRITICAL' ? 'border-red-500' : 'border-gold-primary/30'}`}></div>
            </div>
            <div className="absolute bottom-0 left-0 p-3 opacity-50">
              <div className={`w-12 h-12 border-b-2 border-l-2 rounded-bl-xl ${result?.riskLevel === 'CRITICAL' ? 'border-red-500' : 'border-gold-primary/30'}`}></div>
            </div>

            <div className="flex flex-col items-center justify-center w-full relative z-10">
              <div className="w-full max-w-md mb-8 transform hover:scale-105 transition-transform duration-500 relative">
                <ProbabilityDial value={result?.score ?? 0} loading={analyzing} />
              </div>

              <div className="text-center w-full max-w-sm space-y-4">
              </div>
            </div>


            {!analyzing && result === null && (
              <div className="w-full max-w-sm flex flex-col gap-4">
                {/* Search Tip */}
                <p className="text-[10px] md:text-xs text-center text-gray-400 mb-1 font-mono tracking-wide animate-pulse">
                  {t('ui.search_tip')}
                </p>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => { setTokenInput(e.target.value.toUpperCase()); playHover(); }}
                  onFocus={playScan}
                  placeholder={t('ui.placeholder')}
                  className="w-full bg-black/50 border border-gold-primary/30 rounded-xl py-4 px-4 text-center font-mono text-lg text-gold-primary placeholder:text-gray-600 focus:outline-none focus:border-gold-primary focus:bg-gold-primary/5 transition-all shadow-inner"
                />

                <motion.button
                  whileHover={{ scale: 1.05, textShadow: "0 0 8px rgb(0,0,0)" }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHover}
                  onClick={runAnalysis}
                  disabled={!tokenInput}
                  className={`w-full font-bold text-lg py-4 rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all flex items-center justify-center gap-3 relative overflow-hidden ${!tokenInput ? 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none' : 'bg-gold-gradient text-black'
                    }`}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300"></div>
                  <Play fill={!tokenInput ? 'gray' : 'black'} size={20} />
                  <span className="tracking-wider flex flex-col items-start leading-none">
                    <span>{t('ui.analyze_btn')}</span>
                    <span className="text-[10px] opacity-70">COST: 1 CREDIT</span>
                  </span>
                </motion.button>
              </div>
            )}

            {analyzing && (
              <div className="text-gold-primary font-mono text-xs animate-pulse border border-gold-primary/20 bg-gold-primary/5 p-4 rounded-lg text-left space-y-1 w-full max-w-md">
                <p>&gt; TARGET LOCKED: {tokenInput.toUpperCase() || "UNKNOWN"}</p>
                <p>&gt; AGGREGATING SWARM SIGNALS... <span className="text-green-500">OK</span></p>
                <p>&gt; AGENT "SENTINEL" SCANNING... <span className="text-green-500">DONE</span></p>
                <p>&gt; COMPUTING RISK PROBABILITY...</p>
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 w-full max-w-md"
              >
                <div className={`p-6 border rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] ${result.riskLevel === 'SAFE' ? 'bg-green-500/10 border-green-500/30' :
                  result.riskLevel === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' :
                    'bg-yellow-500/10 border-yellow-500/30'
                  }`}>
                  <h3 className={`font-bold text-2xl mb-2 flex items-center justify-center gap-2 ${result.riskLevel === 'SAFE' ? 'text-green-400' :
                    result.riskLevel === 'CRITICAL' ? 'text-red-500' :
                      'text-yellow-400'
                    }`}>
                    <div className={`w-3 h-3 rounded-full animate-ping ${result.riskLevel === 'SAFE' ? 'bg-green-500' :
                      result.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}></div>
                    {result.verdict}
                  </h3>
                  <div className="space-y-1 text-center">
                    {logs.slice(-3).map((log, i) => (
                      <p key={i} className={`text-xs font-mono ${log.includes("REEMBOLSADO") || log.includes("REFUNDED") ? 'text-green-400 font-bold animate-pulse' : 'text-gray-400'}`}>
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => { playClick(); setResult(null); setLogs([]); setTokenInput(''); }}
                  className="text-gray-500 hover:text-white transition-colors text-xs font-mono tracking-widest uppercase hover:underline"
                >
                  [ {language === 'es' ? 'RESETEAR SISTEMA' : 'RESET SYSTEM'} ]
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHover}
                  onClick={() => { playClick(); setIsReportOpen(true); }}
                  className="w-full py-4 bg-gold-primary/20 border border-gold-primary text-gold-primary rounded-xl flex items-center justify-center gap-2 transition-all group shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-pulse hover:animate-none"
                >
                  <ShieldCheck size={20} className="animate-bounce" />
                  <span className="text-sm font-black tracking-widest uppercase">&gt;&gt;&gt; ACCESS CLASSIFIED REPORT ({result.riskLevel}) &lt;&lt;&lt;</span>
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <SurvivalGuide />

      {/* Footer / Logs - REPLACED BY TICKER */}
      <TrendingTicker />

      {/* Legal Footer Link (Absolute Bottom Right, above ticker) */}
      <div className="absolute bottom-12 right-4 z-40">
        <button
          onClick={() => setIsLegalOpen(true)}
          className="text-[10px] text-gray-600 font-mono hover:text-gray-400 transition-colors uppercase tracking-widest"
        >
          LEGAL / DISCLAIMER
        </button>
      </div>

      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        result={result}
        onTopUp={() => setIsPaymentOpen(true)}
      />
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
      <LegalModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} />
    </div>
  );
}
