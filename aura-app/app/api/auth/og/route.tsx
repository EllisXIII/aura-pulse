import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
          backgroundColor: '#000',
          backgroundImage: 'radial-gradient(circle at 50% 40%, #a855f7 0%, #000 70%)',
        }}
      >
        {/* Центральная сфера (как в игре) */}
        <div
          style={{
            display: 'flex',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: '#fff',
            boxShadow: '0 0 80px 20px #a855f7',
            marginBottom: 40,
          }}
        />
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: 200,
              color: 'white',
              letterSpacing: '15px',
              margin: 0,
            }}
          >
            AURA PULSE
          </h1>
          <p
            style={{
              fontSize: 30,
              color: '#555',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginTop: 20,
            }}
          >
            Establish Onchain Connection
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}