
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams, protocol, host } = new URL(req.url);

  const trait = searchParams.get('trait') ?? 'Visionary';
  const color = searchParams.get('color') ?? 'ec4899';

  // Fetch the background image from the public folder
  const imageUrl = `${protocol}//${host}/hero.png`;
  const imageData = await fetch(imageUrl).then(
    (res) => res.arrayBuffer(),
  );

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
          backgroundColor: 'black',
          // Use the fetched image as a background
          backgroundImage: `url(data:image/png;base64,${Buffer.from(imageData).toString('base64')})`,
          backgroundSize: '1200px 630px',
        }}
      >
        {/* Overlay text on the image */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: `#${color}`,
            textShadow: `0 0 30px #${color}, 0 0 10px #fff`,
            textAlign: 'center',
            padding: '50px',
          }}
        >
          <div style={{ fontSize: 110, fontWeight: 800, marginBottom: 20 }}>{trait}</div>
          <div style={{ fontSize: 35, color: '#e5e7eb' }}>Your onchain frequency. Measured on Aura Pulse.</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
