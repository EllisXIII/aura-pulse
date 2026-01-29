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

  // Всплески при тапе по всему экрану
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
        chainId: base.id, // Жесткая привязка к сети Base
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
                <p className="subtitle">Establish Connection</p>
              </div>
            )}

            {isConnected && stage !== 'synced' && (
              <button onClick={handleCheckAura} className="ritual-btn" disabled={stage === 'syncing'}>
                {stage === 'syncing' ? 'SYNCING...' : 'CHECK AURA'}
              </button>
            )}
          </div>
        </section>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; overflow: hidden; font-family: sans-serif; height: 100dvh; }
        .app-container { position: relative; height: 100dvh; width: 100vw; overflow: hidden; touch-action: none; }
        .mystic-bg { position: absolute; inset: 0; background: radial-gradient(circle at 50% 35%, var(--color) 0%, #000 80%); opacity: 0.2; transition: 2s; }
        
        .tap-pulse { position: absolute; width: 2px; height: 2px; background: #fff; border-radius: 50%; pointer-events: none; animation: pulseOut 0.8s ease-out forwards; box-shadow: 0 0 15px var(--color); z-index: 99; }
        @keyframes pulseOut { 
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(80); opacity: 0; }
        }

        .ui-wrapper { position: relative; z-index: 10; height: 100dvh; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
        .header { display: flex; justify-content: flex-end; width: 100%; }
        
        .mini-wallet-btn { background: rgba(0,0,0,0.5) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important; border-radius: 100px !important; padding: 6px 14px !important; }
        .vibrant-name-fix { color: #fff !important; font-weight: 700 !important; margin-left: 8px !important; font-size: 13px !important; }

        .ritual-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; margin-top: -30px; }
        .aura-focus { position: relative; width: 160px; height: 160px; display: flex; align-items: center; justify-content: center; }
        .core { width: 50px; height: 50px; background: #fff; border-radius: 50%; box-shadow: 0 0 40px var(--glow); transition: 1s; }
        .core.active { transform: scale(1.3); filter: brightness(1.2); }
        .rings span { position: absolute; inset: 0; border: 1px solid var(--glow); border-radius: 50%; opacity: 0; animation: waves 3s infinite linear; }
        @keyframes waves { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }

        .content-box { display: flex; flex-direction: column; align-items: center; gap: 15px; text-align: center; width: 100%; }
        .title { font-size: 1.5rem; font-weight: 200; letter-spacing: 8px; margin: 0; line-height: 1; }
        .subtitle { font-size: 9px; color: #555; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }

        .ritual-btn { background: #fff; color: #000; border: none; padding: 14px 40px; border-radius: 100px; font-weight: 900; font-size: 13px; cursor: pointer; }
        .mood-result h2 { font-size: 1.3rem; letter-spacing: 1px; margin-bottom: 5px; }
        .mood-result p { font-size: 11px; color: #666; margin: 0; font-style: italic; }
      `}</style>
    </main>
  );
}