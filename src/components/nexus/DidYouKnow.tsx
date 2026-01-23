import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const FACTS = [
    {
        es: "El 95% de los nuevos tokens en Solana mueren en las primeras 24 horas. La paciencia es tu mejor activo.",
        en: "95% of new Solana tokens die within the first 24 hours. Patience is your best asset."
    },
    {
        es: "Un 'Honeypot' permite comprar pero bloquea la venta. Siempre verifica el código antes de invertir.",
        en: "A 'Honeypot' allows buying but blocks selling. Always verify the code before investing."
    },
    {
        es: "El volumen es clave: Si el precio sube pero el volumen baja, es probable que sea una trampa.",
        en: "Volume is key: If price goes up but volume goes down, it's likely a trap."
    },
    {
        es: "Nunca inviertas dinero que necesites para vivir. El mercado meme es un casino, no un banco.",
        en: "Never invest money you need for living. The meme market is a casino, not a bank."
    },
    {
        es: "Revocar permisos: Usa herramientas como Solrevoke para evitar que contratos viejos drenen tu wallet.",
        en: "Revoke permissions: Use tools like Solrevoke to prevent old contracts from draining your wallet."
    },
    {
        es: "¿Sabías que? Muchos devs usan múltiples wallets para simular volumen falso y atraer compradores.",
        en: "Did you know? Many devs use multiple wallets to simulate fake volume and lure buyers."
    }
];

export default function DidYouKnow() {
    const { language } = useLanguage();
    const [index, setIndex] = useState(0);

    // Auto-rotate every 15 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            nextFact();
        }, 15000);
        return () => clearInterval(timer);
    }, [index]);

    const nextFact = () => {
        setIndex((prev) => (prev + 1) % FACTS.length);
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md group-hover:blur-lg transition-all opacity-50"></div>

            <div className="relative bg-black/40 border border-white/10 rounded-xl p-4 flex gap-4 items-center backdrop-blur-sm hover:border-white/20 transition-colors">

                {/* ICON */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                    <Lightbulb className="text-blue-400" size={20} />
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        {language === 'es' ? '¿SABÍAS QUÉ?' : 'DID YOU KNOW?'}
                        <span className="text-[8px] bg-white/10 px-1 rounded text-gray-500">#{index + 1}</span>
                    </h4>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-xs md:text-sm text-gray-200 font-mono leading-relaxed"
                        >
                            {language === 'es' ? FACTS[index].es : FACTS[index].en}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* NEXT BTN */}
                <button
                    onClick={nextFact}
                    className="shrink-0 p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
