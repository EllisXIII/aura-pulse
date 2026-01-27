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
  const { data: txCount, refetch: refetchTxCount } = useTransactionCount({ address, chainId: base.id });
  
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
    return `Resonance confirmed. Your ${txCount || 0} steps on Base have stabilized your frequency. Your ${myMood.trait} aura is currently dominant.`;
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
      onSuccess: async () => {
        await refetchTxCount();
        setStage('synced');
      },
      onError: () => setStage('idle'),
    });
  };

  const handleShare = () => {
    const appUrl = window.location.origin;
    const shareText = `My current aura on Base: ${myMood.name}\n\nCheck yours at`;
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
    { addr: '0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9', name: '0x838a...B4D9', color: '#10b981' },
    { addr: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1', name: 'zizzamia.eth', color: '#a855f7' }
  ].filter(f => (impulseStats[f.addr] || 0) < 2);

  return (
    <main className={`app-container ${stage}`}>
      <div className="mystic-bg" style={{ '--color': myMood.color } as React.CSSProperties}></div>
      <div className="ui-wrapper">
        <header className="header">
          <Wallet>
            <ConnectWallet className="custom-wallet-btn">
              <Avatar className="h-6 w-6" />
              <Name className="custom-name-text" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick><Avatar /><Name /><Address /></Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </header>

        <section className="ritual-main">
          <div className="aura-focus">
            <div className={`core ${stage === 'synced' ? 'active' : ''} ${splash ? 'splash' : ''}`} 
                 style={{ '--glow': myMood.color } as React.CSSProperties}></div>
            <div className="rings" style={{ '--glow': myMood.color } as React.CSSProperties}>
              <span></span><span></span>
            </div>
          </div>

          {/* Исправлено: Блок появляется только ПОСЛЕ синхронизации */}
          {stage === 'synced' && (
            <div className="mood-card active-view">
              <h2 style={{ color: myMood.color }}>{myMood.name}</h2>
              <p className="description">{generativeText}</p>
              <button onClick={handleShare} className="share-btn">SHARE ON BASE</button>
            </div>
          )}

          <div className="branding">
            <h1 className="title">AURA PULSE</h1>
            <p className="subtitle">{stage === 'synced' ? 'RECORDED ONCHAIN' : 'Establish Onchain Connection'}</p>
          </div>

          {isConnected && stage !== 'synced' && (
            <button onClick={handleCheckAura} className="ritual-btn" disabled={stage === 'syncing'}>
              {stage === 'syncing' ? 'RECORDING...' : 'CHECK AURA'}
            </button>
          )}
        </section>

        <section className="social-panel">
          <span className="panel-label">Nearby Resonances</span>
          <div className="friends-grid">
            {friends.map(f => (
              <div key={f.addr} className="friend-card" onClick={() => triggerImpulse(f.addr)}>
                <div className="orb-container">
                  <div className="flicker-orb" style={{ '--orb-color': f.color } as React.CSSProperties}></div>
                  <div className="orb-glow-layer" style={{ '--orb-color': f.color } as React.CSSProperties}></div>
                </div>
                <div className="friend-details">
                  <span className="friend-name-text">{f.name}</span>
                  <span className="charge-text">{2 - (impulseStats[f.addr] || 0)} CHARGES LEFT • TAP TO SYNC</span>
                </div>
              </div>
            ))}
            {friends.length === 0 && <span className="empty-status">Resonance complete. All pulses sent.</span>}
          </div>
        </section>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; overflow: hidden; font-family: 'Inter', sans-serif; }
        .mystic-bg { position: absolute; inset: 0; background: radial-gradient(circle at 50% 30%, var(--color) 0%, #000 100%); opacity: 0.15; transition: 2s; }
        .ui-wrapper { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; padding: 25px; box-sizing: border-box; }
        .header { display: flex; justify-content: flex-end; width: 100%; }
        
        /* Стили кошелька (возврат к мистике) */
        .custom-wallet-btn { background: rgba(255,255,255,0.08) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 100px !important; color: #fff !important; }
        .custom-name-text { color: #fff !important; font-weight: 600 !important; margin-left: 10px !important; }

        .ritual-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .aura-focus { position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; }
        .core { width: 70px; height: 70px; background: #fff; border-radius: 50%; box-shadow: 0 0 60px var(--glow); transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5; }
        .core.active { transform: scale(1.4); }
        .core.splash { animation: splashEffect 0.8s ease-out; }
        @keyframes splashEffect {
          0% { transform: scale(1.4); box-shadow: 0 0 60px var(--glow); }
          50% { transform: scale(2.4); box-shadow: 0 0 150px var(--glow); filter: brightness(1.6); }
          100% { transform: scale(1.4); box-shadow: 0 0 60px var(--glow); }
        }
        .rings span { position: absolute; inset: 0; border: 1px solid var(--glow); border-radius: 50%; opacity: 0; animation: waves 4s infinite linear; }
        @keyframes waves { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(2.6); opacity: 0; } }

        .mood-card { margin: 30px 0; max-width: 320px; opacity: 0; transform: translateY(20px); transition: 1s ease; }
        .mood-card.active-view { opacity: 1; transform: translateY(0); }
        .description { font-size: 0.9rem; color: #777; margin-bottom: 25px; font-style: italic; line-height: 1.6; }
        .share-btn { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 12px 30px; border-radius: 100px; font-size: 11px; font-weight: 800; cursor: pointer; }
        .share-btn:hover { background: #fff; color: #000; }

        .title { font-size: 2.2rem; font-weight: 200; letter-spacing: 12px; margin: 15px 0; }
        .subtitle { font-size: 10px; color: #444; letter-spacing: 4px; text-transform: uppercase; }
        .ritual-btn { margin-top: 40px; background: #fff; color: #000; border: none; padding: 18px 55px; border-radius: 100px; font-weight: 800; cursor: pointer; }

        .social-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 35px; padding: 25px; margin-top: auto; backdrop-filter: blur(15px); }
        .panel-label { font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: #555; margin-bottom: 15px; display: block; }
        .friend-card { display: flex; align-items: center; background: rgba(0,0,0,0.2); padding: 14px 20px; border-radius: 25px; cursor: pointer; transition: 0.3s; margin-bottom: 10px; }
        .friend-card:hover { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }
        
        .flicker-orb { 
          width: 32px; height: 32px; border-radius: 50%; z-index: 2; 
          background: radial-gradient(circle at 30% 30%, #fff, var(--orb-color)); 
          box-shadow: 0 0 10px var(--orb-color);
          animation: orbFlicker 2.5s infinite alternate ease-in-out;
        }
        .orb-glow-layer { 
          position: absolute; inset: -4px; border-radius: 50%; z-index: 1; 
          background: var(--orb-color); filter: blur(10px); opacity: 0.4;
        }
        @keyframes orbFlicker { 0% { transform: scale(0.95); } 100% { transform: scale(1.1); } }
        .friend-name-text { font-size: 14px; font-weight: 700; color: #fff; display: block; }
        .charge-text { font-size: 9px; color: #666; letter-spacing: 1px; margin-top: 4px; display: block; }
      `}</style>
    </main>
  );
}