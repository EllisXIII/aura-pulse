'use client';

import React, { useState } from 'react';

export default function Home() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 3000);
  };

  return (
    <main style={styles.container}>
      {/* Фоновое свечение */}
      <div style={styles.backgroundGlow} />

      <div style={styles.content}>
        <header style={styles.header}>
          <span style={styles.badge}>Base Network Live</span>
        </header>

        {/* Центральный элемент: Пульсирующая Аура */}
        <div style={styles.auraContainer}>
          <div style={{
            ...styles.auraBase,
            animation: isSyncing ? 'sync-pulse 0.5s infinite' : 'float 6s infinite ease-in-out'
          }}>
            <div style={styles.auraInner} />
          </div>
          {/* Слой отражения */}
          <div style={styles.auraRing} />
        </div>

        <section style={styles.textSection}>
          <h1 style={styles.title}>AURA PULSE</h1>
          <p style={styles.subtitle}>
            {isSyncing ? 'Reading onchain vibrations...' : 'Sync your digital frequency'}
          </p>
        </section>

        <footer style={styles.footer}>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            style={{
              ...styles.mainButton,
              opacity: isSyncing ? 0.6 : 1,
              transform: isSyncing ? 'scale(0.98)' : 'scale(1)'
            }}
          >
            {isSyncing ? 'SYNCING...' : 'CHECK YOUR AURA'}
          </button>
          
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Status</span>
              <span style={styles.statValue}>Optimal</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Sync</span>
              <span style={styles.statValue}>98%</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Глобальные анимации */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); filter: blur(20px); }
          50% { transform: translateY(-20px) scale(1.1); filter: blur(35px); }
        }
        @keyframes sync-pulse {
          0% { box-shadow: 0 0 0px 0px rgba(255,255,255,0.2); }
          100% { box-shadow: 0 0 50px 20px rgba(255,255,255,0); }
        }
        body { margin: 0; padding: 0; background: #000; overflow: hidden; }
      `}</style>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Inter", system-ui, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGlow: {
    position: 'absolute',
    top: '20%',
    width: '100vw',
    height: '60vh',
    background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
  },
  content: {
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '360px',
    padding: '40px 20px',
  },
  header: {
    marginBottom: 'auto',
  },
  badge: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '6px 12px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    color: '#666',
  },
  auraContainer: {
    position: 'relative',
    width: '240px',
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '60px 0',
  },
  auraBase: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.8)',
    filter: 'blur(25px)',
    transition: 'all 0.3s ease',
  },
  auraInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #fff, #333)',
  },
  auraRing: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  textSection: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '800',
    letterSpacing: '-2px',
    margin: '0 0 10px 0',
    background: 'linear-gradient(to bottom, #fff 40%, #444 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#666',
    letterSpacing: '4px',
    textTransform: 'uppercase',
  },
  footer: {
    width: '100%',
    marginTop: 'auto',
  },
  mainButton: {
    width: '100%',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    padding: '22px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 10px 20px rgba(255,255,255,0.1)',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30px',
    gap: '20px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '10px',
    color: '#444',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '12px',
    color: '#aaa',
    fontWeight: '600',
  },
  statDivider: {
    width: '1px',
    height: '20px',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
};