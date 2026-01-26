'use client';

import React, { useState, useEffect } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { useAccount, useSendTransaction, useSwitchChain, useTransactionCount } from 'wagmi';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';

// --- Расширенный список мистических состояний ---
const AURA_MOODS = [
  { name: 'VIOLET NEBULA', color: '#a855f7', trait: 'Intuitive' },
  { name: 'CYBER EMERALD', color: '#10b981', trait: 'Stable' },
  { name: 'SOLAR FLARE', color: '#f59e0b', trait: 'Radiant' },
  { name: 'ELECTRIC SHARD', color: '#06b6d4', trait: 'Precise' },
  { name: 'CRIMSON PULSE', color: '#ef4444', trait: 'Powerful' },
  { name: 'GHOST SHELL', color: '#94a3b8', trait: 'Stealthy' },
  { name: 'NEON DREAM', color: '#ec4899', trait: 'Visionary' },
];

export default function Home() {
  const { isConnected, address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { sendTransaction } = useSendTransaction();
  
  // Получаем реальное количество транзакций пользователя в сети Base
  const { data: txCount } = useTransactionCount({ address, chainId: base.id });
  
  const [stage, setStage] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [myMood, setMyMood] = useState(AURA_MOODS[0]);
  const [generativeText, setGenerativeText] = useState('');

  // ГЕНЕРАТОР ОПИСАНИЯ (Имитация ИИ)
  const generateAuraMessage = (mood: typeof AURA_MOODS[0], txs: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    const intros = [
      `It is ${dayStr}, ${timeStr}.`,
      `The clock shows ${timeStr} on this ${dayStr}.`,
      `Base network resonance at ${timeStr}.`
    ];
    
    const txComments = txs > 50 
      ? `With ${txs} transactions, your onchain weight is massive.` 
      : `Your ${txs} steps on Base have led to this moment.`;
      
    const vibes = [
      `Your ${mood.trait} frequency is peaking.`,
      `The ${mood.name} energy is dominant in your sector.`,
      `Digital alignment: ${mood.trait} state detected.`
    ];

    return `${intros[now.getSeconds() % 3]} ${txComments} ${vibes[now.getMinutes() % 3]}`;
  };

  useEffect(() => {
    if (address && txCount !== undefined) {
      const dateSeed = new Date().toDateString();
      const combinedSeed = address + dateSeed + txCount.toString();
      const index = combinedSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % AURA_MOODS.length;
      
      const selectedMood = AURA_MOODS[index];
      setMyMood(selectedMood);
      setGenerativeText(generateAuraMessage(selectedMood, txCount));
    }
  }, [address, txCount]);

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

  return (
    <main className={`app-container ${stage}`}>
      <div className="bg-blur" style={{ '--color': myMood.color } as React.CSSProperties}></div>
      
      <div className="ui-content">
        <header className="flex justify-end p-4">
          <Wallet>
            <ConnectWallet className="wallet-btn">
              <Avatar className="h-6 w-6" /><Name className="ml-2" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick><Avatar /><Name /><Address /></Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </header>

        <section className="ritual-main">
          <div className="visual">
            <div className={`core ${stage === 'synced' ? 'active' : ''}`} style={{ '--glow': myMood.color } as React.CSSProperties}></div>
            <div className="rings" style={{ '--glow': myMood.color } as React.CSSProperties}>
              <span></span><span></span>
            </div>
          </div>

          <div className={`aura-card ${stage === 'synced' ? 'visible' : ''}`}>
            <h2 style={{ color: myMood.color }}>{myMood.name}</h2>
            <p className="generative-text">{generativeText}</p>
          </div>

          <div className="title-area">
            <h1 className="main-title">AURA PULSE</h1>
            <p className="sub">{stage === 'synced' ? 'PULSE RECORDED ONCHAIN' : 'Establish Onchain Connection'}</p>
          </div>

          {isConnected && stage !== 'synced' && (
            <button onClick={handleCheckAura} className="ritual-btn" disabled={stage === 'syncing'}>
              {stage === 'syncing' ? 'RECORDING...' : 'CHECK AURA'}
            </button>
          )}
        </section>

        <footer className="footer-status">
          <div className="network-tag">
            <div className="pulse-dot" style={{ background: myMood.color } as React.CSSProperties}></div>
            <span>Base Mainnet</span>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; font-family: 'Inter', sans-serif; overflow: hidden; }
        .bg-blur { position: absolute; inset: 0; background: radial-gradient(circle at 50% 30%, var(--color) 0%, #000 100%); opacity: 0.15; transition: 2s; z-index: 0; }
        .ui-content { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
        .ritual-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .visual { position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; }
        .core { width: 60px; height: 60px; background: #fff; border-radius: 50%; box-shadow: 0 0 50px var(--glow); transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .core.active { transform: scale(1.5); box-shadow: 0 0 100px var(--glow); }
        .rings span { position: absolute; inset: 0; border: 1px solid var(--glow); border-radius: 50%; opacity: 0; animation: waves 4s infinite linear; }
        .rings span:nth-child(2) { animation-delay: 2s; }
        @keyframes waves { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
        .aura-card { opacity: 0; transform: translateY(20px); transition: 1s ease; margin: 30px 0; max-width: 300px; }
        .aura-card.visible { opacity: 1; transform: translateY(0); }
        .aura-card h2 { font-size: 1.4rem; letter-spacing: 5px; margin: 0 0 10px; }
        .generative-text { font-size: 0.85rem; color: #888; line-height: 1.6; font-style: italic; }
        .main-title { font-size: 2.2rem; font-weight: 200; letter-spacing: 12px; margin: 10px 0; }
        .sub { font-size: 10px; color: #444; letter-spacing: 4px; text-transform: uppercase; }
        .ritual-btn { margin-top: 40px; background: #fff; color: #000; border: none; padding: 18px 55px; border-radius: 100px; font-weight: 800; letter-spacing: 2px; cursor: pointer; }
        .wallet-btn { background: rgba(255,255,255,0.06) !important; border-radius: 100px !important; color: #fff !important; }
        .footer-status { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border-radius: 40px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .network-tag { display: flex; align-items: center; justify-content: center; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #666; }
        .pulse-dot { width: 6px; height: 6px; border-radius: 50%; margin-right: 10px; animation: blink 2s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </main>
  );
}