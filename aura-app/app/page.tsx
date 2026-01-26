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
  const { switchChain } = useSwitchChain();
  const { sendTransaction } = useSendTransaction();
  const { data: txCount } = useTransactionCount({ address, chainId: base.id });
  
  const [stage, setStage] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [splash, setSplash] = useState(false);
  const [impulseStats, setImpulseStats] = useState<Record<string, number>>({});

  const myMood = useMemo(() => {
    if (!address) return AURA_MOODS[0];
    const combinedSeed = address + new Date().toDateString() + (txCount?.toString() || '0');
    const index = combinedSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % AURA_MOODS.length;
    return AURA_MOODS[index];
  }, [address, txCount]);

  const generativeText = useMemo(() => {
    if (!isConnected) return "";
    const txs = txCount || 0;
    return `Frequencies aligned at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Network is stable. Your ${txs} steps on Base have led to this current resonance. Your ${myMood.trait} aura is currently dominant.`;
  }, [isConnected, myMood, txCount]);

  const handleCheckAura = async () => {
    if (!isConnected || !address) return;
    if (chainId !== base.id) { switchChain({ chainId: base.id }); return; }
    setStage('syncing');
    sendTransaction({
      to: address as `0x${string}`,
      value: parseEther('0'),
      data: '0x417572612050756c73652052697475616c' as `0x${string}`,
    }, {
      onSuccess: () => setStage('synced'),
      onError: () => setStage('idle'),
    });
  };

  const handleShare = () => {
    const appUrl = "https://aura-pulse.vercel.app"; // Замени на свой реальный домен
    const shareText = `My current aura on Base: ${myMood.name}\n\n"${generativeText}"\n\nCheck yours at`;
    const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(appUrl + '?aura=' + myMood.name + '&color=' + encodeURIComponent(myMood.color))}`;
    window.open(shareUrl, '_blank');
  };

  const triggerImpulse = (friendAddr: string) => {
    const currentCount = impulseStats[friendAddr] || 0;
    if (currentCount >= 2) return;

    setSplash(true);
    setImpulseStats(prev => ({ ...prev, [friendAddr]: currentCount + 1 }));
    setTimeout(() => setSplash(false), 800);
  };

  const friends = [
    { addr: '0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9', color: '#10b981' },
    { addr: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1', color: '#ec4899' }
  ].filter(f => (impulseStats[f.addr] || 0) < 2);

  return (
    <main className={`app-container ${stage}`}>
      <div className="mystic-bg" style={{ '--color': myMood.color } as React.CSSProperties}></div>
      
      <div className="ui-wrapper">
        <header className="header">
          <Wallet>
            <ConnectWallet className="custom-wallet">
              <Avatar className="h-6 w-6" />
              <Name className="ml-2 text-white font-bold" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick><Avatar /><Name /><Address /></Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </header>

        <section className="ritual-main">
          <div className="aura-visual">
            <div className={`sphere ${stage === 'synced' ? 'active' : ''} ${splash ? 'splash' : ''}`} 
                 style={{ '--glow': myMood.color } as React.CSSProperties}></div>
            <div className="rings" style={{ '--glow': myMood.color } as React.CSSProperties}>
              <span></span><span></span>
            </div>
          </div>

          <div className={`mood-card ${stage === 'synced' ? 'visible' : ''}`}>
            <h2 style={{ color: myMood.color }}>{myMood.name}</h2>
            <p className="description">{generativeText}</p>
            <button onClick={handleShare} className="share-btn">SHARE ON BASE</button>
          </div>

          <div className="branding">
            <h1 className="title">AURA PULSE</h1>
            <p className="subtitle">{stage === 'synced' ? 'RECORDED ONCHAIN' : 'Connect to check frequency'}</p>
          </div>

          {isConnected && stage !== 'synced' && (
            <button onClick={handleCheckAura} className="ritual-btn" disabled={stage === 'syncing'}>
              {stage === 'syncing' ? 'RECORDING...' : 'CHECK AURA'}
            </button>
          )}
        </section>

        <section className="social-footer">
          <span className="label">Nearby Resonances</span>
          <div className="friends-list">
            {friends.map(f => (
              <div key={f.addr} className="friend-row" onClick={() => triggerImpulse(f.addr)}>
                <Avatar address={f.addr as `0x${string}`} className="h-10 w-10" />
                <div className="friend-info">
                  <Name address={f.addr as `0x${string}`} className="friend-name" />
                  <span className="tap-hint">{2 - (impulseStats[f.addr] || 0)} charges left • Tap to sync</span>
                </div>
              </div>
            ))}
            {friends.length === 0 && <span className="empty-msg">All energies synchronized.</span>}
          </div>
        </section>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; overflow: hidden; font-family: 'Inter', sans-serif; }
        .mystic-bg { position: absolute; inset: 0; background: radial-gradient(circle at 50% 30%, var(--color) 0%, #000 100%); opacity: 0.15; transition: 2s; }
        .ui-wrapper { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; padding: 25px; box-sizing: border-box; }
        .header { display: flex; justify-content: flex-end; }
        
        /* Исправление коннекта кошелька */
        .custom-wallet { background: rgba(255,255,255,0.08) !important; border: 1px solid rgba(255,255,255,0.15) !important; border-radius: 100px !important; padding: 8px 16px !important; color: #fff !important; box-shadow: none !important; }
        
        .ritual-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .aura-visual { position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; }
        .sphere { width: 70px; height: 70px; background: #fff; border-radius: 50%; box-shadow: 0 0 60px var(--glow); transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2; }
        .sphere.active { transform: scale(1.4); }
        .sphere.splash { animation: sphereSplash 0.8s ease-out; }

        @keyframes sphereSplash { 
          0% { transform: scale(1.4); box-shadow: 0 0 60px var(--glow); }
          50% { transform: scale(1.8); box-shadow: 0 0 140px var(--glow); }
          100% { transform: scale(1.4); box-shadow: 0 0 60px var(--glow); }
        }

        .rings span { position: absolute; inset: 0; border: 1px solid var(--glow); border-radius: 50%; opacity: 0; animation: waves 4s infinite linear; }
        @keyframes waves { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(2.6); opacity: 0; } }

        .mood-card { opacity: 0; transform: translateY(20px); transition: 1s ease; margin: 25px 0; max-width: 300px; }
        .mood-card.visible { opacity: 1; transform: translateY(0); }
        .description { font-size: 0.85rem; color: #888; margin-bottom: 20px; font-style: italic; line-height: 1.6; }
        
        .share-btn { background: #fff; color: #000; border: none; padding: 12px 30px; border-radius: 100px; font-size: 11px; font-weight: 800; cursor: pointer; letter-spacing: 1px; }
        .title { font-size: 2.2rem; font-weight: 200; letter-spacing: 12px; margin: 10px 0; }
        .ritual-btn { margin-top: 35px; background: #fff; color: #000; border: none; padding: 18px 50px; border-radius: 100px; font-weight: 800; cursor: pointer; }

        /* Дизайн Nearby Resonances */
        .social-footer { background: rgba(255,255,255,0.03); backdrop-filter: blur(15px); border-radius: 30px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); margin-top: auto; }
        .label { font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #444; margin-bottom: 15px; display: block; }
        .friends-list { display: flex; flex-direction: column; gap: 12px; }
        .friend-row { display: flex; align-items: center; background: rgba(255,255,255,0.03); padding: 10px 18px; border-radius: 20px; cursor: pointer; transition: 0.3s; border: 1px solid transparent; }
        .friend-row:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.1); }
        .friend-info { margin-left: 15px; text-align: left; }
        .friend-name { font-size: 13px; font-weight: 700; color: #fff; display: block; }
        .tap-hint { font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .empty-msg { font-size: 11px; color: #444; font-style: italic; }
      `}</style>
    </main>
  );
}