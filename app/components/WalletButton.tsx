"use client";
import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";

export const WalletButton = () => {
    const { account, isConnected, walletType, connectMetaMask, disconnect } = useWallet();
    const [showMenu, setShowMenu] = useState(false);

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    if (!isConnected || !account) {
        return (
            <div className="flex gap-2">
                {/* Auto-connect happens in background, this is fallback/MetaMask */}
                <button
                    onClick={() => connectMetaMask()}
                    className="px-4 py-2 bg-card-dark border border-card-border text-text-main rounded-lg hover:bg-card-border transition-all text-sm font-medium"
                >
                    Connect MetaMask
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="px-4 py-2 premium-card flex items-center gap-2 hover:border-accent-primary/50 transition-all"
            >
                <div className={`w-2 h-2 rounded-full ${walletType === 'auto' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                <span className="text-sm font-medium text-text-main">
                    {walletType === 'auto' ? 'Auto: ' : 'Wallet: '}
                    {formatAddress(account.address)}
                </span>
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 premium-card p-1 z-50">
                    <div className="px-3 py-2 text-xs text-text-muted border-b border-card-border mb-1">
                        {walletType === 'auto' ? 'GenLayer Auto-Account' : 'MetaMask Connected'}
                    </div>
                    {walletType === 'auto' && (
                        <button
                            onClick={async () => {
                                setShowMenu(false);
                                await connectMetaMask();
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-text-main hover:bg-card-border rounded-md"
                        >
                            Switch to MetaMask
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setShowMenu(false);
                            disconnect();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md"
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
};
