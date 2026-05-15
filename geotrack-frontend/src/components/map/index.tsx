'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-xl bg-slate-100 animate-pulse flex items-center justify-center border border-slate-200 text-slate-400">
      Carregando mapa...
    </div>
  ),
});

export default Map;
