'use client';

import React, { useState, useEffect } from 'react';
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

// Список "Друзей" (Nearby Auras) — можно заменить на реальные адреса
const NEARBY_FRIENDS = [
  { address: '0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9', color: '#10b981' }, // Emerald
  { address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1', color: '#ec4899' }, // Neon
  { address: '0x7bAdEEdE5A4EEea6Cf8c21BeB6B102feeb0AdE57', color: '#f59e0b' }, // Solar
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const [stage, setStage] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  // Логика "Импульса"
  const sendImpulse = (friendAddress: string) => {
    if (!isConnected) return;
    setSelectedFriend(friendAddress);
    
    // Отправляем 0 ETH (Gas only) как импульс в сети Base
    sendTransaction({
      to: friendAddress as `0x${string}`,
      value: parseEther('0'),
    });
  };

  return (
    <main className={`container ${stage}`}>
      {/* МИСТИЧЕСКИЙ ПУЛЬСИРУЮЩИЙ ФОН */}
      <div className="mystic-atmosphere">
        <div className="aura-cloud cloud-1"></div>
        <div className="aura-cloud cloud-2"></div>
      </div>

      <div className="interface">
        <header className="header">
          {/* Рекомендованный Base Wallet компонент */}
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
          <p className="subtitle">Daily Onchain Resonance</p>
        </section>

        {/* NEARBY AURAS (SOCIAL LAYER) */}
        <section className="social-layer">
          <h3 className="section-label">Nearby Auras</h3>
          <div className="friends-grid">
            {NEARBY_FRIENDS.map((friend) => (
              <div 
                key={friend.address} 
                className={`friend-card ${selectedFriend === friend.address ? 'active' : ''}`}
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
        body { background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }

        /* ФОНОВАЯ ПУЛЬСАЦИЯ */
        .mystic-atmosphere { position: absolute; inset: 0; z-index: -1; filter: blur(100px); }
        .aura-cloud { position: absolute; border-radius: 50%; opacity: 0.2; animation: float 20s infinite ease-in-out; }
        .cloud-1 { width: 80vw; height: 80vw; background: var(--accent); top: -20%; left: -20%; }
        .cloud-2 { width: 60vw; height: 60vw; background: #ec4899; bottom: -10%; right: -10%; animation-delay: -5s; }

        @keyframes float {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.2; }
          50% { transform: translate(10%, 5%) scale(1.2); opacity: 0.4; }
        }

        /* ИНТЕРФЕЙС */
        .interface { display: flex; flexDirection: column; minHeight: 100vh; padding: 20px; zIndex: 1; }
        .header { display: flex; justifyContent: flex-end; }
        .base-wallet-style { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important; borderRadius: 30px !important; }

        /* РИТУАЛ */
        .main-ritual { flex: 1; display: flex; flexDirection: column; alignItems: center; justifyContent: center; }
        .central-aura { position: relative; width: 200px; height: 200px; marginBottom: 30px; }
        .core-glow { position: absolute; inset: 40px; background: #fff; borderRadius: 50%; boxShadow: 0 0 80px var(--accent); animation: core-breathe 4s infinite ease-in-out; zIndex: 2; }
        
        .pulse-waves span { position: absolute; inset: 0; border: 1px solid var(--accent); borderRadius: 50%; animation: waves 4s infinite linear; opacity: 0; }
        .pulse-waves span:nth-child(2) { animation-delay: 1.3s; }
        .pulse-waves span:nth-child(3) { animation-delay: 2.6s; }

        @keyframes core-breathe { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.3); opacity: 1; } }
        @keyframes waves { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }

        .title { fontSize: 2.5rem; fontWeight: 200; letterSpacing: 10px; margin: 0; }
        .subtitle { fontSize: 0.7rem; color: #666; letterSpacing: 4px; textTransform: uppercase; }

        /* СОЦИАЛЬНЫЙ СЛОЙ */
        .social-layer { background: rgba(255,255,255,0.02); backdropFilter: blur(20px); borderRadius: 30px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .section-label { fontSize: 0.6rem; textTransform: uppercase; color: #444; letterSpacing: 2px; marginBottom: 15px; }
        .friends-grid { display: flex; flexDirection: column; gap: 12px; }
        .friend-card { padding: 12px; borderRadius: 18px; background: rgba(0,0,0,0.3); border: 1px solid transparent; cursor: pointer; transition: 0.3s; }
        .friend-card:hover { border-color: var(--accent); background: rgba(255,255,255,0.05); }
        .friend-info { marginLeft: 10px; display: flex; flexDirection: column; }
        .friend-name { fontWeight: 600; fontSize: 0.9rem; }
        .pulse-action { fontSize: 0.6rem; color: var(--accent); textTransform: uppercase; opacity: 0.7; }
      `}</style>
    </main>
  );
}