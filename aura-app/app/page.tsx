'use client';

import React, { useState } from 'react';
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { 
  Identity, 
  Avatar, 
  Name, 
  Address 
} from '@coinbase/onchainkit/identity';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

const NEARBY_FRIENDS = [
  { address: '0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9', color: '#10b981' },
  { address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1', color: '#ec4899' },
  { address: '0x7bAdEEdE5A4EEea6Cf8c21BeB6B102feeb0AdE57', color: '#f59e0b' },
];

export default function Home() {
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const [stage, setStage] = useState<'idle' | 'syncing'>('idle');

  const sendImpulse = (friendAddress: string) => {
    if (!isConnected) return;
    setStage('syncing');
    
    sendTransaction({
      to: friendAddress as `0x${string}`,
      value: parseEther('0'),
    }, {
      onSettled: () => setStage('idle')
    });
  };

  return (
    <main className={`container ${stage}`}>
      <div className="mystic-atmosphere">
        <div className="aura-cloud cloud-1"></div>
        <div className="aura-cloud cloud-2"></div>
      </div>

      <div className="interface">
        <header className="header">
          <Wallet>
            <ConnectWallet className="base-wallet-style">
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar /><Name /><Address />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </header>

        <section className="main-ritual">
          <div className="central-aura">
            <div className="core-glow"></div>
            <div className="pulse-waves">
              <span></span><span></span><span></span>
            </div>
          </div>
          
          <h1 className="title">AURA PULSE</h1>
          <p className="subtitle">{stage === 'syncing' ? 'RESONATING...' : 'Daily Onchain Resonance'}</p>
        </section>

        <section className="social-layer">
          <h3 className="section-label">Nearby Auras</h3>
          <div className="friends-grid">
            {NEARBY_FRIENDS.map((friend) => (
              <div 
                key={friend.address} 
                className="friend-card"
                onClick={() => sendImpulse(friend.address)}
              >
                <Identity address={friend.address as `0x${string}`} schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9">
                  <Avatar className="h-10 w-10 border-2" style={{borderColor: friend.color}} />
                  <div className="friend-info">
                    <Name className="friend-name" />
                    <span className="pulse-action">Send Impulse</span>
                  </div>
                </Identity>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        :root { --accent: #a855f7; --bg: #020205; }
        body { background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow: hidden; margin: 0; }
        .mystic-atmosphere { position: absolute; inset: 0; z-index: -1; filter: blur(100px); }
        .aura-cloud { position: absolute; border-radius: 50%; opacity: 0.2; animation: float 20s infinite ease-in-out; }
        .cloud-1 { width: 80vw; height: 80vw; background: var(--accent); top: -20%; left: -20%; }
        .cloud-2 { width: 60vw; height: 60vw; background: #ec4899; bottom: -10%; right: -10%; animation-delay: -5s; }
        @keyframes float { 0%, 100% { transform: translate(0,0) scale(1); opacity: 0.2; } 50% { transform: translate(10%, 5%) scale(1.2); opacity: 0.4; } }
        .interface { display: flex; flex-direction: column; height: 100vh; padding: 20px; box-sizing: border-box; }
        .header { display: flex; justify-content: flex-end; }
        .base-wallet-style { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important; border-radius: 30px !important; }
        .main-ritual { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .central-aura { position: relative; width: 180px; height: 180px; margin-bottom: 20px; }
        .core-glow { position: absolute; inset: 40px; background: #fff; border-radius: 50%; box-shadow: 0 0 80px var(--accent); animation: core-breathe 4s infinite ease-in-out; z-index: 2; }
        .pulse-waves span { position: absolute; inset: 0; border: 1px solid var(--accent); border-radius: 50%; animation: waves 4s infinite linear; opacity: 0; }
        .pulse-waves span:nth-child(2) { animation-delay: 1.3s; }
        .pulse-waves span:nth-child(3) { animation-delay: 2.6s; }
        @keyframes core-breathe { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.3); opacity: 1; } }
        @keyframes waves { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
        .title { font-size: 2rem; font-weight: 200; letter-spacing: 10px; margin: 0; text-align: center; }
        .subtitle { font-size: 0.6rem; color: #666; letter-spacing: 4px; text-transform: uppercase; margin-top: 10px; }
        .social-layer { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); border-radius: 30px; padding: 15px; border: 1px solid rgba(255,255,255,0.05); }
        .section-label { font-size: 0.5rem; text-transform: uppercase; color: #444; letter-spacing: 2px; margin-bottom: 10px; }
        .friends-grid { display: flex; flex-direction: column; gap: 8px; }
        .friend-card { padding: 10px; border-radius: 15px; background: rgba(0,0,0,0.3); border: 1px solid transparent; cursor: pointer; transition: 0.3s; display: flex; align-items: center; }
        .friend-card:hover { border-color: var(--accent); background: rgba(255,255,255,0.05); }
        .friend-info { margin-left: 10px; display: flex; flex-direction: column; }
        .friend-name { font-weight: 600; font-size: 0.8rem; color: #eee; }
        .pulse-action { font-size: 0.5rem; color: var(--accent); text-transform: uppercase; opacity: 0.7; }
      `}</style>
    </main>
  );
}