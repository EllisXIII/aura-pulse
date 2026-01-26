'use client';

import React, { useState } from 'react';
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';

// Список "Друзей" для социального интерактива
const NEARBY_FRIENDS = [
  { address: '0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9', color: '#10b981' }, // Emerald
  { address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1', color: '#ec4899' }, // Neon
  { address: '0x7bAdEEdE5A4EEea6Cf8c21BeB6B102feeb0AdE57', color: '#f59e0b' }, // Solar
];

export default function Home() {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { sendTransaction } = useSendTransaction();
  const [isSyncing, setIsSyncing] = useState(false);

  const sendImpulse = async (friendAddress: string) => {
    if (!isConnected) return;
    
    // Проверка сети: если не Base, просим переключиться
    if (chainId !== base.id) {
      switchChain({ chainId: base.id });
      return;
    }

    setIsSyncing(true);
    
    // Отправка 0 ETH как "Импульса" в сети Base
    sendTransaction({
      to: friendAddress as `0x${string}`,
      value: parseEther('0'),
    }, {
      onSettled: () => setIsSyncing(false)
    });
  };

  return (
    <main className={`container ${isSyncing ? 'syncing' : ''}`}>
      {/* Мистический пульсирующий фон */}
      <div className="mystic-atmosphere">
        <div className="aura-cloud cloud-1"></div>
        <div className="aura-cloud cloud-2"></div>
      </div>

      <div className="interface">
        <header className="header">
          <Wallet>
            <ConnectWallet className="base-wallet-style">
              <Avatar className="h-6 w-6" />
              <Name className="ml-2" />
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
          <p className="subtitle">{isSyncing ? 'RESONATING ON BASE...' : 'Daily Onchain Resonance'}</p>
        </section>

        {/* Список друзей с исправленной разметкой */}
        <section className="social-layer">
          <h3 className="section-label">Nearby Auras</h3>
          <div className="friends-grid">
            {NEARBY_FRIENDS.map((friend) => (
              <div 
                key={friend.address} 
                className="friend-card" 
                onClick={() => sendImpulse(friend.address)}
              >
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '12px 16px' }}>
                  <Avatar address={friend.address as `0x${string}`} className="h-10 w-10 border-2" style={{borderColor: friend.color}} />
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '12px', textAlign: 'left' }}>
                    <Name address={friend.address as `0x${string}`} style={{ fontWeight: 'bold', fontSize: '14px', color: 'white' }} />
                    <span style={{ fontSize: '9px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Send Impulse
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        :root { --accent: #a855f7; --bg: #020205; }
        body { background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow: hidden; margin: 0; }
        
        .mystic-atmosphere { position: absolute; inset: 0; z-index: -1; filter: blur(100px); }
        .aura-cloud { position: absolute; border-radius: 50%; opacity: 0.15; animation: float 20s infinite ease-in-out; }
        .cloud-1 { width: 80vw; height: 80vw; background: var(--accent); top: -20%; left: -20%; }
        .cloud-2 { width: 60vw; height: 60vw; background: #ec4899; bottom: -10%; right: -10%; animation-delay: -5s; }
        
        @keyframes float { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(5%, 5%) scale(1.1); } }
        
        .interface { display: flex; flex-direction: column; height: 100vh; padding: 20px; box-sizing: border-box; z-index: 10; position: relative; }
        .header { display: flex; justify-content: flex-end; }
        
        .base-wallet-style { 
          background: rgba(255,255,255,0.07) !important; 
          border: 1px solid rgba(255,255,255,0.1) !important; 
          padding: 8px 16px !important;
          border-radius: 100px !important;
        }

        .main-ritual { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .central-aura { position: relative; width: 180px; height: 180px; margin-bottom: 20px; }
        .core-glow { position: absolute; inset: 45px; background: #fff; border-radius: 50%; box-shadow: 0 0 80px var(--accent); animation: core-breathe 4s infinite ease-in-out; z-index: 2; }
        
        @keyframes core-breathe { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.3); opacity: 1; } }

        .pulse-waves span { position: absolute; inset: 0; border: 1px solid var(--accent); border-radius: 50%; animation: waves 4s infinite linear; opacity: 0; }
        .pulse-waves span:nth-child(2) { animation-delay: 1.3s; }
        .pulse-waves span:nth-child(3) { animation-delay: 2.6s; }
        @keyframes waves { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }

        .title { font-size: 2rem; font-weight: 200; letter-spacing: 12px; margin: 0; text-align: center; }
        .subtitle { font-size: 0.6rem; color: #666; letter-spacing: 4px; text-transform: uppercase; margin-top: 10px; }

        .social-layer { background: rgba(255,255,255,0.03); backdrop-filter: blur(25px); border-radius: 32px; padding: 16px; border: 1px solid rgba(255,255,255,0.05); margin-top: auto; }
        .section-label { font-size: 0.5rem; text-transform: uppercase; color: #555; letter-spacing: 3px; margin-bottom: 12px; padding-left: 8px; }
        .friends-grid { display: flex; flex-direction: column; gap: 10px; }
        .friend-card { border-radius: 20px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.03); cursor: pointer; transition: 0.3s; }
        .friend-card:hover { border-color: var(--accent); background: rgba(255,255,255,0.06); transform: translateY(-2px); }
      `}</style>
    </main>
  );
}