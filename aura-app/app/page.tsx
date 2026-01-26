'use client';

import React, { useState, useEffect } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';

// Типы для Аур
const AURA_MOODS = [
  { name: 'VIOLET NEBULA', color: '#a855f7', desc: 'Your frequency is aligned with the deep void. Intuition is your primary gas.' },
  { name: 'CYBER EMERALD', color: '#10b981', desc: 'Growth and stability detected. Your onchain presence is radiating life.' },
  { name: 'SOLAR FLARE', color: '#f59e0b', desc: 'High energy resonance. A perfect moment to initiate new protocols.' },
  { name: 'CRIMSON PULSE', color: '#ef4444', desc: 'Raw, unyielding power. Your aura is breaking through the mempool noise.' },
  { name: 'ELECTRIC SHARD', color: '#06b6d4', desc: 'Precision and clarity. Your digital spirit is operating at peak efficiency.' },
];

export default function Home() {
  const { isConnected, address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { sendTransaction } = useSendTransaction();
  
  const [stage, setStage] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [myMood, setMyMood] = useState(AURA_MOODS[0]);
  const [impulseTarget, setImpulseTarget] = useState<string | null>(null);

  // Вычисляем "Вайб" на основе адреса
  useEffect(() => {
    if (address) {
      const index = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % AURA_MOODS.length;
      setMyMood(AURA_MOODS[index]);
    }
  }, [address]);

  const handleCheckAura = async () => {
    if (!isConnected || !address) return;
    if (chainId !== base.id) {
      switchChain({ chainId: base.id });
      return;
    }

    setStage('syncing');
    const hexData = '0x417572612050756c73652052697475616c'; 

    sendTransaction({
      to: address as `0x${string}`,
      value: parseEther('0'),
      data: hexData as `0x${string}`,
    }, {
      onSuccess: () => setStage('synced'),
      onError: () => setStage('idle'),
    });
  };

  const triggerSocialImpulse = (target: string) => {
    setImpulseTarget(target);
    setTimeout(() => setImpulseTarget(null), 2000);
  };

  return (
    <main className={`app-container ${stage}`}>
      {/* ФОНОВАЯ ПУЛЬСАЦИЯ */}
      <div 
        className="mystic-field" 
        style={{ '--current-color': myMood.color } as React.CSSProperties}
      ></div>
      
      <div className="ui-content">
        <header className="flex justify-end p-4">
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

        <section className="ritual-view">
          <div className="aura-visual">
            <div 
              className={`sphere ${stage === 'synced' ? 'active' : ''}`} 
              style={{ '--glow': myMood.color } as React.CSSProperties}
            ></div>
            <div className="rings" style={{ '--glow': myMood.color } as React.CSSProperties}>
              <span></span><span></span><span></span>
            </div>
          </div>

          {/* КАРТОЧКА ОПИСАНИЯ (ПОЯВЛЯЕТСЯ ПОСЛЕ ТРАНЗЫ) */}
          <div className={`mood-card ${stage === 'synced' ? 'visible' : ''}`}>
            <h2 style={{ color: myMood.color }}>{myMood.name}</h2>
            <p>{myMood.desc}</p>
          </div>

          <div className="branding-text">
            <h1 className="title">AURA PULSE</h1>
            <p className="subtitle">{stage === 'synced' ? 'RESONANCE ESTABLISHED' : 'Connect to reveal your frequency'}</p>
          </div>

          {isConnected && stage !== 'synced' && (
            <button 
              onClick={handleCheckAura} 
              className="ritual-btn" 
              disabled={stage === 'syncing'}
            >
              {stage === 'syncing' ? 'RECORDING ONCHAIN...' : 'ACTIVATE PULSE'}
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
              <div key={f.addr} className="friend-row" onClick={() => triggerSocialImpulse(f.addr)}>
                <Avatar address={f.addr as `0x${string}`} className="h-10 w-10 border" style={{borderColor: f.color}} />
                <div className="ml-3 text-left">
                  <Name address={f.addr as `0x${string}`} className="text-sm font-bold block" />
                  <span className="text-[9px] uppercase tracking-wider" style={{color: impulseTarget === f.addr ? '#fff' : '#666'}}>
                    {impulseTarget === f.addr ? '⚡ IMPULSE SENT' : 'TAP TO RESONATE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; overflow: hidden; font-family: 'Inter', sans-serif; }
        .mystic-field { position: absolute; inset: 0; background: radial-gradient(circle at 50% 30%, var(--current-color) 0%, #000 100%); opacity: 0.15; transition: 2s; z-index: 0; }
        
        .ui-content { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
        .ritual-view { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        
        .aura-visual { position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; }
        .sphere { width: 60px; height: 60px; background: #fff; border-radius: 50%; box-shadow: 0 0 50px var(--glow); transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .sphere.active { transform: scale(1.6); filter: brightness(1.2); box-shadow: 0 0 100px var(--glow); }
        
        .rings span { position: absolute; inset: 0; border: 1px solid var(--glow); border-radius: 50%; opacity: 0; animation: waves 4s infinite linear; }
        .rings span:nth-child(2) { animation-delay: 1.3s; }
        .rings span:nth-child(3) { animation-delay: 2.6s; }
        @keyframes waves { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(2.8); opacity: 0; } }

        .mood-card { opacity: 0; transform: translateY(20px); transition: 1.2s ease; margin: 25px 0; max-width: 280px; }
        .mood-card.visible { opacity: 1; transform: translateY(0); }
        .mood-card h2 { font-size: 1.4rem; letter-spacing: 5px; margin: 0 0 8px; font-weight: 300; }
        .mood-card p { font-size: 0.8rem; color: #aaa; line-height: 1.6; }

        .title { font-size: 2.4rem; font-weight: 200; letter-spacing: 14px; margin: 10px 0; }
        .subtitle { font-size: 0.6rem; color: #555; letter-spacing: 3px; text-transform: uppercase; }
        
        .ritual-btn { margin-top: 35px; background: #fff; color: #000; border: none; padding: 18px 50px; border-radius: 100px; font-weight: 800; letter-spacing: 2px; cursor: pointer; transition: 0.3s; }
        .ritual-btn:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(255,255,255,0.3); }

        .wallet-pill { background: rgba(255,255,255,0.06) !important; border-radius: 100px !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.1) !important; }

        .social-footer { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border-radius: 40px; padding: 25px; border: 1px solid rgba(255,255,255,0.05); margin-top: auto; }
        .label { font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #555; margin-bottom: 15px; display: block; }
        .friends-list { display: flex; flex-direction: column; gap: 12px; }
        .friend-row { display: flex; align-items: center; background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 25px; cursor: pointer; border: 1px solid transparent; transition: 0.3s; }
        .friend-row:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }
      `}</style>
    </main>
  );
}