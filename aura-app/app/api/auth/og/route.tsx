import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Получаем параметры из URL или ставим дефолтные
  // В URL цвет передается без решетки (например, a855f7), добавляем её обратно.
  const colorParam = searchParams.get('color');
  const color = colorParam ? `#${colorParam}` : '#a855f7'; 
  const trait = searchParams.get('trait') ? searchParams.get('trait')?.toUpperCase() : 'AURA PULSE';

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
          // Динамический градиент фона
          backgroundImage: `radial-gradient(circle at 50% 40%, ${color} 0%, #000 70%)`,
        }}
      >
        {/* Центральная сфера с динамическим свечением */}
        <div
          style={{
            display: 'flex',
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: '#fff',
            // Динамическая тень
            boxShadow: `0 0 100px 30px ${color}`,
            marginBottom: 50,
          }}
        />
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Динамическое название трейта */}
          <h1
            style={{
              fontSize: 70,
              fontWeight: 900,
              color: color, // Цвет текста совпадает с аурой
              letterSpacing: '10px',
              margin: 0,
              textTransform: 'uppercase',
              textShadow: `0 0 20px ${color}`,
            }}
          >
            {trait}
          </h1>
          <p
            style={{
              fontSize: 30,
              color: '#fff',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginTop: 20,
              opacity: 0.8,
            }}
          >
            Onchain Frequency Established
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