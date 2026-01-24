import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ACADEMY_DATA, AcademyTerm, TermLevel } from '@/lib/nexus-academy-data';
import { FaBookOpen, FaExclamationTriangle, FaShieldAlt, FaRocket, FaGraduationCap } from 'react-icons/fa';

export const metadata: Metadata = {
    title: 'Glosario Crypto | Nexus Academy',
    description: 'Diccionario completo de términos crypto, memecoins y seguridad en Solana. Aprende qué es un Rug Pull, Honeypot, Mint Authority y más.',
    keywords: ['Diccionario Crypto', 'Glosario Solana', 'Que es un Rug Pull', 'Honeypot Significado', 'Mint Authority', 'Aprender Crypto'],
    openGraph: {
        title: 'Nexus Academy - Glosario Crypto Definitivo',
        description: 'Domina la jerga de Solana y Pump.fun. Aprende a detectar estafas y hablar como un experto.',
        type: 'article',
    }
};

const LevelIcon = ({ level }: { level: TermLevel }) => {
    switch (level) {
        case 'ROOKIE': return <FaGraduationCap className="text-green-400" />;
        case 'DEGEN': return <FaRocket className="text-purple-400" />;
        case 'DANGER': return <FaExclamationTriangle className="text-red-500" />;
        case 'TECH': return <FaShieldAlt className="text-blue-400" />;
        default: return <FaBookOpen className="text-gray-400" />;
    }
};

const LevelBadge = ({ level }: { level: TermLevel }) => {
    const colors = {
        'ROOKIE': 'bg-green-500/20 text-green-300 border-green-500/50',
        'DEGEN': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
        'DANGER': 'bg-red-500/20 text-red-300 border-red-500/50',
        'TECH': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${colors[level]}`}>
            {level}
        </span>
    );
};

export default function AcademyPage() {
    // Group terms by Level for better structure
    const groupedTerms: Record<string, AcademyTerm[]> = {
        'ROOKIE': ACADEMY_DATA.filter(t => t.level === 'ROOKIE'),
        'DEGEN': ACADEMY_DATA.filter(t => t.level === 'DEGEN'),
        'DANGER': ACADEMY_DATA.filter(t => t.level === 'DANGER'),
        'TECH': ACADEMY_DATA.filter(t => t.level === 'TECH'),
    };

    const sectionTitles = {
        'ROOKIE': 'Conceptos Básicos (Rookie)',
        'DEGEN': 'Jerga de la Calle (Degen Slang)',
        'DANGER': 'Peligros y Estafas (Danger Zone)',
        'TECH': 'Técnico y Seguridad (Tech)',
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-mono selection:bg-cyan-500/30">
            {/* Header */}
            <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <img src="/images/nexus/logo-retro.png" alt="Nexus Logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            NEXUS ACADEMY
                        </span>
                    </Link>
                    <Link href="/" className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors">
                        ← Volver al Terminal
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">

                {/* Intro Hero */}
                <section className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        Diccionario Crypto y Anti-Estafas
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Domina el lenguaje de Solana. Aprende a distinguir una gema de una trampa mortal.
                        Este glosario es tu manual de supervivencia en la jungla DeFi.
                    </p>
                </section>

                {/* Terms List */}
                <div className="space-y-12">
                    {(Object.keys(groupedTerms) as TermLevel[]).map((level) => (
                        <section key={level} id={level.toLowerCase()} className="scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                                <LevelIcon level={level} />
                                <h2 className="text-2xl font-bold text-white">
                                    {sectionTitles[level] || level}
                                </h2>
                            </div>

                            <div className="grid gap-4 md:grid-cols-1">
                                {groupedTerms[level].map((item) => (
                                    <article
                                        key={item.id}
                                        className="group bg-white/5 border border-white/5 hover:border-cyan-500/30 rounded-lg p-6 transition-all hover:bg-white/[0.07]"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-cyan-300 group-hover:text-cyan-200">
                                                {item.term}
                                            </h3>
                                            <LevelBadge level={item.level} />
                                        </div>

                                        <p className="text-slate-300 leading-relaxed mb-3">
                                            {item.definition}
                                        </p>

                                        {item.example && (
                                            <div className="bg-black/30 p-3 rounded border-l-2 border-purple-500/50 text-sm text-purple-200/80 italic">
                                                {item.example}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* CTA Footer */}
                <section className="mt-20 p-8 rounded-xl bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-white/10 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">¿Listo para aplicar lo aprendido?</h3>
                    <p className="text-slate-400 mb-6">Usa el Nexus Terminal para escanear tokens en tiempo real y detectar estos patrones.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    >
                        <FaRocket /> Abrir Scanner
                    </Link>
                </section>

            </main>

            {/* Footer Simple */}
            <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm">
                <p>© {new Date().getFullYear()} Wolfsfera Ecosystem. Knowledge is Power.</p>
            </footer>
        </div>
    );
}
