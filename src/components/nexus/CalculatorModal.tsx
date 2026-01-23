import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CalculatorModal({ isOpen, onClose }: CalculatorModalProps) {
    const { language, t } = useLanguage();

    // States
    const [investment, setInvestment] = useState<string>('100'); // USD
    const [entryPrice, setEntryPrice] = useState<string>('');
    const [currentPrice, setCurrentPrice] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [percentage, setPercentage] = useState<number | null>(null);

    // Calculate whenever inputs change
    useEffect(() => {
        calculatePnL();
    }, [investment, entryPrice, currentPrice]);

    const calculatePnL = () => {
        const inv = parseFloat(investment);
        const entry = parseFloat(entryPrice);
        const current = parseFloat(currentPrice);

        if (inv > 0 && entry > 0 && current >= 0) {
            const tokenAmount = inv / entry;
            const currentValue = tokenAmount * current;
            const profit = currentValue - inv;
            const percent = ((current - entry) / entry) * 100;

            setResult(profit);
            setPercentage(percent);
        } else {
            setResult(null);
            setPercentage(null);
        }
    };

    if (!isOpen) return null;

    const isEs = language === 'es';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-zinc-900 border border-green-500/30 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.1)] overflow-hidden flex flex-col font-mono"
                >
                    {/* Header */}
                    <div className="p-4 bg-black/50 border-b border-green-500/20 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-green-400">
                            <Calculator size={20} />
                            <h3 className="font-bold tracking-widest">
                                {isEs ? 'CALCULADORA P&L' : 'P&L CALCULATOR'}
                            </h3>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">

                        {/* INPUTS */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                                    {isEs ? 'Inversión Inicial ($)' : 'Initial Investment ($)'}
                                </label>
                                <input
                                    type="number"
                                    value={investment}
                                    onChange={(e) => setInvestment(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-lg focus:border-green-500 focus:outline-none"
                                    placeholder="100"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                                        {isEs ? 'Precio Entrada' : 'Entry Price'}
                                    </label>
                                    <input
                                        type="number"
                                        value={entryPrice}
                                        onChange={(e) => setEntryPrice(e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none"
                                        placeholder="0.0001"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                                        {isEs ? 'Precio Actual/Salida' : 'Exit Price'}
                                    </label>
                                    <input
                                        type="number"
                                        value={currentPrice}
                                        onChange={(e) => setCurrentPrice(e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none"
                                        placeholder="0.0002"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RESULT DISPLAY */}
                        <div className={`mt-6 p-6 rounded-xl border-2 flex flex-col items-center justify-center transition-colors ${result === null ? 'border-dashed border-white/10 bg-white/5' :
                                result >= 0 ? 'border-green-500/50 bg-green-500/10' :
                                    'border-red-500/50 bg-red-500/10'
                            }`}>
                            {result === null ? (
                                <p className="text-xs text-gray-500 text-center">
                                    {isEs ? 'Introduce precios para calcular' : 'Enter prices to calculate'}
                                </p>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        {result >= 0 ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />}
                                        <span className={`text-3xl font-bold ${result >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                                            {result >= 0 ? '+' : ''}{result.toFixed(2)}$
                                        </span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${result >= 0 ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                                        {percentage && percentage >= 0 ? '+' : ''}{percentage?.toFixed(2)}%
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
                                        {isEs ? ' Valor Total Cartera: ' : 'Total Portfolio Value: '}
                                        <span className="text-white font-bold">
                                            ${(parseFloat(investment) + result).toFixed(2)}
                                        </span>
                                    </p>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => { setEntryPrice(''); setCurrentPrice(''); setResult(null); }}
                            className="w-full py-2 text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCcw size={12} /> {isEs ? 'Reiniciar' : 'Reset'}
                        </button>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
