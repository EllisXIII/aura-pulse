import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || 'AURA PULSE';
  const color = searchParams.get('color') || '#a855f7';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Фоновый градиент как в приложении */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 40%, ${color} 0%, #000 100%)`,
            opacity: 0.4,
          }}
        />
        
        {/* Центральная сфера */}
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: '#fff',
            boxShadow: `0 0 80px ${color}`,
            display: 'flex',
          }}
        />
        
        <h1 style={{ fontSize: 80, color: 'white', letterSpacing: 20, marginTop: 60 }}>
          {name}
        </h1>
        <p style={{ color: '#555', fontSize: 24, letterSpacing: 10, textTransform: 'uppercase' }}>
          ONCHAIN RESONANCE
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}