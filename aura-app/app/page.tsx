'use client';

import React, { useState, useMemo } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { useAccount, useSendTransaction, useSwitchChain, useTransactionCount, useBalance } from 'wagmi';
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
  const { sendTransaction } = useSendTransaction();
  const { data: txCount, refetch: refetchTxCount } = useTransactionCount({ address, chainId: base.id });
  
  // Добавляем хук баланса, чтобы кошелек "видел" средства перед транзакцией
  const { refetch: refetchBalance } = useBalance({ address });

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
    return `Resonance confirmed. Your ${txCount || 0} steps on Base stabilized your frequency.`;
  }, [isConnected, txCount]);

  const handleCheckAura = async () => {
    if (!isConnected || !address) return;
    
    setStage('syncing');
    try {
      // КРИТИЧЕСКИЙ ФИКС: Принудительно переключаем на Base перед транзакцией
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id });
        await refetchBalance(); // Обновляем баланс после смены сети
      }

      sendTransaction({
        to: address as `0x${string}`,
        value: parseEther('0'),
        data: '0x417572612050756c73652052697475616c' as `0x${string}`,
      }, {
        onSuccess: async () => {
          await refetchTxCount();
          setStage('synced');
        },
        onError: (err) => {
          console.error(err);
          setStage('idle');
        },
      });
    } catch (e) {
      setStage('idle');
    }
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
            <ConnectWallet className="vibrant-wallet">
              <Avatar className="h-5 w-5" />
              <Name className="vibrant-name" />
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

          {stage === 'synced' && (
            <div className="mood-card visible">
              <h2 style={{ color: myMood.color }}>{myMood.name}</h2>
              <p className="description">{generativeText}</p>
            </div>
          )}

          <div className="branding">
            <h1 className="title">AURA PULSE</h1>
            <p className="subtitle">{stage === 'synced' ? 'ONCHAIN STABLE' : 'Establish Connection'}</p>
          </div>

          {isConnected && stage !== 'synced' && (
            <button onClick={handleCheckAura} className="ritual-btn" disabled={stage === 'syncing'}>
              {stage === 'syncing' ? 'SYNCING...' : 'CHECK AURA'}
            </button>
          )}
        </section>

        <section className="social-panel">
          <span className="panel-label">Resonances</span>
          <div className="friends-grid">
            {friends.slice(0, 2).map(f => ( // Показываем только 2 для компактности
              <div key={f.addr} className="friend-card" onClick={() => {
                setSplash(true);
                setImpulseStats(prev => ({ ...prev, [f.addr]: (prev[f.addr] || 0) + 1 }));
                setTimeout(() => setSplash(false), 800);
              }}>
                <div className="flicker-orb" style={{ '--orb-color': f.color } as React.CSSProperties}></div>
                <div className="friend-details">
                  <span className="friend-name-text">{f.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; overflow: hidden; font-family: sans-serif; height: 100dvh; }
        .mystic-bg { position: absolute; inset: 0; background: radial-gradient(circle at 50% 30%, var(--color) 0%, #000 100%); opacity: 0.15; }
        .ui-wrapper { height: 100dvh; display: flex; flex-direction: column; padding: 15px; justify-content: space-between; position: relative; z-index: 10; }
        
        .header { display: flex; justify-content: flex-end; }
        .vibrant-wallet { background: #fff !important; color: #000 !important; border-radius: 50px !important; padding: 6px 16px !important; font-size: 12px !important; }

        .ritual-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
        .aura-focus { position: relative; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; }
        .core { width: 50px; height: 50px; background: #fff; border-radius: 50%; box-shadow: 0 0 40px var(--glow); transition: 1s; }
        .core.active { transform: scale(1.2); }
        
        .title { font-size: 1.4rem; letter-spacing: 8px; margin: 5px 0; font-weight: 200; }
        .subtitle { font-size: 9px; color: #444; text-transform: uppercase; letter-spacing: 2px; }

        .ritual-btn { background: #fff; color: #000; border: none; padding: 12px 40px; border-radius: 50px; font-weight: 800; font-size: 13px; margin-top: 15px; }

        .social-panel { background: rgba(255,255,255,0.03); border-radius: 20px; padding: 15px; margin-bottom: 5px; }
        .panel-label { font-size: 9px; color: #666; text-transform: uppercase; display: block; margin-bottom: 10px; }
        .friends-grid { display: flex; gap: 10px; }
        .friend-card { flex: 1; display: flex; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 15px; gap: 10px; }
        .flicker-orb { width: 12px; height: 12px; border-radius: 50%; background: var(--orb-color); box-shadow: 0 0 10px var(--orb-color); }
        .friend-name-text { font-size: 11px; font-weight: 600; }

        .mood-card { text-align: center; }
        .mood-card h2 { font-size: 1.2rem; margin: 0; }
        .description { font-size: 0.75rem; color: #888; margin-top: 5px; max-width: 200px; }
        
        .rings span { position: absolute; inset: 0; border: 1px solid var(--glow); border-radius: 50%; opacity: 0; animation: waves 4s infinite linear; }
        @keyframes waves { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } }
      `}</style>
    </main>
  );
}