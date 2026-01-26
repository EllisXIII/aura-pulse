'use client';
import React, { useState } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';

const FRIENDS = [
  { address: '0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9', color: '#10b981' },
  { address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1', color: '#ec4899' },
];

export default function Home() {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { sendTransaction } = useSendTransaction();
  const [isSyncing, setIsSyncing] = useState(false);

  const sendImpulse = (friend: string) => {
    if (!isConnected) return;
    if (chainId !== base.id) { switchChain({ chainId: base.id }); return; }
    setIsSyncing(true);
    sendTransaction({ to: friend as `0x${string}`, value: parseEther('0') }, { onSettled: () => setIsSyncing(false) });
  };

  return (
    <main className={`main-screen ${isSyncing ? 'active-pulse' : ''}`}>
      <div className="bg-animation"></div>
      
      <div className="ui-layer">
        <header className="flex justify-end p-4">
          <Wallet>
            <ConnectWallet className="wallet-pill">
              <Avatar className="h-6 w-6" /><Name className="ml-2" />
            </ConnectWallet>
            <WalletDropdown><Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick><Avatar /><Name /><Address /></Identity><WalletDropdownDisconnect /></WalletDropdown>
          </Wallet>
        </header>

        <div className="ritual-center">
          <div className="aura-sphere">
            <div className="sphere-inner"></div>
            <div className="sphere-glow"></div>
          </div>
          <h1 className="text-3xl font-light tracking-[15px] mt-8">AURA PULSE</h1>
        </div>

        <div className="social-footer">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Nearby Auras</p>
          {FRIENDS.map(f => (
            <div key={f.address} className="friend-row" onClick={() => sendImpulse(f.address)}>
              <Avatar address={f.address as `0x${string}`} className="h-10 w-10 border" style={{borderColor: f.color}} />
              <div className="ml-4 text-left">
                <Name address={f.address as `0x${string}`} className="text-sm font-bold" />
                <span className="text-[9px] text-purple-400 block">SEND IMPULSE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; overflow: hidden; font-family: sans-serif; }
        .bg-animation { position: absolute; inset: 0; background: radial-gradient(circle at center, #1a0b2e 0%, #000 100%); animation: bg-pulse 8s infinite alternate; z-index: 0; }
        @keyframes bg-pulse { 0% { opacity: 0.5; transform: scale(1); } 100% { opacity: 1; transform: scale(1.1); } }
        .ui-layer { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; }
        .ritual-center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .aura-sphere { position: relative; width: 150px; height: 150px; }
        .sphere-inner { position: absolute; inset: 0; background: #fff; border-radius: 50%; box-shadow: 0 0 50px #a855f7; animation: sphere-throb 4s infinite ease-in-out; }
        @keyframes sphere-throb { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); filter: blur(10px); } }
        .social-footer { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border-radius: 40px 40px 0 0; padding: 30px; border-top: 1px solid rgba(255,255,255,0.05); }
        .friend-row { display: flex; align-items: center; background: rgba(0,0,0,0.5); padding: 12px 20px; border-radius: 20px; margin-bottom: 10px; cursor: pointer; transition: 0.3s; }
        .friend-row:hover { background: rgba(255,255,255,0.05); border-color: #a855f7; }
        .wallet-pill { background: rgba(255,255,255,0.1) !important; border-radius: 100px !important; color: white !important; }
      `}</style>
    </main>
  );
}