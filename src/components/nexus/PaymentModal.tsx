"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Gem, Zap, CheckCircle2, CreditCard, Wallet } from 'lucide-react';
import { useCredits } from '@/context/CreditsContext';
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MERCHANT_WALLET = new PublicKey("FauK1XSZqL9kkUKh6HpGwWMokERhcY4nsbMWnx9xdNCP");

const PACKAGES = [
    { id: 1, credits: 10, price: 0.01, label: "STARTER", popular: false },
    { id: 2, credits: 50, price: 0.04, label: "TRADER", popular: true },
    { id: 3, credits: 100, price: 0.08, label: "WHALE", popular: false },
];

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
    const { addCredits } = useCredits();
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [processing, setProcessing] = useState<number | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state on close
    useEffect(() => {
        if (!isOpen) {
            setProcessing(null);
            setError(null);
            setSuccess(false);
        }
    }, [isOpen]);

    const handlePayment = async (pkgId: number, credits: number, priceSol: number) => {
        if (!publicKey) return;

        setProcessing(pkgId);
        setError(null);

        try {
            // 1. Get Fresh Blockhash
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: MERCHANT_WALLET,
                    lamports: priceSol * LAMPORTS_PER_SOL,
                })
            );

            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            // 2. Send and Confirm
            const signature = await sendTransaction(transaction, connection);

            const confirmation = await connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight
            }, 'confirmed'); // 'confirmed' is safer than 'processed' for payments

            if (confirmation.value.err) {
                throw new Error("Transaction Failed on-chain");
            }

            // SUCCESS
            addCredits(credits);
            setProcessing(null);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2000);

        } catch (err: any) {
            console.error("Payment Error:", err);

            // Smart Error Handling
            if (err.name === 'WalletSignTransactionError' || err.message?.includes('User rejected')) {
                setError("Payment Cancelled by User");
            } else if (err.message?.includes('0x0')) {
                setError("Insufficient Funds for Transaction");
            } else {
                setError("Transaction Failed. potentially insufficient funds or network congestion.");
            }
            setProcessing(null);
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
                                    <Gem className="text-purple-500" /> RECHARGE NEXUS
                                </h2>
                                <p className="text-gray-400 text-xs font-mono mt-1">SECURE SOLANA PAY GATEWAY</p>
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
                                <p className="text-gray-300 font-bold">CONNECT WALLET TO PURCHASE</p>
                                <p className="text-xs text-gray-500 mt-2">Phantom / Solflare Supported</p>
                            </div>
                        ) : success ? (
                            <div className="py-12 flex flex-col items-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                                >
                                    <CheckCircle2 size={40} className="text-black" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-green-500 mb-2">PAYMENT CONFIRMED</h3>
                                <p className="text-gray-400 font-mono">CREDITS ADDED TO YOUR ACCOUNT</p>
                                <p className="text-xs text-purple-400 mt-4 opacity-70 break-all px-8">TX VERIFIED ON-CHAIN</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {PACKAGES.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        onClick={() => handlePayment(pkg.id, pkg.credits, pkg.price)}
                                        disabled={processing !== null}
                                        className={`w-full p-4 rounded-xl border flex items-center justify-between group transition-all relative overflow-hidden ${pkg.popular
                                            ? 'bg-purple-900/20 border-purple-500/50 hover:bg-purple-900/30'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`p-3 rounded-lg ${pkg.popular ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                                <Zap size={20} />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white text-lg">{pkg.credits} CREDITS</div>
                                                <div className={`text-xs font-mono font-bold tracking-widest ${pkg.popular ? 'text-purple-400' : 'text-gray-500'}`}>
                                                    {pkg.label}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex items-center gap-3">
                                            <div className="text-xl font-bold text-white">{pkg.price} SOL</div>
                                            {processing === pkg.id ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <CreditCard size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                                {error && (
                                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 text-xs p-3 rounded text-center font-bold">
                                        ⚠️ {error}
                                    </div>
                                )}
                                <p className="text-center text-[10px] text-gray-600 font-mono pt-4 uppercase">
                                    Funds sent directly to Merchant Wallet.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
