
import { AnalysisResult, RiskLevel } from './nexus-types';
import { DexScreenerPair, dexscreener } from '../services/dexscreener';
import { securityService, SecurityData } from '../services/security';
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
            logs.push("> ERROR: TOKEN NOT FOUND ON-CHAIN.");
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
                pairData: undefined,
                securityData: null
            };
        }

        // 2. SMART PAIR SELECTION (Solana > Address > Name > Liquidity)
        // PRIORITIZE SOLANA
        pairs.sort((a, b) => {
            if (a.chainId === 'solana' && b.chainId !== 'solana') return -1;
            if (a.chainId !== 'solana' && b.chainId === 'solana') return 1;
            return 0; // Keep original order (usually liquidity)
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
                // C. Liquidity Fallback (Highest USD Liquidity) - BUT respecting Solana sort if possible?
                // Actually, if we sorted by Solana first, pairs[0] is already the best Solana liquid pair if no exact match.
                // But let's refine: if no name match, maybe we want the highest liquidity SOLANA pair.
                // The sort above puts ALL Solana pairs first. 
                // So if we just take pairs[0] here (which is what happens if no matches found below?), we are good.
                // But the logic below re-sorts by liquidity for the fallback 'C'.

                // Let's filter for Solana first for the fallback
                const solanaPairs = pairs.filter(p => p.chainId === 'solana');
                const fallbackPool = solanaPairs.length > 0 ? solanaPairs : pairs;

                bestPair = fallbackPool.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
                logs.push(`> TARGET SELECTION: HIGHEST LIQUIDITY PAIR (${bestPair.chainId.toUpperCase()}).`);
            }
        }

        logs.push(`> TARGET IDENTIFIED: ${bestPair.baseToken.name} / ${bestPair.quoteToken.symbol}`);
        logs.push(`> CHAIN: ${bestPair.chainId.toUpperCase()} | PAIR: ${bestPair.pairAddress.slice(0, 6)}...`);

        // 2. Fetch Security Data (Audit)
        logs.push(`> INITIATING SECURITY PROTOCOL (GoPlus)...`);
        const security = await securityService.checkTokenSecurity(bestPair.chainId, bestPair.pairAddress);

        if (security) {
            logs.push(`> SECURITY DATA RECEIVED. PARSING...`);
        } else {
            logs.push(`> WARNING: SECURITY AUDIT FAILED / TIMEOUT.`);
        }

        // 3. Analyze with FULL Data
        return analyzeTokenData(bestPair, tokenInput, logs, security, language);
    }
};

function analyzeTokenData(pair: DexScreenerPair, tokenInput: string, existingLogs: string[], security: SecurityData | null, language: Locale): AnalysisResult {
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

    // GHOST TOKEN CHECK (Inactive Pump.fun coins)
    if (liquidity < 100) {
        return {
            score: 0,
            riskLevel: 'CRITICAL',
            verdict: dictionary[language].verdicts.ghost,
            findings: {
                analyst: { id: "DEAD-LIQ", level: "CRITICAL", message: isEs ? "SIN LIQUIDEZ" : "NO LIQUIDITY", details: isEs ? `Pool vacío ($${liquidity}). Token muerto.` : `Pool is empty ($${liquidity}). Token is dead.` },
                sentinel: { id: "DEAD-VOL", level: "CRITICAL", message: isEs ? "SIN VOLUMEN" : "NO VOLUME", details: isEs ? "Nadie está operando esto." : "No one is trading this." },
                shadow: { id: "DEAD-CON", level: "CRITICAL", message: "ABANDONED", details: isEs ? "Proyecto parece abandonado." : "Project appears abandoned." }
            },
            logs: [...logs, "> CRITICAL: ZERO LIQUIDITY DETECTED.", "> VERDICT: GHOST TOKEN."],
            pairData: pair,
            securityData: security
        };
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
            details: isEs ? `Liquidez ($${liquidity.toLocaleString()}) es baja. Alto riesgo de slippage.` : `Liquidity ($${liquidity.toLocaleString()}) is low. High slippage risk.`
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
    const volume = pair.volume?.h24 || 0;
    const volToLiq = liquidity > 0 ? volume / liquidity : 0;

    if (volToLiq > 10) {
        score -= 20;
        findings.sentinel = {
            id: "VOL-SUS",
            level: "DEGEN",
            message: isEs ? "ACTIVIDAD BOT" : "BOT ACTIVITY",
            details: isEs ? "Volumen > 10x Liquidez. Churn artificial detectado." : "Volume > 10x Liquidity. Artificial churn detected."
        };
    } else if (volume === 0) {
        score -= 40;
        findings.sentinel = {
            id: "VOL-DEAD",
            level: "CRITICAL",
            message: isEs ? "MERCADO MUERTO" : "MARKET DEAD",
            details: isEs ? "Cero volumen en 24h." : "Zero volume in 24h."
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
    if (security) {
        // Honeypot Check
        if (security.is_honeypot === "1") {
            score = 0;
            findings.shadow = {
                id: "HP-DETECTED",
                level: "CRITICAL",
                message: isEs ? "HONEYPOT DETECTADO" : "HONEYPOT DETECTED",
                details: isEs ? "Confirmado por API GoPlus: No se puede vender." : "GoPlus API confirmed: Token cannot be sold."
            };
            logs.push(`> SECURITY ALERT: HONEYPOT POSITIVE.`);
        }

        // Mint Authority Check
        if (security.mintable === "1") {
            score -= 50;
            findings.shadow.details += isEs ? " | ALERTA: MINT ACTIVO." : " | WARNING: MINT AUTH ENABLED.";
            // Force critical if safe previously
            if (findings.shadow.level === 'SAFE') {
                findings.shadow.level = 'CRITICAL';
                findings.shadow.message = isEs ? "RIESGO DE MINT" : "MINT RISK";
            }
            logs.push(`> SECURITY ALERT: MINT AUTHORITY ENABLED.`);
        }

        // Holder Analysis
        // (Just logging it, the UI will display the grid)
        logs.push(`> HOLDERS: TOP 10 OWN ${(parseFloat(security.top_holders?.[0]?.percent || "0") * 10).toFixed(0)}% (Est).`);
    }

    // Final Verdict Logic
    let verdict = "NEUTRAL";
    let riskLevel: RiskLevel = "DEGEN"; // Default middle ground

    if (score >= 90) {
        verdict = dictionary[language].verdicts.elite;
        riskLevel = "ELITE";
    } else if (score >= 70) {
        verdict = dictionary[language].verdicts.safe;
        riskLevel = "SAFE";
    } else if (score >= 40) {
        verdict = dictionary[language].verdicts.degen;
        riskLevel = "DEGEN";
    } else if (score >= 20) {
        verdict = dictionary[language].verdicts.danger;
        riskLevel = "DANGER";
    } else {
        verdict = dictionary[language].verdicts.critical;
        riskLevel = "CRITICAL";
    }

    // Agent findings overrides based on severe issues
    if (security?.is_honeypot === "1") riskLevel = "CRITICAL";
    if (security?.mintable === "1" && riskLevel !== "CRITICAL") riskLevel = "DANGER";

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

