import { DexScreenerPair } from '@/services/dexscreener';
import { SecurityData } from '@/services/security';

export type RiskLevel = 'ELITE' | 'SAFE' | 'DEGEN' | 'DANGER' | 'CRITICAL';

export interface AgentFindings {
    id: string;
    level: RiskLevel;
    message: string;
    details: string;
}

export interface AnalysisResult {
    score: number;
    riskLevel: RiskLevel;
    verdict: string;
    findings: {
        analyst: AgentFindings;
        sentinel: AgentFindings;
        shadow: AgentFindings;
    };
    logs: string[];
    pairData?: DexScreenerPair;
    securityData?: SecurityData | null;
}
