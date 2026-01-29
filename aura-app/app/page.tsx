'use client';

import React, { useState, useMemo } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { useAccount, useSendTransaction, useSwitchChain, useTransactionCount } from 'wagmi';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';

const AURA_MOODS = [
  { name: 'VIOLET NEBULA', color: '#a855f7', trait: 'Intuitive' },
  { name: 'CYBER EMERALD', color: '#10b981', trait: 'Stable' },
  { name: 'SOLAR FLARE', color: '#f59e0b', trait: 'Radiant' },
  { name: 'ELECTRIC SHARD', color: '#06b6d4', trait: 'Precise' },
  { name: 'CRIMSON PULSE', color: '#ef4444', trait: 'Powerful' },
  { name: 'GHOST SHELL', color: '#94a3b8', trait: 'Stealthy' },
  { name: 'NEON DREAM', color: '#ec4899', trait: 'Visionary' },
  { name: 'DEEP COBALT', color: '#2563eb', trait: 'Infinite' },
  { name: 'MINT PHANTOM', color: '#2dd4bf', trait: 'Ethereal' },
  { name: 'GOLDEN RATIO', color: '#fbbf24', trait: 'Harmonious' },
  { name: 'AMETHYST VOID', color: '#7c3aed', trait: 'Mystical' },
  { name: 'PLASMA CORE', color: '#84cc16', trait: 'Vital' },
];

export default function Home() {
  const { isConnected, address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const { data: txCount, refetch: refetchTxCount } = useTransactionCount({ address, chainId: base.id });
  
  const [stage, setStage] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);

  // Всплески при тапе
  const handleGlobalTap = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const id = Date.now();
    setPulses(prev => [...prev, { id, x, y }]);
    setTimeout(() => setPulses(prev => prev.filter(p => p.id !== id)), 800);
  };

  const myMood = useMemo(() => {
    if (!address) return AURA_MOODS[0];
    const combinedSeed = address + new Date().toDateString() + (txCount?.toString() || '0');
    const index = combinedSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % AURA_MOODS.length;
    return AURA_MOODS[index];
  }, [address, txCount]);

  const handleCheckAura = async () => {
    if (!isConnected || !address) return;
    setStage('syncing');
    
    try {
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id });
      }

      await sendTransactionAsync({
        to: address as `0x${string}`,
        value: parseEther('0'),
        data: '0x417572612050756c73652052697475616c' as `0x${string}`,
        chainId: base.id,
      });

      await refetchTxCount();
      setStage('synced');
    } catch {
      setStage('idle');
    }
  };

  return (
    <main className="app-container" onMouseDown={handleGlobalTap} onTouchStart={handleGlobalTap}>
      <div className="mystic-bg" style={{ '--color': myMood.color } as React.CSSProperties}></div>
      
      {pulses.map(p => (
        <div key={p.id} className="tap-pulse" style={{ left: p.x, top: p.y, '--color': myMood.color } as React.CSSProperties}></div>
      ))}

      <div className="ui-wrapper">
        <header className="header">
          <Wallet>
            <ConnectWallet className="mini-wallet-btn">
              <Avatar className="h-5 w-5" />
              <Name className="vibrant-name-fix" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick><Avatar /><Name /><Address /></Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </header>

        <section className="ritual-main">
          <div className="aura-focus">
            <div className={`core ${stage === 'synced' ? 'active' : ''}`} 
                 style={{ '--glow': myMood.color } as React.CSSProperties}></div>
            <div className="rings" style={{ '--glow': myMood.color } as React.CSSProperties}>
              <span></span><span></span>
            </div>
          </div>

          <div className="content-box">
            {stage === 'synced' ? (
              <div className="mood-result">
                <h2 style={{ color: myMood.color }}>{myMood.name}</h2>
                <p>Resonance frequency stable.</p>
              </div>
            ) : (
              <div className="branding">
                <h1 className="title">AURA PULSE</h1>
                <p className="subtitle">Establish