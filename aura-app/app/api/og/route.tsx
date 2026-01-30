
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const trait = searchParams.get('trait') ?? 'Visionary';
  const color = searchParams.get('color') ?? 'ec4899';

  const imageData = await fetch(new URL('./AuraPulseBG.png', import.meta.url)).then(
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
          backgroundImage: `url(data:image/png;base64,${Buffer.from(imageData).toString('base64')})`,
          backgroundSize: '1200px 630px',
          color: `#${color}`,
          textShadow: `0 0 20px #${color}`,
        }}
      >
        <div style={{ fontSize: 90, marginBottom: 20 }}>{trait}</div>
        <div style={{ fontSize: 30, color: '#ccc' }}>Your onchain frequency. Measured on Aura Pulse.</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
