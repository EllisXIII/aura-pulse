'use client';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="z-10 w-full max-w-md text-center space-y-8">
        <h1 className="text-6xl font-bold tracking-tighter animate-pulse">
          AURA PULSE
        </h1>
        <p className="text-gray-400 text-lg uppercase tracking-widest">
          Onchain Daily Ritual
        </p>
        
        <div className="py-10">
          <button 
            onClick={() => alert('Syncing your vibe...')}
            className="px-8 py-4 border border-white hover:bg-white hover:text-black transition-all duration-300 font-bold uppercase tracking-tighter"
          >
            Check your Aura
          </button>
        </div>

        <div className="text-xs text-gray-600 uppercase pt-20">
          Connected to Base Ecosystem
        </div>
      </div>
    </main>
  );
}