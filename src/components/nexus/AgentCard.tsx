"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShieldCheck, Activity, Zap, AlertTriangle, XCircle, Play } from 'lucide-react';
import { AgentFindings } from '@/lib/nexus-types';

interface AgentCardProps {
    name: string;
    role: string;
    image: string;
    id: string;
    price: string;
    status: 'idle' | 'analyzing' | 'complete';
    finding?: AgentFindings;
}

export default function AgentCard({ name, role, image, id, price, status, finding }: AgentCardProps) {

    // Determine status color and icon based on finding
    const getStatusConfig = () => {
        if (status === 'analyzing') return { color: 'bg-yellow-400', textColor: 'text-yellow-400', icon: <Activity size={14} className="animate-pulse" /> };
        if (status === 'idle') return { color: 'bg-gray-500', textColor: 'text-gray-400', icon: <div className="w-2 h-2 rounded-full bg-gray-500" /> };

        // Complete state
        switch (finding?.level) {
            case 'ELITE': return { color: 'bg-purple-500', textColor: 'text-purple-400', icon: <Play size={14} /> }; // Play/Star icon
            case 'SAFE': return { color: 'bg-green-500', textColor: 'text-green-400', icon: <ShieldCheck size={14} /> };
            case 'DEGEN': return { color: 'bg-yellow-500', textColor: 'text-yellow-400', icon: <AlertTriangle size={14} /> };
            case 'DANGER': return { color: 'bg-orange-500', textColor: 'text-orange-500', icon: <AlertTriangle size={14} /> };
            case 'CRITICAL': return { color: 'bg-red-500', textColor: 'text-red-500', icon: <XCircle size={14} /> };
            default: return { color: 'bg-gray-500', textColor: 'text-gray-400', icon: <ShieldCheck size={14} /> };
        }
    };

    const config = getStatusConfig();
    const isAnalyzing = status === 'analyzing';
    const isPulse = finding?.level === 'CRITICAL' || finding?.level === 'DANGER';

    return (
        <motion.div
            whileHover={{ scale: 1.02, borderColor: '#D4AF37' }}
            className={`relative p-4 rounded-2xl border transition-colors duration-300 ${isAnalyzing ? 'border-gold-primary animate-pulse' :
                finding?.level === 'CRITICAL' ? 'border-red-500/50 bg-red-950/20' :
                    finding?.level === 'DANGER' ? 'border-orange-500/50 bg-orange-950/20' :
                        finding?.level === 'DEGEN' ? 'border-yellow-500/50 bg-yellow-950/20' :
                            finding?.level === 'SAFE' ? 'border-green-500/50 bg-green-950/20' :
                                finding?.level === 'ELITE' ? 'border-purple-500/50 bg-purple-950/20' :
                                    'border-white/10 bg-black/40'
                } backdrop-blur-xl overflow-hidden group`}
        >
            {/* Background Tech Elements */}
            <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full -mr-4 -mt-4 transition-all opacity-20 ${finding?.level === 'CRITICAL' ? 'bg-red-500' : 'bg-gold-primary'}`}></div>

            <div className="flex items-start gap-3 relative z-10">
                {/* Avatar */}
                <div className={`relative w-12 h-12 rounded-lg overflow-hidden border shadow-lg ${finding?.level === 'CRITICAL' ? 'border-red-500' : 'border-white/20'
                    }`}>
                    <Image src={image} alt={name} fill className="object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-bold text-white leading-none mb-1">{name}</h3>
                            <p className="text-[10px] text-gold-primary font-mono tracking-wider truncate">{role}</p>
                        </div>
                        <div className={config.textColor}>
                            {config.icon}
                        </div>
                    </div>

                    {/* Findings or ID */}
                    <div className="mt-2">
                        {status === 'complete' && finding ? (
                            <p className={`text-xs font-bold ${config.textColor} animate-in fade-in slide-in-from-left-2 duration-500`}>
                                {finding.message}
                            </p>
                        ) : (
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                <span>ID: {id.substring(0, 8)}...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Bar (if analyzing) */}
            {isAnalyzing && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "linear" }}
                        className="h-full bg-gold-primary shadow-[0_0_10px_#D4AF37]"
                    />
                </div>
            )}
        </motion.div>
    );
}
