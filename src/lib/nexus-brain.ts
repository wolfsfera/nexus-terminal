
import { AnalysisResult, RiskLevel } from './nexus-types';
export type { AnalysisResult };
import { DexScreenerPair, dexscreener } from '../services/dexscreener';
import { securityService, SecurityData } from '../services/security';
import { solanaService, DirectSecurityReport } from '../services/solana-contract';
import { dictionary, Locale } from './i18n/dictionary';

const SCENARIOS = { /* ... kept just incase ... */ };

export const nexusBrain = {
    analyze: async (tokenInput: string, language: Locale = 'es'): Promise<AnalysisResult> => {
        // 1. Fetch Basic Data (Price, Vol, Liq)
        const pairs = await dexscreener.searchPairs(tokenInput);

        // Logs accumulator
        let logs: string[] = [
            `> SEARCHING DEXSCREENER: ${tokenInput}...`,
        ];

        if (!pairs || pairs.length === 0) {
            // TRY DIRECT READ EVEN IF NOT INDEXED (GHOST MODE ENHANCED)
            // Check if input looks like a Solana address (base58, length 32-44)
            const isAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(tokenInput);

            let directReport: DirectSecurityReport | null = null;
            if (isAddress) {
                logs.push(`> DETECTED POTENTIAL ADDRESS. ATTEMPTING DIRECT BLOCKCHAIN READ...`);
                directReport = await solanaService.generateSecurityReport(tokenInput);
                if (directReport.metadata) {
                    logs.push(`> DIRECT READ SUCCESS: CONTRACT FOUND ON-CHAIN.`);
                    logs.push(`> SUPPLY: ${directReport.metadata.supply} | DECIMALS: ${directReport.metadata.decimals}`);
                } else {
                    logs.push(`> DIRECT READ FAILED: INVALID OR NON-EXISTENT CONTRACT.`);
                }
            }

            if (!directReport?.metadata) {
                // ORIGINAL ERROR LOGIC
                logs.push("> ERROR: TOKEN NOT FOUND ON-CHAIN (API + DIRECT).");
                logs.push(`> STATUS: ${language === 'es' ? 'NO INDEXADO O SIN LIQUIDEZ' : 'NOT INDEXED OR NO LIQUIDITY POOL'}.`);

                return {
                    score: 0,
                    riskLevel: 'DANGER',
                    verdict: dictionary[language].verdicts.ghost, // 'NOT INDEXED / GHOST'
                    findings: {
                        analyst: { id: "ERR", level: "DANGER", message: "DATA VOID", details: language === 'es' ? "Token no encontrado. Posiblemente muy nuevo o muerto." : "Token not found. Potentially too new or dead." },
                        sentinel: { id: "ERR", level: "DANGER", message: "NO ACTIVITY", details: language === 'es' ? "Sin historial de trading." : "No trading history found." },
                        shadow: { id: "ERR", level: "DANGER", message: "UNKNOWN CONTRACT", details: language === 'es' ? "Escaneo profundo imposible sin datos de pool." : "Deep scan impossible without pool data." }
                    },
                    logs: logs,
                    pairData: {
                        chainId: 'solana',
                        dexId: 'unknown',
                        url: '',
                        pairAddress: 'UNKNOWN',
                        baseToken: {
                            name: 'UNKNOWN TARGET',
                            symbol: tokenInput.toUpperCase(),
                            address: tokenInput
                        },
                        quoteToken: { name: 'SOL', symbol: 'SOL', address: '' },
                        priceNative: '0',
                        priceUsd: '0',
                        txns: { m5: { buys: 0, sells: 0 }, h1: { buys: 0, sells: 0 }, h6: { buys: 0, sells: 0 }, h24: { buys: 0, sells: 0 } },
                        volume: { h24: 0, h6: 0, h1: 0, m5: 0 },
                        priceChange: { h1: 0, h6: 0, h24: 0, m5: 0 },
                        liquidity: { usd: 0, base: 0, quote: 0 }
                    },
                    securityData: null
                };
            }
            // IF DIRECT READ SUCCEEDED BUT NO DEX DATA -> PARTIAL GHOST REPORT
            logs.push(`> STATUS: CONTRACT EXISTS BUT NO LIQUIDITY POOL FOUND.`);
            // Pass to analyzeTokenData with a Mock Pair using real metadata names if possible (we don't get name from spl-token, only basic supply/mint/freeze. Metaplex needed for name, but keep simple)
            // We'll proceed to standard analysis but with empty pair data, relying on directReport for verdict.
            // We need to construct a 'bestPair' mock.
            const ghostPair: DexScreenerPair = {
                chainId: 'solana',
                dexId: 'unknown',
                url: '',
                pairAddress: 'UNKNOWN',
                baseToken: {
                    name: directReport.metadata?.name || 'SOLANA CONTRACT (DIRECT)',
                    symbol: directReport.metadata?.symbol || `${tokenInput.slice(0, 4)}..${tokenInput.slice(-4)}`,
                    address: tokenInput
                },
                quoteToken: { name: 'SOL', symbol: 'SOL', address: '' },
                priceNative: '0', priceUsd: '0',
                txns: { m5: { buys: 0, sells: 0 }, h1: { buys: 0, sells: 0 }, h6: { buys: 0, sells: 0 }, h24: { buys: 0, sells: 0 } },
                volume: { h24: 0, h6: 0, h1: 0, m5: 0 },
                priceChange: { h1: 0, h6: 0, h24: 0, m5: 0 },
                liquidity: { usd: 0, base: 0, quote: 0 }
            };
            return analyzeTokenData(ghostPair, tokenInput, logs, null, directReport, language);
        }

        // 2. SMART PAIR SELECTION (Solana > Address > Name > Liquidity)
        // ... (Existing sorting logic maintained) ...
        pairs.sort((a, b) => {
            if (a.chainId === 'solana' && b.chainId !== 'solana') return -1;
            if (a.chainId !== 'solana' && b.chainId === 'solana') return 1;
            return 0;
        });

        let bestPair = pairs[0];
        const inputLower = tokenInput.toLowerCase();

        // A. Direct Address Match
        const addressMatch = pairs.find(p => p.baseToken.address.toLowerCase() === inputLower);
        if (addressMatch) {
            bestPair = addressMatch;
            logs.push(`> TARGET LOCKED VIA CONTRACT ADDRESS (EXACT).`);
        } else {
            // B. Exact Name/Symbol Match
            const nameMatch = pairs.find(p => p.baseToken.name.toLowerCase() === inputLower || p.baseToken.symbol.toLowerCase() === inputLower);
            if (nameMatch) {
                bestPair = nameMatch;
                logs.push(`> TARGET LOCKED VIA EXACT NAME/SYMBOL MATCH.`);
            } else {
                // C. Liquidity Fallback 
                const solanaPairs = pairs.filter(p => p.chainId === 'solana');
                const fallbackPool = solanaPairs.length > 0 ? solanaPairs : pairs;
                bestPair = fallbackPool.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
                logs.push(`> TARGET SELECTION: HIGHEST LIQUIDITY PAIR (${bestPair.chainId.toUpperCase()}).`);
            }
        }

        logs.push(`> TARGET IDENTIFIED: ${bestPair.baseToken.name} / ${bestPair.quoteToken.symbol}`);
        logs.push(`> CHAIN: ${bestPair.chainId.toUpperCase()} | PAIR: ${bestPair.pairAddress.slice(0, 6)}...`);

        // 3. PARALLEL ANALYSIS: Security API + Direct Chain Read
        logs.push(`> INITIATING DUAL-LAYER SECURITY SCAN...`);

        const securityPromise = securityService.checkTokenSecurity(bestPair.chainId, bestPair.baseToken.address);

        // Only run direct read for Solana
        let directReportPromise: Promise<DirectSecurityReport | null> = Promise.resolve(null);
        if (bestPair.chainId === 'solana') {
            logs.push(`> LAYER 2: DIRECT BLOCKCHAIN CONNECTION ESTABLISHED.`);
            directReportPromise = solanaService.generateSecurityReport(bestPair.baseToken.address);
        }

        const [security, directReport] = await Promise.all([securityPromise, directReportPromise]);

        if (security) logs.push(`> LAYER 1 (API): DATA RECEIVED.`);
        else logs.push(`> LAYER 1 (API): NO DATA.`);

        if (directReport && directReport.contractReadable) logs.push(`> LAYER 2 (DIRECT): CONTRACT METADATA EXTRACTED.`);

        // 4. Analyze with FULL Data
        return analyzeTokenData(bestPair, tokenInput, logs, security, directReport, language);
    }
};

function analyzeTokenData(pair: DexScreenerPair, tokenInput: string, existingLogs: string[], security: SecurityData | null, directReport: DirectSecurityReport | null, language: Locale): AnalysisResult {
    let score = 50; // Start neutral
    const logs: string[] = [...existingLogs];
    const isEs = language === 'es'; // Helper for brevity

    const findings: AnalysisResult['findings'] = {
        analyst: { id: "PENDING", level: "DEGEN", message: isEs ? "Analizando..." : "Analyzing...", details: "..." },
        sentinel: { id: "PENDING", level: "DEGEN", message: isEs ? "Analizando..." : "Analyzing...", details: "..." },
        shadow: { id: "PENDING", level: "DEGEN", message: isEs ? "Analizando..." : "Analyzing...", details: "..." }
    };

    // --- MEMECOIN SPECIALIST LOGIC ---

    // 1. ANALYST: Liquidity Check (The Foundation)
    const liquidity = pair.liquidity?.usd || 0;

    // --- NEW: CRASH DETECTION (ANTI-RUG) ---
    // If price dumped > 90% in 24h or > 50% in 1h, it's a RUG.
    const priceChange24h = pair.priceChange?.h24 || 0;
    const priceChange1h = pair.priceChange?.h1 || 0;

    if (priceChange24h < -90 || priceChange1h < -50) {
        return {
            score: 0,
            riskLevel: 'CRITICAL',
            verdict: "RUG PULL",
            findings: {
                analyst: {
                    id: "CRASH-DUMP",
                    level: "CRITICAL",
                    message: isEs ? "DUMP MASIVO DETECTADO" : "MASSIVE DUMP DETECTED",
                    details: isEs ? `Caída de ${priceChange24h.toFixed(1)}% en 24h.` : `Dropped ${priceChange24h.toFixed(1)}% in 24h.`
                },
                sentinel: {
                    id: "VOL-PANIC",
                    level: "CRITICAL",
                    message: isEs ? "VENTA DE PÁNICO" : "PANIC SELLING",
                    details: isEs ? "Presión de venta extrema." : "Extreme selling pressure."
                },
                shadow: {
                    id: "RUG-CONFIRMED",
                    level: "CRITICAL",
                    message: "RUG PULL",
                    details: isEs ? "El gráfico indica abandono total." : "Chart indicates total abandonment."
                }
            },
            logs: [...logs, `> ⚠️ CRITICAL ALERT: PRICE CRASHED ${priceChange24h}% IN 24H.`, "> VERDICT: RUG PULL DETECTED."],
            pairData: pair,
            securityData: security
        };
    }

    // GHOST TOKEN CHECK (Inactive Pump.fun coins) - Modified for Direct Read compatibility
    // If we have direct read flags, we are NOT a ghost in the sense of 'unknown', but maybe 'dead market'.
    if (liquidity < 100) {
        // If we have critical direct flags, return CRITICAL verdict immediately
        if (directReport && directReport.overallRisk === 'CRITICAL') {
            score = 0;
            // Let logic flow down or return early? 
            // Better to let logic flow but knowing liquidity is dead.
            // Actually, if liquidity is <100, we usually return early.
            // Let's modify the return object to include direct flags.
        } else {
            // Standard Ghost return
            return {
                score: 0,
                riskLevel: 'CRITICAL',
                verdict: dictionary[language].verdicts.ghost,
                findings: {
                    analyst: { id: "DEAD-LIQ", level: "CRITICAL", message: isEs ? "SIN LIQUIDEZ" : "NO LIQUIDITY", details: isEs ? `Pool vacío ($${liquidity}).` : `Pool is empty ($${liquidity}).` },
                    sentinel: { id: "DEAD-VOL", level: "CRITICAL", message: isEs ? "SIN VOLUMEN" : "NO VOLUME", details: isEs ? "Nadie está operando esto." : "No one is trading this." },
                    shadow: { id: "DEAD-CON", level: "CRITICAL", message: "ABANDONED", details: isEs ? "Proyecto parece abandonado." : "Project appears abandoned." }
                },
                logs: [...logs, "> VERDICT: GHOST TOKEN / ABANDONED."],
                pairData: pair,
                securityData: security
            };
        }
    }

    if (liquidity < 1000) {
        score -= 50;
        findings.analyst = {
            id: "LIQ-CRIT",
            level: "CRITICAL",
            message: isEs ? "VACÍO DE LIQUIDEZ" : "LIQUIDITY VACUUM",
            details: isEs ? `Liquidez es solo $${liquidity.toLocaleString()}. Muerto o Estafa.` : `Liquidity is only $${liquidity.toLocaleString()}. Dead or Scam.`
        };
    } else if (liquidity < 15000) {
        score -= 20;
        findings.analyst = {
            id: "LIQ-WARN",
            level: "DANGER",
            message: isEs ? "LIQUIDEZ BAJA" : "LOW LIQUIDITY",
            details: isEs ? `Liquidez ($${liquidity.toLocaleString()}) es baja.` : `Liquidity ($${liquidity.toLocaleString()}) is low.`
        };
    } else {
        score += 20;
        findings.analyst = {
            id: "LIQ-OK",
            level: "SAFE",
            message: isEs ? "LIQUIDEZ SALUDABLE" : "LIQUIDITY HEALTHY",
            details: isEs ? `Pool tiene $${liquidity.toLocaleString()} de profundidad.` : `Pool has $${liquidity.toLocaleString()} depth.`
        };
    }

    // 2. SENTINEL: Volatility & Bot Activity
    // 2. SENTINEL: Volatility & Bot Activity
    const volume = pair.volume?.h24 || 0;
    const volToLiq = liquidity > 0 ? volume / liquidity : 0;
    let isZombie = false;

    if (volToLiq > 10) {
        score -= 20;
        findings.sentinel = {
            id: "VOL-SUS",
            level: "DEGEN",
            message: isEs ? "ACTIVIDAD BOT" : "BOT ACTIVITY",
            details: isEs ? "Volumen > 10x Liquidez. Churn artificial." : "Volume > 10x Liquidity. Artificial churn."
        };
    } else if (volume === 0) {
        score -= 40;
        findings.sentinel = {
            id: "VOL-DEAD",
            level: "CRITICAL",
            message: isEs ? "MERCADO MUERTO" : "MARKET DEAD",
            details: isEs ? "Cero volumen en 24h." : "Zero volume in 24h."
        };
    } else if (volToLiq < 0.05 && (Date.now() - (pair.pairCreatedAt || 0)) > 86400000) {
        // ZOMBIE CHECK (Integrado aquí para evitar bonus de "Volumen Natural")
        // Si Vol/Liq < 5% y tiene más de 24 horas -> ZOMBIE
        isZombie = true;
        score -= 30;
        findings.sentinel = {
            id: "VOL-ZOMBIE",
            level: "DANGER",
            message: isEs ? "TOKEN ZOMBIE" : "ZOMBIE TOKEN",
            details: isEs ? "Volumen muerto (<5% Liq). Atrapado." : "Dead volume (<5% Liq). Trapped."
        };
    } else {
        score += 15;
        findings.sentinel = {
            id: "VOL-OK",
            level: "SAFE",
            message: isEs ? "VOLUMEN NATURAL" : "NATURAL VOLUME",
            details: isEs ? "Actividad de trading orgánica." : "Trading activity is organic."
        };
    }

    // 3. SHADOW: Age & Security (Merged with Audit Data)
    const ageHours = pair.pairCreatedAt ? (Date.now() - pair.pairCreatedAt) / (1000 * 60 * 60) : 0;

    // (Removed separate Zombie check from here)


    // Default Shadow Finding based on Age
    if (ageHours < 1) {
        score -= 40;
        findings.shadow = {
            id: "AGE-NEW",
            level: "CRITICAL",
            message: isEs ? "ZONA SNIPER" : "SNIPER ZONE",
            details: isEs ? `Token desplegado hace ${ageHours.toFixed(1)}h. Riesgo extremo.` : `Token deployed ${ageHours.toFixed(1)}h ago. Extreme risk.`
        };
    } else if (ageHours < 24) {
        score -= 10;
        findings.shadow = {
            id: "AGE-FRESH",
            level: "DANGER",
            message: isEs ? "LANZAMIENTO RECIENTE" : "FRESH LAUNCH",
            details: isEs ? "Menos de 24h de antigüedad." : "Less than 24h old."
        };
    } else {
        score += 15;
        findings.shadow = {
            id: "AGE-EST",
            level: "SAFE",
            message: isEs ? "ESTABLECIDO" : "ESTABLISHED",
            details: isEs ? `Edad del token: ${(ageHours / 24).toFixed(1)} días.` : `Token age: ${(ageHours / 24).toFixed(1)} days.`
        };
    }

    // --- REAL SECURITY OVERRIDES (The Firewall) ---
    // 1. API CHECKS
    if (security) {
        if (security.is_honeypot === "1") {
            score = 0;
            findings.shadow = { id: "HP-DETECTED", level: "CRITICAL", message: isEs ? "HONEYPOT DETECTADO" : "HONEYPOT DETECTED", details: isEs ? "API GoPlus: No se puede vender." : "GoPlus API: Cannot sell." };
            logs.push(`> SECURITY ALERT: HONEYPOT POSITIVE.`);
        }
        if (security.mintable === "1") {
            score = Math.min(score, 35);
            findings.shadow.level = 'CRITICAL';
            findings.shadow.message = isEs ? "RIESGO DE MINT" : "MINT RISK";
            findings.shadow.details += isEs ? " | MINT ACTIVO." : " | MINT ACTIVE.";
            logs.push(`> SECURITY ALERT: MINT AUTHORITY ENABLED. SCORE CAPPED.`);
        }
        // ... (Freezable / Mutable existing logic retained implicitly or re-added below if needed) ...
        // Re-adding for completeness to ensure no regression
        let isFreezable = false;
        if (typeof security.freezable === 'object' && security.freezable !== null && 'status' in security.freezable) {
            isFreezable = (security.freezable as any).status === "1";
        } else if (typeof security.freezable === 'string') {
            isFreezable = security.freezable === "1";
        }
        if (isFreezable) {
            score = Math.min(score, 30);
            findings.sentinel.level = 'CRITICAL';
            findings.sentinel.message = isEs ? "AUTORIDAD DE CONGELACIÓN" : "FREEZE AUTHORITY";
            findings.sentinel.details = isEs ? "Dev puede congelar." : "Dev can freeze.";
            logs.push(`> SECURITY ALERT: BLACKLIST/FREEZE AUTHORITY DETECTED.`);
        }
    } else {
        score -= 30;
        if (!directReport) { // Only penalize heavily if BOTH fail
            findings.shadow = { id: "SEC-UNKNOWN", level: "DANGER", message: isEs ? "SIN AUDITORÍA" : "NO AUDIT", details: isEs ? "Sin datos de seguridad." : "No security data." };
            logs.push(`> WARNING: UNVERIFIED CONTRACT. ASSUMING HIGH RISK.`);
        }
    }

    // 2. DIRECT READ OVERRIDES (THE NEW LAYER)
    if (directReport && directReport.contractReadable) {
        logs.push(`> ANALYZING DIRECT BLOCKCHAIN DATA...`);
        // Check for CRITICAL flags from Direct Report
        const criticalFlags = directReport.securityFlags.filter(f => f.severity === 'CRITICAL');

        if (criticalFlags.length > 0) {
            score = 0; // NUCLEAR OPTION

            criticalFlags.forEach(flag => {
                logs.push(`> 🔴 DIRECT HIT: ${flag.flag} DETECTED ON-CHAIN.`);

                // Override Shadow Finding with this absolute truth
                findings.shadow = {
                    id: `DIRECT-${flag.code}`,
                    level: 'CRITICAL',
                    message: isEs ? `⚠️ ${flag.flag.replace('_', ' ')}` : `⚠️ ${flag.flag.replace('_', ' ')}`,
                    details: flag.description
                };
            });

            // Also update Analyst/Sentinel if applicable
            // If Zero Supply -> Analyst
            if (criticalFlags.some(f => f.flag === 'ZERO_SUPPLY')) {
                findings.analyst = { id: "ZERO-SUPPLY", level: "CRITICAL", message: "ZERO SUPPLY", details: "Token has 0 supply." };
            }
            // If Freeze -> Sentinel (override API)
            if (criticalFlags.some(f => f.flag === 'FREEZE_AUTH_ENABLED')) {
                findings.sentinel = { id: "DIRECT-FREEZE", level: "CRITICAL", message: "FREEZE ENABLED", details: isEs ? "Autoridad de congelación CONFIRMADA on-chain." : "Freeze Authority CONFIRMED on-chain." };
            }

        } else {
            logs.push(`> DIRECT SCAN PASSED: NO CRITICAL FLAGS.`);
            // Bonus for verifiable contract
            score += 10;
        }
    }

    // Final Verdict Logic
    let verdict = "NEUTRAL";
    let riskLevel: RiskLevel = "DEGEN";

    // Force CAPS based on Critical Flags & ZOMBIE Status
    if (security?.is_honeypot === "1") score = 0;
    if (directReport?.overallRisk === 'CRITICAL') score = 0;
    if (isZombie) {
        score = Math.min(score, 55); // HARD CAP FOR ZOMBIES. Never Safe.
        logs.push(`> RISK ADJUSTMENT: ZOMBIE STATUS CAPPED SCORE AT 55.`);
    }

    if (score >= 90) { verdict = dictionary[language].verdicts.elite; riskLevel = "ELITE"; }
    else if (score >= 70) { verdict = dictionary[language].verdicts.safe; riskLevel = "SAFE"; }
    else if (score >= 40) { verdict = dictionary[language].verdicts.degen; riskLevel = "DEGEN"; }
    else if (score >= 20) { verdict = dictionary[language].verdicts.danger; riskLevel = "DANGER"; }
    else { verdict = dictionary[language].verdicts.critical; riskLevel = "CRITICAL"; }

    // Double Check Critical Overrides
    if (security?.is_honeypot === "1") riskLevel = "CRITICAL";
    if (directReport?.overallRisk === 'CRITICAL') riskLevel = "CRITICAL";

    logs.push(`> ANALYSIS FINALIZED. SCORE: ${Math.max(0, Math.min(100, Math.floor(score)))}/100`);

    return {
        score: Math.max(0, Math.min(100, Math.floor(score))),
        riskLevel,
        verdict,
        findings,
        logs,
        pairData: pair,
        securityData: security
    };
}

