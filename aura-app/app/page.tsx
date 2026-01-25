'use client';

import React, { useState, useEffect } from 'react';
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';

// --- Вспомогательная логика (Генерация вайба от адреса) ---
const AURA_VIBES = [
  { color: '#6366f1', name: 'Indigo Mystic', desc: 'Deep intuition actively scanning the mempool.' },
  { color: '#10b981', name: 'Emerald Growth', desc: 'Your liquidity is flowing in alignment.' },
  { color: '#f59e0b', name: 'Solar Flare', desc: 'Creative energy peaking. Time to deploy.' },
  { color: '#ec4899', name: 'Neon Dreamer', desc: 'Reality is pliable. Shape the chain.' },
  { color: '#06b6d4', name: 'Cyan Clarity', desc: 'Zero-knowledge proof of supreme focus.' },
];

const getAuraFromAddress = (address: string | undefined) => {
  if (!address) return AURA_VIBES[0];
  // Простой хак: сумма кодов символов адреса для выбора вайба
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AURA_VIBES[hash % AURA_VIBES.length];
};

// --- Основной Компонент ---
export default function Home() {
  const { address, isConnected } = useAccount();
  const [stage, setStage] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [myAura, setMyAura] = useState(AURA_VIBES[0]);

  // Сброс при отключении кошелька
  useEffect(() => {
    if (!isConnected) {
      setStage('idle');
    }
  }, [isConnected]);

  const startRitual = () => {
    if (!isConnected || stage === 'syncing') return;
    setStage('syncing');
    // Магия: вычисляем ауру на основе адреса
    setMyAura(getAuraFromAddress(address));

    // Симуляция тяжелого процесса чтения чейна (4 секунды)
    setTimeout(() => {
      setStage('synced');
    }, 4000);
  };

  // Динамические стили на основе состояния
  const mainColor = stage === 'synced' ? myAura.color : '#a855f7';
  const isSyncing = stage === 'syncing';
  const isSynced = stage === 'synced';

  return (
    <main style={styles.container} className={isSyncing ? 'syncing-mode' : ''}>
      {/* Фоновые орбиты */}
      <div style={styles.mysticCanvas}>
        <div className="orb orb1" style={{ '--orb-color': mainColor } as React.CSSProperties} />
        <div className="orb orb2" style={{ '--orb-color': isSynced ? '#fff' : '#ec4899' } as React.CSSProperties} />
      </div>

      <div style={styles.content}>
        <header style={styles.header}>
          <Wallet>
            <ConnectWallet className="bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all">
              <Avatar className="h-6 w-6" />
              <Name className="text-gray-200" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </header>

        <section style={styles.auraSection}>
          {/* ЦЕНТРАЛЬНОЕ ЯДРО АУРЫ */}
          <div className={`aura-container ${stage}`}>
            <div className="aura-ring ring-1" style={{ '--aura-color': mainColor } as React.CSSProperties}></div>
            <div className="aura-ring ring-2" style={{ '--aura-color': mainColor } as React.CSSProperties}></div>
            <div className="aura-core" style={{ '--aura-color': mainColor } as React.CSSProperties}>
              {isSynced && <div className="synced-icon">✧</div>}
            </div>
          </div>
          
          {!isSynced ? (
            <>
              <h1 style={styles.title}>AURA PULSE</h1>
              <p style={styles.ritualText}>Establish Onchain Connection</p>
            </>
          ) : (
            <div style={styles.resultCard} className="slide-up">
              <h2 style={{...styles.resultTitle, color: mainColor}}>{myAura.name}</h2>
              <p style={styles.resultDesc}>{myAura.desc}</p>
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          {!isSynced && (
            <button 
              onClick={startRitual}
              disabled={!isConnected || isSyncing}
              className={`ritual-button ${isConnected ? 'active' : 'disabled'} ${isSyncing ? 'pulsing' : ''}`}
              style={{ '--btn-color': mainColor } as React.CSSProperties}
            >
              {!isConnected ? 'CONNECT WALLET FIRST' : isSyncing ? 'SYNCING FREQUENCIES...' : 'BEGIN RITUAL'}
            </button>
          )}
           {isSynced && (
             <div style={styles.statusBox}>
               <span style={{...styles.statusDot, background: mainColor}} />
               <span style={styles.statusLabel}>Ritual Complete. Come back tomorrow.</span>
             </div>
           )}
        </footer>
      </div>

      {/* --- ГЛОБАЛЬНЫЕ CSS АНИМАЦИИ --- */}
      <style jsx global>{`
        body { background: #020205; margin: 0; overflow: hidden; font-family: "Inter", sans-serif; }
        
        /* Анимации фона */
        .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.3; transition: background 2s ease; background: var(--orb-color); }
        .orb1 { top: 10%; left: 20%; width: 400px; height: 400px; animation: mystic-float 15s infinite ease-in-out; }
        .orb2 { bottom: 10%; right: 10%; width: 500px; height: 500px; animation: mystic-float 20s infinite ease-in-out reverse; }

        /* Состояния АУРЫ */
        .aura-container { position: relative; width: 200px; height: 200px; display: flex; justify-content: center; alignItems: center; margin-bottom: 40px; transition: all 0.5s ease; }
        .aura-core { width: 80px; height: 80px; border-radius: 50%; background: #fff; zIndex: 2; transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 60px 20px var(--aura-color); display: flex; justify-content: center; align-items: center; color: var(--aura-color); font-size: 24px;}
        .aura-ring { position: absolute; border-radius: 50%; border: 2px solid var(--aura-color); opacity: 0.5; }
        
        /* Idle State */
        .aura-container.idle .aura-core { animation: glow-shift 8s infinite alternate; }
        .aura-container.idle .ring-1 { width: 100%; height: 100%; animation: pulse-ring 4s infinite ease-out; }
        .aura-container.idle .ring-2 { display: none; }

        /* Syncing State - ЭПИЧЕСКАЯ ФАЗА */
        .syncing-mode .mysticCanvas { transition: transform 4s ease; transform: scale(1.5) rotate(5deg); }
        .aura-container.syncing .aura-core { width: 120px; height: 120px; background: var(--aura-color); box-shadow: 0 0 100px 50px var(--aura-color); animation: violent-shake 0.5s infinite, intense-glow 1s infinite alternate; color: white;}
        .aura-container.syncing .ring-1 { width: 150%; height: 150%; border-width: 4px; animation: implode 0.8s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .aura-container.syncing .ring-2 { width: 200%; height: 200%; border-width: 1px; animation: pulse-ring 0.4s infinite ease-out; }

        /* Synced State - ФИНАЛ */
        .aura-container.synced .aura-core { width: 100px; height: 100px; background: #000; border: 3px solid var(--aura-color); box-shadow: 0 0 40px var(--aura-color); }
        .aura-container.synced .ring-1 { width: 300%; height: 300%; opacity: 0; transition: all 1s ease; }
        .aura-container.synced .synced-icon { animation: fade-in 1s ease forwards; }

        /* Кнопка */
        .ritual-button { width: 100%; padding: 20px; border-radius: 12px; font-family: "Cinzel", serif; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; transition: all 0.3s ease; border: none; background: #1a1a1a; color: #666; cursor: not-allowed; }
        .ritual-button.active { background: var(--btn-color); color: #000; cursor: pointer; box-shadow: 0 10px 30px -10px var(--btn-color); }
        .ritual-button.active:hover { transform: translateY(-2px); box-shadow: 0 20px 40px -10px var(--btn-color); }
        .ritual-button.pulsing { animation: pulse-opacity 1s infinite alternate; pointer-events: none; }

        /* Карточка результата */
        .slide-up { animation: slide-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

        /* --- Ключевые кадры (Keyframes) --- */
        @keyframes mystic-float { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, -50px) scale(1.1); } }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
        @keyframes glow-shift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(30deg); } }
        @keyframes violent-shake { 0% { transform: translate(0,0) } 25% { transform: translate(-3px, 3px) } 50% { transform: translate(3px, -3px) } 75% { transform: translate(-3px, 3px) } 100% { transform: translate(0,0) } }
        @keyframes intense-glow { 0% { filter: brightness(1); } 100% { filter: brightness(2.5); } }
        @keyframes implode { 0% { transform: scale(2); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(0.5); opacity: 0; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse-opacity { 0% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { height: '100vh', width: '100vw', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Cinzel", serif', },
  mysticCanvas: { position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1, background: 'radial-gradient(circle at center, #0a0a1a 0%, #020205 100%)', pointerEvents: 'none' },
  content: { zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', width: '100%', maxWidth: '400px', padding: '40px 20px', },
  header: { width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: 'auto' },
  auraSection: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' },
  title: { fontSize: '3rem', fontWeight: '300', letterSpacing: '12px', margin: '0', textShadow: '0 0 20px rgba(255,255,255,0.3)', textAlign: 'center' },
  ritualText: { fontSize: '0.7rem', letterSpacing: '6px', textTransform: 'uppercase', color: '#888', marginTop: '10px', textAlign: 'center' },
  footer: { marginTop: 'auto', width: '100%' },
  resultCard: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', width: '100%' },
  resultTitle: { margin: '0 0 10px 0', fontSize: '1.8rem', letterSpacing: '4px', textTransform: 'uppercase' },
  resultDesc: { margin: 0, color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6' },
  statusBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '12px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', boxShadow: '0 0 10px currentColor', },
  statusLabel: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', },
};