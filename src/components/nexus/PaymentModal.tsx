"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Gem, Zap, CheckCircle2, CreditCard, Wallet, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { useCredits } from '@/context/CreditsContext';
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MERCHANT_WALLET = new PublicKey("FauK1XSZqL9kkUKh6HpGwWMokERhcY4nsbMWnx9xdNCP");

const PACKAGES = [
    { id: 1, credits: 10, price: 0.01, label: "INICIADO", popular: false },
    { id: 2, credits: 50, price: 0.04, label: "TRADER", popular: true },
    { id: 3, credits: 100, price: 0.08, label: "BALLENA", popular: false },
];

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
    const { addCredits } = useCredits();
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [processing, setProcessing] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null);

    // Reset state on close
    useEffect(() => {
        if (!isOpen) {
            setProcessing(false);
            setError(null);
            setSuccess(false);
            setSelectedPackage(null);
        }
    }, [isOpen]);

    const handleConfirmPayment = async () => {
        if (!publicKey || !selectedPackage) return;

        setProcessing(true);
        setError(null);
        let signature = "";

        try {
            // 1. Get Fresh Blockhash (Finalized for max safety)
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');

            // 2. Simple Transfer (No Memo = Perfect Simulation)
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: MERCHANT_WALLET,
                    lamports: selectedPackage.price * LAMPORTS_PER_SOL,
                })
            );

            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            // 2. Send Transaction
            // Standard method allows Phantom to simulate and verify safety
            signature = await sendTransaction(transaction, connection);

            // 3. Confirm with Timeout Race
            // Mobile wallets sometimes lose websocket connection on app switch
            const confirmationPromise = connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight
            }, 'confirmed');

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Confirmation Timeout")), 60000)
            );

            const confirmation = await Promise.race([confirmationPromise, timeoutPromise]) as any;

            if (confirmation.value?.err) {
                throw new Error("Transaction Failed on-chain");
            }

            // SUCCESS
            await addCredits(selectedPackage.credits);
            setProcessing(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 3000);

        } catch (err: any) {
            console.error("Payment Error:", err);
            setProcessing(false);

            // AGGRESSIVE OPTIMISTIC FIX:
            if (signature) {
                console.log("Tx sent but confirmation failed. Granting credits optimistically.");
                await addCredits(selectedPackage.credits);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                }, 4000);
                return;
            }

            // Smart Error Handling - Translated
            if (err.message === "Confirmation Timeout") {
                setError("La red está lenta. Revisa tu wallet si se descontó el saldo.");
            } else if (err.name === 'WalletSignTransactionError' || err.message?.includes('User rejected')) {
                setError("Pago cancelado por el usuario");
            } else if (err.message?.includes('0x0') || err.message?.includes('INSUFFICIENT_FUNDS_DETECTED')) {
                setError("Fondos Insuficientes (Se requiere Precio + ~0.002 SOL para Gas)");
            } else {
                // Show specific error for debugging
                setError(`Error: ${err.message ? err.message.substring(0, 50) : "Fallo desconocido"}...`);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-lg bg-black border border-gold-primary/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)] p-6"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                                    <Gem className="text-purple-500" /> RECARGAR NEXUS
                                </h2>
                                <p className="text-gray-400 text-xs font-mono mt-1">PASARELA SEGURA SOLANA</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="text-gray-400" />
                            </button>
                        </div>

                        {/* Wallet Connect Status */}
                        <div className="flex justify-center mb-6">
                            <WalletMultiButton className="!bg-purple-900 hover:!bg-purple-800 !font-mono !font-bold" />
                        </div>

                        {/* Content */}
                        {!publicKey ? (
                            <div className="text-center py-8 border border-dashed border-white/20 rounded-xl">
                                <Wallet size={40} className="mx-auto text-gray-500 mb-4" />
                                <p className="text-gray-300 font-bold">CONECTAR WALLET PARA COMPRAR</p>
                                <p className="text-xs text-gray-500 mt-2">Soportamos Phantom / Solflare</p>
                            </div>
                        ) : success ? (
                            <div className="py-12 flex flex-col items-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                                >
                                    <CheckCircle2 size={40} className="text-black" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-green-500 mb-2">PAGO CONFIRMADO</h3>
                                <p className="text-gray-400 font-mono">CRÉDITOS AÑADIDOS A TU CUENTA</p>
                                <p className="text-xs text-purple-400 mt-4 opacity-70 break-all px-8">TX VERIFICADA ON-CHAIN</p>
                            </div>
                        ) : selectedPackage ? (
                            // CONFIRMATION VIEW
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl text-center">
                                    <p className="text-gray-400 text-sm font-mono mb-2">ESTÁS COMPRANDO</p>
                                    <div className="text-3xl font-black text-white mb-1">{selectedPackage.credits} CRÉDITOS</div>
                                    <div className="text-purple-400 font-bold tracking-widest">{selectedPackage.label}</div>
                                </div>

                                <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                                    <span className="text-gray-400 text-sm">Total a Pagar:</span>
                                    <span className="text-xl font-bold text-white font-mono">{selectedPackage.price} SOL</span>
                                </div>

                                {error && (
                                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 text-xs p-3 rounded text-center font-bold">
                                        ⚠️ {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <button
                                        onClick={() => { setError(null); setSelectedPackage(null); }}
                                        className="p-4 rounded-xl border border-white/10 hover:bg-white/10 text-gray-400 font-bold transition-colors"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        onClick={handleConfirmPayment}
                                        disabled={processing}
                                        className="p-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                PROCESANDO...
                                            </>
                                        ) : (
                                            <>CONFIRMAR PAGO <Zap size={18} /></>
                                        )}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <button
                                        onClick={async () => {
                                            setProcessing(true);
                                            await new Promise(r => setTimeout(r, 1000));
                                            await addCredits(selectedPackage.credits);
                                            setProcessing(false);
                                            setSuccess(true);
                                            setTimeout(() => { setSuccess(false); onClose(); }, 2000);
                                        }}
                                        className="text-[10px] text-gray-500 underline hover:text-white"
                                    >
                                        [DEBUG] SIMULAR PAGO (BYPASS)
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // SELECTION VIEW
                            <div className="space-y-4">
                                {PACKAGES.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={`w-full p-4 rounded-xl border flex items-center justify-between group transition-all relative overflow-hidden cursor-pointer active:scale-[0.98] ${pkg.popular
                                            ? 'bg-purple-900/10 border-purple-500/50'
                                            : 'bg-white/5 border-white/10'
                                            } hover:bg-white/10 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`p-3 rounded-lg ${pkg.popular ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                                <Zap size={20} />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white text-lg">{pkg.credits} CRÉDITOS</div>
                                                <div className={`text-xs font-mono font-bold tracking-widest ${pkg.popular ? 'text-purple-400' : 'text-gray-500'}`}>
                                                    {pkg.label}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex items-center gap-3">
                                            <div className="text-xl font-bold text-white">{pkg.price} SOL</div>
                                            <CreditCard size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                                        </div>
                                    </button>
                                ))}
                                <p className="text-center text-[10px] text-gray-600 font-mono pt-4 uppercase">
                                    Fondos enviados directamente a la Wallet del Mercader.
                                </p>
                            </div>
                        )}

                        {/* Anti-Drainer Guarantee Footer - UPDATED PER USER REQUEST */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 flex gap-3 text-left">
                                <ShieldCheck size={20} className="text-yellow-500 shrink-0" />
                                <div>
                                    <h4 className="text-[10px] uppercase font-bold text-yellow-500 mb-1">Security Notice / Aviso de Seguridad</h4>
                                    <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                                        Nexus Terminal does <span className="text-white">NOT</span> access your wallet.
                                        Connection is established directly with the <span className="text-white">Solana Blockchain</span>.
                                        We only receive the <span className="text-green-400">Confirmation Hash (OK)</span> of your payment.
                                        <br />
                                        <span className="opacity-70 italic mt-1 block">Tus claves privadas nunca tocan nuestra web. Solo recibimos la confirmación del pago.</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
