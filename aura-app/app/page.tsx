'use client';
import React, { useState } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';

export default function Home() {
  const { isConnected, address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { sendTransaction } = useSendTransaction();
  const [stage, setStage] = useState<'idle' | 'syncing' | 'synced'>('idle');

  const handleCheckAura = async () => {
    if (!isConnected || !address) return;
    if (chainId !== base.id) { switchChain({ chainId: base.id }); return; }

    setStage('syncing');
    
    // Метка "Aura Pulse Ritual" в Hex-формате для заметности в BaseScan
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

  return (
    <main className={`main-wrap ${stage}`}>
      <div className="mystic-void"></div>
      
      <div className="content-layer">
        <header className="flex justify-end p-6">
          <Wallet>
            <ConnectWallet className="pill-btn">
              <Avatar className="h-6 w-6" /><Name className="ml-2" />
            </ConnectWallet>
            <WalletDropdown><Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick><Avatar /><Name /><Address /></Identity><WalletDropdownDisconnect /></WalletDropdown>
          </Wallet>
        </header>

        <section className="aura-ritual">
          <div className="visual-core">
            <div className={`sphere ${stage === 'synced' ? 'active' : ''}`}></div>
            <div className="waves"><span></span><span></span></div>
          </div>
          <h1 className="title">AURA PULSE</h1>
          <p className="status-label">{stage === 'synced' ? 'RECORDED IN ETERNITY' : 'Sync your digital frequency'}</p>
          
          {isConnected && stage !== 'synced' && (
            <button onClick={handleCheckAura} className="ritual-btn">
              {stage === 'syncing' ? 'RECORDING...' : 'CHECK AURA'}
            </button>
          )}
        </section>

        <footer className="footer-panel">
          <div className="pulse-indicator">
            <div className="dot"></div>
            <span>Base Network Live</span>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; font-family: 'Inter', sans-serif; overflow: hidden; }
        .mystic-void { position: absolute; inset: 0; background: radial-gradient(circle at 50% 35%, #150a25 0%, #000 100%); z-index: 0; }
        .content-layer { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; }
        .aura-ritual { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .visual-core { position: relative; width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .sphere { width: 70px; height: 70px; background: #fff; border-radius: 50%; box-shadow: 0 0 50px #a855f7; transition: 1.5s; }
        .sphere.active { transform: scale(1.3); box-shadow: 0 0 100px #a855f7; }
        .waves span { position: absolute; inset: 0; border: 1px solid #a855f7; border-radius: 50%; animation: pulse-out 4s infinite linear; opacity: 0; }
        .waves span:nth-child(2) { animation-delay: 2s; }
        @keyframes pulse-out { 0% { transform: scale(0.7); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }
        .title { font-size: 2.2rem; font-weight: 200; letter-spacing: 12px; margin: 10px 0; }
        .status-label { font-size: 10px; color: #555; letter-spacing: 4px; text-transform: uppercase; }
        .ritual-btn { margin-top: 50px; background: #fff; color: #000; border: none; padding: 18px 50px; border-radius: 100px; font-weight: 800; letter-spacing: 2px; cursor: pointer; transition: 0.3s; }
        .pill-btn { background: rgba(255,255,255,0.06) !important; border-radius: 100px !important; color: #fff !important; }
        .footer-panel { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); border-radius: 40px 40px 0 0; padding: 25px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; }
        .dot { width: 6px; height: 6px; background: #a855f7; border-radius: 50%; box-shadow: 0 0 10px #a855f7; animation: blink 2s infinite; display: inline-block; margin-right: 8px; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </main>
  );
}