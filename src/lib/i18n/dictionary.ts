export type Locale = 'es' | 'en';

export const dictionary = {
    es: {
        ui: {
            title: "SOLANA INTELLIGENCE",
            subtitle: "TERMINAL DE MEMECOINS",
            placeholder: "BUSCAR (NOMBRE / CONTRACT ADDRESS)...",
            search_tip: "💡 CONSEJO: Para 100% de precisión, usa el Contract Address (CA).",
            analyze_btn: "ESCANEAR SOLANA",
            analyzing: "SINTONIZANDO...",
            manual_btn: "MANUAL",
            logs_title: "REGISTRO DEL SISTEMA EN TIEMPO REAL",
            footer: "NEXUS-OS v3.4 | NODO: WOLF-MAINNET | SEGURIDAD: ACTIVA",
            loading_agents: "INICIALIZANDO AGENTES...",
            waiting_input: "ESPERANDO OBJETIVO...",
            verdict_label: "VEREDICTO DE INTELIGENCIA",
            nexus_score: "PUNTUACIÓN NEXUS",
            view_chart: "VER GRÁFICO",
            firewall_title: "SISTEMA PROTEGIDO",
            close: "CERRAR",
            risk_levels: {
                elite: "ELITE",
                safe: "SEGURO",
                degen: "DEGEN",
                danger: "PELIGRO",
                critical: "CRÍTICO"
            }
        },
        agents: {
            analyst: {
                name: "THE ANALYST",
                role: "ORÁCULO DE LIQUIDEZ"
            },
            sentinel: {
                name: "THE SENTINEL",
                role: "VOLATILIDAD DE MERCADO"
            },
            shadow: {
                name: "THE SHADOW",
                role: "HISTORIAL ON-CHAIN"
            }
        },
        links: {
            explorer: "EXPLORADOR DE BLOQUES",
            rugcheck: "AUDITORÍA EXT.",
            twitter: "BÚSQUEDA SOCIAL"
        },
        verdicts: {
            elite: "💎 JOYA ELITE DETECTADA 💎",
            safe: "ZONA DE ENTRADA SEGURA",
            degen: "JUGADA DEGEN (ALTO RIESGO)",
            danger: "PELIGRO - BANDERAS ROJAS",
            critical: "ESTAFA / RUG PULL",
            ghost: "NO INDEXADO / FANTASMA",
            neutral: "NEUTRAL"
        },
        descriptions: {
            elite: "ESTATUS ELITE. Todos los sistemas nominales. Indicadores raros de alta calidad detectados.",
            safe: "El consenso indica legitimidad. Condiciones de entrada al mercado estándar cumplidas.",
            degen: "Alto riesgo / alta recompensa. Apto solo para traders experimentados en volatilidad.",
            danger: "Banderas rojas significativas detectadas. Problemas de contrato o liquidez. Proceda con extrema precaución.",
            critical: "FALLO CRÍTICO. Múltiples agentes reportan fallos fatales (Honeypot, Riesgo de Rug). PROHIBIDO."
        },
        report: {
            title: "REPORTE DE SEGURIDAD NEXUS",
            case_id: "ID CASO",
            target: "OBJETIVO",
            time: "HORA",
            security_header: "ESCANEO FIREWALL DE SEGURIDAD",
            swarm_header: "CONSENSO DEL ENJAMBRE",
            uplink_header: "ENLACE DE INTELIGENCIA EXTERNA",
            verdict_header: "VEREDICTO DE INTELIGENCIA",
            score_label: "PUNTUACIÓN NEXUS",
            disclaimer_title: "DESCARGO DE RESPONSABILIDAD:",
            disclaimer_text: "Este reporte es generado por un sistema de IA automatizado ('Wolfsfera Nexus'). NO constituye asesoramiento financiero. Las memecoins son extremadamente volátiles. El estado 'Seguro' no garantiza inmunidad ante estafas. TÚ ERES RESPONSABLE DE TUS PROPIAS OPERACIONES.",
            security_error: "CONEXIÓN DE SEGURIDAD EN ESPERA (POSIBLE PROTECCIÓN ANTI-BOT O RED SATURADA). ESTO NO IMPLICA RIESGO, SOLO AUSENCIA DE DATOS.",
            firewall: {
                honeypot: "VERIFICACIÓN HONEYPOT",
                mint: "AUTORIDAD DE MINT",
                holders: "CONCENTRACIÓN HOLDERS",
                honeypot_safe: "Token parece comerciable. No se detectó código honeypot.",
                honeypot_danger: "CRÍTICO: ¡El token no se puede vender! Honeypot detected.",
                mint_disabled: "Función de mint desactivada o renunciada.",
                mint_enabled: "PELIGRO: El Dev puede imprimir tokens infinitos.",
                holders_safe: "La distribución parece saludable.",
                holders_danger: "Ballenas controlan > 50% of supply. High dump risk."
            }
        }
    },
    en: {
        ui: {
            title: "SOLANA INTELLIGENCE",
            subtitle: "MEMECOIN TERMINAL",
            placeholder: "SEARCH (NAME / CONTRACT ADDRESS)...",
            search_tip: "💡 PRO TIP: For 100% accuracy, use Contract Address (CA).",
            analyze_btn: "SCAN SOLANA",
            analyzing: "TUNING IN...",
            manual_btn: "MANUAL",
            logs_title: "REAL-TIME SYSTEM LOGS",
            footer: "NEXUS-OS v3.4 | NODE: WOLF-MAINNET | SECURITY: ACTIVE",
            loading_agents: "INITIALIZING AGENTS...",
            waiting_input: "AWAITING TARGET...",
            verdict_label: "INTELLIGENCE VERDICT",
            nexus_score: "NEXUS SCORE",
            view_chart: "LIVE CHART",
            firewall_title: "SYSTEM SECURED",
            close: "CLOSE",
            risk_levels: {
                elite: "ELITE",
                safe: "SAFE",
                degen: "DEGEN",
                danger: "DANGER",
                critical: "CRITICAL"
            }
        },
        agents: {
            analyst: {
                name: "THE ANALYST",
                role: "LIQUIDITY ORACLE"
            },
            sentinel: {
                name: "THE SENTINEL",
                role: "MARKET VOLATILITY"
            },
            shadow: {
                name: "THE SHADOW",
                role: "ON-CHAIN HISTORY"
            }
        },
        links: {
            explorer: "BLOCK EXPLORER",
            rugcheck: "EXT. AUDIT",
            twitter: "SOCIAL SEARCH"
        },
        verdicts: {
            elite: "💎 ELITE GEM DETECTED 💎",
            safe: "SAFE - ENTRY ZONE",
            degen: "DEGEN PLAY (HIGH RISK)",
            danger: "DANGER - RED FLAGS",
            critical: "SCAM / RUG PULL",
            ghost: "NOT INDEXED / GHOST",
            neutral: "NEUTRAL"
        },
        descriptions: {
            elite: "ELITE STATUS. All systems nominal. Rare indicators of high quality detected.",
            safe: "Consensus indicates legitimacy. Standard market entry conditions met.",
            degen: "High risk / high reward environment. Suitable for experienced volatility traders only.",
            danger: "Significant red flags detected. Smart contract or liquidity issues present. Proceed with extreme caution.",
            critical: "CRITICAL FAILURE. Multiple agents report fatal flaws (Honeypot, Rug Risk). PROHIBITED."
        },
        report: {
            title: "NEXUS SECURITY REPORT",
            case_id: "CASE ID",
            target: "TARGET",
            time: "TIME",
            security_header: "SECURITY FIREWALL SCAN",
            swarm_header: "SWARM CONSENSUS",
            uplink_header: "EXTERNAL INTELLIGENCE UPLINK",
            verdict_header: "INTELLIGENCE VERDICT",
            score_label: "NEXUS SCORE",
            disclaimer_title: "DISCLAIMER & LIABILITY WAIVER:",
            disclaimer_text: "This report is generated by an automated AI system ('Wolfsfera Nexus'). It does NOT constitute financial advice. Memecoins are extremely volatile. 'Safe' status does not guarantee immunity to rugs. YOU ARE RESPONSIBLE FOR YOUR OWN TRADES.",
            security_error: "SECURITY DATA UNAVAILABLE (AUDIT API TIMEOUT OR UNSUPPORTED CHAIN)",
            firewall: {
                honeypot: "HONEYPOT CHECK",
                mint: "MINT AUTHORITY",
                holders: "HOLDER CONCENTRATION",
                honeypot_safe: "Token is likely tradeable. No honeypot code found.",
                honeypot_danger: "CRITICAL: Token cannot be sold! Honeypot detected.",
                mint_disabled: "Mint function is disabled or renounced.",
                mint_enabled: "DANGER: Dev can mint infinite tokens and dump on you.",
                holders_safe: "Distribution looks healthy.",
                holders_danger: "Whales control > 50% of supply. High dump risk."
            }
        }
    }
};
