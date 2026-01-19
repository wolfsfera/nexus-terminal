import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, BookOpen, Skull, Zap, ShieldAlert, BadgeCheck } from 'lucide-react';
import { ACADEMY_DATA, TermLevel } from '@/lib/nexus-academy-data';

interface AcademyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AcademyModal({ isOpen, onClose }: AcademyModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<TermLevel | 'ALL'>('ALL');

    if (!isOpen) return null;

    const filteredData = ACADEMY_DATA.filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.definition.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'ALL' || item.level === activeTab;
        return matchesSearch && matchesTab;
    });

    const getTabIcon = (level: TermLevel | 'ALL') => {
        switch (level) {
            case 'ALL': return <Search size={14} />;
            case 'ROOKIE': return <BookOpen size={14} />;
            case 'DEGEN': return <Zap size={14} />;
            case 'DANGER': return <Skull size={14} />;
            case 'TECH': return <ShieldAlert size={14} />;
        }
    };

    const getLevelColor = (level: TermLevel) => {
        switch (level) {
            case 'ROOKIE': return 'text-green-400 border-green-500/30 bg-green-500/10';
            case 'DEGEN': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
            case 'DANGER': return 'text-red-500 border-red-500/30 bg-red-500/10';
            case 'TECH': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl h-[80vh] bg-black border border-gold-primary/30 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.1)] overflow-hidden flex flex-col"
                >
                    {/* HEADER */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gold-primary/10 rounded-lg border border-gold-primary/30">
                                <BookOpen className="text-gold-primary" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide font-header">
                                    WOLFSFERA <span className="text-gold-primary">ACADEMY</span>
                                </h2>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Knowledge is Profit</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* CONTROLS */}
                    <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 bg-black/50">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar término (ej: Rug Pull)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-gold-primary/50 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {(['ALL', 'ROOKIE', 'DEGEN', 'DANGER', 'TECH'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${activeTab === tab
                                            ? 'bg-gold-primary text-black border-gold-primary'
                                            : 'bg-zinc-900 text-gray-500 border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {getTabIcon(tab)}
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CONTENT GRID */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gold-primary/20 scrollbar-track-transparent">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layoutId={item.id}
                                        className={`p-5 rounded-xl border flex flex-col gap-2 relative group hover:scale-[1.01] transition-transform duration-200 ${getLevelColor(item.level)}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-white font-mono">{item.term}</h3>
                                            <span className="text-[10px] font-black opacity-50 border border-current px-2 py-0.5 rounded uppercase">
                                                {item.level}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {item.definition}
                                        </p>

                                        {item.example && (
                                            <div className="mt-2 p-3 bg-black/30 rounded border border-white/5 text-xs text-gray-400 italic font-serif">
                                                {item.example}
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center">
                                    <Search size={48} className="mb-4 opacity-20" />
                                    <p>No se encontraron términos para "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="p-4 border-t border-white/10 bg-zinc-900/50 text-center">
                        <p className="text-[10px] text-gray-500">
                            © 2024 Wolfsfera Academy. Aprende antes de invertir.
                        </p>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}
