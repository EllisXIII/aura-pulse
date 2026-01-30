'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { useAccount, useSignMessage, useSwitchChain, useTransactionCount } from 'wagmi';
import { base } from 'wagmi/chains';
import sdk from '@farcaster/miniapp-sdk';

const AURA_MOODS = [
  { name: 'VIOLET NEBULA', color: '#a855f7', trait: 'Intuitive', meaning: 'Your frequency aligns with the unseen. You perceive patterns within the digital noise.' },
  { name: 'CYBER EMERALD', color: '#10b981', trait: 'Stable', meaning: 'A digital anchor. Your presence on Base provides a foundation of reliability.' },
  { name: 'SOLAR FLARE', color: '#f59e0b', trait: 'Radiant', meaning: 'High-energy state detected. You act as a catalyst for network activity.' },
  { name: 'ELECTRIC SHARD', color: '#06b6d4', trait: 'Precise', meaning: 'Calculated and sharp. Your interactions are efficient and perfectly timed.' },
  { name: 'CRIMSON PULSE', color: '#ef4444', trait: 'Powerful', meaning: 'Dominant resonance. You leave a significant trace with every transaction.' },
  { name: 'GHOST SHELL', color: '#94a3b8', trait: 'Stealthy', meaning: 'Minimalist frequency. You navigate the chain with quiet, focused intent.' },
  { name: 'NEON DREAM', color: '#ec4899', trait: 'Visionary', meaning: 'Future-aligned. Your activity suggests early adoption of emerging shifts.' },
  { name: 'DEEP COBALT', color: '#2563eb', trait: 'Infinite', meaning: 'Unbounded potential. Your onchain history reflects a vast, exploratory nature.' },
  { name: 'MINT PHANTOM', color: '#2dd4bf', trait: 'Ethereal', meaning: 'Light and adaptive. You move through protocols with fluid ease.' },
  { name: 'GOLDEN RATIO', color: '#fbbf24', trait: 'Harmonious', meaning: 'Perfect balance. Your activity cycle matches the heartbeat of the chain.' },
  { name: 'AMETHYST VOID', color: '#7c3aed', trait: 'Mystical', meaning: 'Deeply encoded. Your resonance comes from a place of profound complexity.' },
  { name: 'PLASMA CORE', color: '#84cc16', trait: 'Vital', meaning: 'Pure energy. You are essential to the living ecosystem of the network.' },
];

export default function Home() {
  const { isConnected, address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();
  const { data: txCount } = useTransactionCount({ address, chainId: base.id });
  
  const [stage, setStage] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const [centerWaves, setCenterWaves] = useState<{ id: number }[]>([]);

  // 1. РУКОПОЖАТИЕ С BASE APP
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  const handlePulseTrigger = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const id = Date.now();
    setPulses(prev => [...prev, { id, x, y }]);
    setCenterWaves(prev => [...prev, { id }]);
    setTimeout(() => {
      setPulses(prev => prev.filter(p => p.id !== id));
      setCenterWaves(prev => prev.filter(w => w.id !== id));
    }, 1200);
  };

  const myMood = useMemo(() => {
    if (!address) return AURA_MOODS[0];
    const combinedSeed = address + new Date().toDateString() + (txCount?.toString() || '0');
    const index = combinedSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % AURA_MOODS.length;
    return AURA_MOODS[index];
  }, [address, txCount]);

  const activityLevel = useMemo(() => {
    const count = Number(txCount || 0);
    if (count > 50) return "Legendary Explorer";
    if (count > 10) return "Active Resonator";
    return count > 0 ? "Developing Frequency" : "Silent Observer";
  }, [txCount]);

  const handleRitual = async () => {
    if (!isConnected || !address) return;
    if (chainId !== base.id) {
      switchChain({ chainId: base.id });
      return;
    }
    setStage('syncing');
    try {
      await signMessageAsync({
        message: `Aura Pulse Ritual\n\nSynchronizing frequency for:\n${address}\n\nActivity Level: ${activityLevel}`,
      });
      setStage('synced');
    } catch { setStage('idle'); }
  };

  const handleShare = async () => {
    if (!myMood) return;
    const colorParam = myMood.color.replace('#', '');
    const imageUrl = `https://aura-pulse.vercel.app/api/og?color=${colorParam}&trait=${myMood.trait}`;
    const appUrl = 'https://aura-pulse.vercel.app';
    const shareText = `Established my onchain frequency on Aura Pulse 🔮\n\nState: ${myMood.trait} (${activityLevel})\n\nFrequency: ${myMood.meaning}`;

    try {
      // 2. ОТКРЫВАЕМ РЕДАКТОР ПОСТА В BASE APP
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sdk.actions as any).createCast({
        text: shareText,
        embeds: [imageUrl, appUrl],
      });
    } catch {
      navigator.clipboard.writeText(`${shareText}\n\n${appUrl}`);
      alert("Frequency data ready. Share it manually in your feed!");
    }
  };

  return (
    <main className="app-container">
      {/* СЛОЙ ЭФФЕКТОВ: ниже кнопок, не блокирует клики */}
      <div className="fx-layer" onMouseDown={handlePulseTrigger} onTouchStart={handlePulseTrigger}>
        {pulses.map(p => (
          <div key={p.id} className="tap-pulse" style={{ left: p.x, top: p.y, '--color': myMood.color } as React.CSSProperties}></div>
        ))}
        {centerWaves.map(w => (
          <div key={w.id} className="center-resonance" style={{ '--color': myMood.color } as React.CSSProperties}></div>
        ))}
      </div>

      <div className="mystic-bg" style={{ '--color': myMood.color } as React.CSSProperties}></div>

      <div className="ui-wrapper">
        <header className="header"><Wallet><ConnectWallet className="mini-wallet-btn"><Avatar className="h-5 w-5" /><Name className="vibrant-name-fix" /></ConnectWallet><WalletDropdown><Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick><Avatar /><Name /><Address /></Identity><WalletDropdownDisconnect /></WalletDropdown></Wallet></header>

        <section className="ritual-main">
          <div className="aura-focus">
            <div className={`core ${stage === 'synced' ? 'active' : ''}`} style={{ '--glow': myMood.color } as React.CSSProperties}></div>
            <div className="rings" style={{ '--glow': myMood.color } as React.CSSProperties}><span></span><span></span></div>
          </div>

          <div className="content-box">
            {stage === 'synced' ? (
              <div className="mood-result">
                <h2 style={{ color: myMood.color }}>{myMood.name}</h2>
                <div className="mood-card"><p className="generative-text"><b>{myMood.trait} ({activityLevel}).</b> {myMood.meaning}</p></div>
                <span className="tx-count">Verified Cryptographically.</span>
                <button onClick={handleShare} className="share-btn" style={{ '--btn-color': myMood.color } as React.CSSProperties}>SHARE RITUAL RESULTS</button>
              </div>
            ) : (
              <div className="branding">
                <h1 className="title">AURA PULSE</h1>
                <p className="subtitle">Establish Connection</p>
                {isConnected && <button onClick={handleRitual} className="ritual-btn" disabled={stage === 'syncing'}>{chainId !== base.id ? 'SWITCH TO BASE' : (stage === 'syncing' ? 'SYNCING...' : 'CHECK AURA')}</button>}
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; overflow: hidden; font-family: -apple-system, sans-serif; height: 100dvh; }
        .app-container { position: relative; height: 100dvh; width: 100vw; background: #000; overflow: hidden; }
        .fx-layer { position: absolute; inset: 0; z-index: 5; }
        .tap-pulse { position: absolute; width: 4px; height: 4px; background: #fff; border-radius: 50%; pointer-events: none; animation: pulseOut 1s ease-out forwards; box-shadow: 0 0 20px var(--color); }
        @keyframes pulseOut { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(60); opacity: 0; } }
        .center-resonance { position: absolute; left: 50%; top: 35%; width: 10px; height: 10px; background: transparent; border: 2px solid var(--color); border-radius: 50%; transform: translate(-50%, -50%); animation: centerWave 1.2s ease-out forwards; pointer-events: none; }
        @keyframes centerWave { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; } 100% { transform: translate(-50%, -50%) scale(45); opacity: 0; } }
        .mystic-bg { position: absolute; inset: 0; background: radial-gradient(circle at 50% 35%, var(--color) 0%, #000 85%); opacity: 0.3; z-index: 1; transition: 2s; }
        .ui-wrapper { position: relative; z-index: 10; height: 100dvh; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; pointer-events: none; }
        .header, .ritual-main, .mini-wallet-btn, .ritual-btn, .share-btn, .mood-result { pointer-events: auto; }
        .ritual-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 35px; margin-top: -40px; }
        .aura-focus { position: relative; width: 170px; height: 170px; display: flex; align-items: center; justify-content: center; }
        .core { width: 55px; height: 55px; background: #fff; border-radius: 50%; box-shadow: 0 0 50px var(--glow); transition: 1s; }
        .core.active { transform: scale(1.4); filter: brightness(1.2); }
        .rings span { position: absolute; inset: 0; border: 1px solid var(--glow); border-radius: 50%; opacity: 0; animation: waves 4s infinite linear; }
        @keyframes waves { 0% { transform: scale(0.5); opacity: 0.5; } 100% { transform: scale(2.5); opacity: 0; } }
        .content-box { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; }
        .title { font-size: 1.6rem; font-weight: 200; letter-spacing: 12px; margin: 0; text-indent: 12px; }
        .subtitle { font-size: 10px; color: #666; letter-spacing: 4px; text-transform: uppercase; margin: 8px 0 30px 0; }
        .mini-wallet-btn { background: rgba(0,0,0,0.6) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important; border-radius: 100px !important; }
        .vibrant-name-fix { color: #fff !important; font-weight: 700 !important; margin-left: 8px !important; font-size: 14px !important; }
        .ritual-btn { background: #fff; color: #000; border: none; padding: 18px 60px; border-radius: 100px; font-weight: 900; font-size: 14px; cursor: pointer; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .mood-result { animation: fadeIn 0.8s ease-out; max-width: 320px; display: flex; flex-direction: column; align-items: center; }
        .mood-card { background: rgba(255,255,255,0.03); padding: 18px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); margin: 15px 0; }
        .generative-text { font-size: 13px; color: #ccc; margin: 0; line-height: 1.6; }
        .tx-count { font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }
        .share-btn { margin-top: 25px; background: #fff; color: #000; border: none; padding: 14px 35px; border-radius: 100px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 0 25px var(--btn-color); transition: 0.2s; }
        .share-btn:active { transform: scale(0.95); opacity: 0.9; }
      `}</style>
    </main>
  );
}