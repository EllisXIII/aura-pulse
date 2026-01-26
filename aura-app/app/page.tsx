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
  const [impulseTarget, setImpulseTarget] = useState<string | null>(null);

  const myMood = useMemo(() => {
    if (!address) return AURA_MOODS[0];
    const dateSeed = new Date().toDateString();
    const txSeed = txCount?.toString() || '0';
    const combinedSeed = address + dateSeed + txSeed;
    const index = combinedSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % AURA_MOODS.length;
    return AURA_MOODS[index];
  }, [address, txCount]);

  const generativeText = useMemo(() => {
    if (!isConnected) return "";
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const txs = txCount || 0;
    
    const intros = [
      `It is ${now.toLocaleDateString('en-US', { weekday: 'long' })}, ${timeStr}.`,
      `Sync established at ${timeStr} in the Base sector.`,
      `Frequencies aligned at ${timeStr}. Network is stable.`
    ];
    
    const txComments = txs > 100 
      ? `Your massive record of ${txs} transactions defines your authority.` 
      : `Your ${txs} steps on Base have led to this current resonance.`;
      
    const vibes = [
      `Your ${myMood.trait} aura is currently dominant.`,
      `Digital alignment: ${myMood.name} state detected.`,
      `You are radiating a ${myMood.trait} frequency today.`
    ];

    return `${intros[now.getSeconds() % 3]} ${txComments} ${vibes[now.getMinutes() % 3]}`;
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
    const appUrl = window.location.origin;
    const shareText = `My current aura on Base: ${myMood.name}\n\n"${generativeText}"\n\nCheck yours at`;
    const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(appUrl + '?aura=' + myMood.name + '&color=' + encodeURIComponent(myMood.color))}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <main className={`app-container ${stage}`}>
      <div className="mystic-bg" style={{ '--color': myMood.color } as React.CSSProperties}></div>
      
      <div className="ui-wrapper">
        <header className="header">
          <Wallet>
            <ConnectWallet className="wallet-pill">
              <Avatar className="h-6 w-6" /><Name className="ml-2" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick><Avatar /><Name /><Address /></Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </header>

        <section className="ritual-main">
          <div className="aura-focus">
            <div className={`core ${stage === 'synced' ? 'active' : ''}`} style={{ '--glow': myMood.color } as React.CSSProperties}></div>
            <div className="rings" style={{ '--glow': myMood.color } as React.CSSProperties}>
              <span></span><span></span><span></span>
            </div>
          </div>

          <div className={`mood-card ${stage === 'synced' ? 'visible' : ''}`}>
            <h2 style={{ color: myMood.color }}>{myMood.name}</h2>
            <p className="description">{generativeText}</p>
            <button onClick={handleShare} className="share-btn">SHARE ON BASE</button>
          </div>

          <div className="branding">
            <h1 className="title">AURA PULSE</h1>
            <p className="subtitle">{stage === 'synced' ? 'RECORDED ONCHAIN' : 'Connect to check your frequency'}</p>
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
            {[
              { addr: '0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9', color: '#10b981' },
              { addr: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1', color: '#ec4899' }
            ].map(f => (
              <div key={f.addr} className="friend-row" onClick={() => { setImpulseTarget(f.addr); setTimeout(() => setImpulseTarget(null), 2000); }}>
                <Avatar address={f.addr as `0x${string}`} className="h-10 w-10 border" style={{borderColor: f.color}} />
                <div className="ml-3 text-left">
                  <Name address={f.addr as `0x${string}`} className="text-sm font-bold block" />
                  <span className="text-[9px] uppercase tracking-widest" style={{color: impulseTarget === f.addr ? '#fff' : '#444'}}>
                    {impulseTarget === f.addr ? '⚡ Impulse Sent!' : 'Tap to sync'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; overflow: hidden; font-family: 'Inter', sans-serif; }
        .mystic-bg { position: absolute; inset: 0; background: radial-gradient(circle at 50% 30%, var(--color) 0%, #000 100%); opacity: 0.15; transition: 2s; z-index: 0; }
        .ui-wrapper { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
        .header { display: flex; justify-content: flex-end; }
        .ritual-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .aura-focus { position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; }
        .core { width: 70px; height: 70px; background: #fff; border-radius: 50%; box-shadow: 0 0 60px var(--glow); transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .core.active { transform: scale(1.5); filter: brightness(1.2); box-shadow: 0 0 100px var(--glow); }
        .rings span { position: absolute; inset: 0; border: 1px solid var(--glow); border-radius: 50%; opacity: 0; animation: waves 4s infinite linear; }
        .rings span:nth-child(2) { animation-delay: 1.3s; }
        .rings span:nth-child(3) { animation-delay: 2.6s; }
        @keyframes waves { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(2.6); opacity: 0; } }
        .mood-card { opacity: 0; transform: translateY(20px); transition: 1.2s ease; margin: 25px 0; max-width: 300px; display: flex; flex-direction: column; align-items: center; }
        .mood-card.visible { opacity: 1; transform: translateY(0); }
        .mood-card h2 { font-size: 1.5rem; letter-spacing: 6px; margin-bottom: 8px; font-weight: 200; }
        .description { font-size: 0.85rem; color: #888; line-height: 1.6; font-style: italic; margin-bottom: 25px; }
        .share-btn { background: #fff; color: #000; border: none; padding: 12px 30px; border-radius: 100px; font-size: 10px; font-weight: 700; letter-spacing: 2px; cursor: pointer; transition: 0.3s; }
        .share-btn:hover { background: #eee; }
        .title { font-size: 2.4rem; font-weight: 200; letter-spacing: 14px; margin: 10px 0; }
        .subtitle { font-size: 0.6rem; color: #444; letter-spacing: 4px; text-transform: uppercase; }
        .ritual-btn { margin-top: 40px; background: #fff; color: #000; border: none; padding: 18px 55px; border-radius: 100px; font-weight: 800; letter-spacing: 2px; cursor: pointer; }
        .wallet-pill { background: rgba(255,255,255,0.06) !important; border-radius: 100px !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.1) !important; }
        .social-footer { background: rgba(255,255,255,0.02); backdrop-filter: blur(25px); border-radius: 40px; padding: 25px; border: 1px solid rgba(255,255,255,0.05); margin-top: auto; }
        .label { font-size: 9px; text-transform: uppercase; letter-spacing: 3px; color: #444; margin-bottom: 15px; display: block; }
        .friends-list { display: flex; flex-direction: column; gap: 10px; }
        .friend-row { display: flex; align-items: center; background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 25px; cursor: pointer; transition: 0.3s; }
        .friend-row:hover { border: 1px solid #fff; background: rgba(255,255,255,0.05); }
      `}</style>
    </main>
  );
}