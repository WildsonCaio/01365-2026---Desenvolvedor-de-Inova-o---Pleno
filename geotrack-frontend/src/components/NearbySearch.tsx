'use client';

import { useState } from 'react';
import { carService } from '@/services/api';
import { Car, NearbySearchParams } from '@/types';
import { Navigation, Search, Loader2, MapPin } from 'lucide-react';

interface NearbySearchProps {
  onSearch: (params: NearbySearchParams, results: Car[]) => void;
  onClear: () => void;
}

export default function NearbySearch({ onSearch, onClear }: NearbySearchProps) {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<NearbySearchParams>({
    lat: -27.5954,
    lon: -48.5480,
    radius_km: 10,
  });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await carService.getNearby(params);
      onSearch(params, results);
      setHasSearched(true);
    } catch (err) {
      alert('Erro ao buscar veículos próximos');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setHasSearched(false);
    onClear();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Navigation className="w-5 h-5 text-slate-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Buscar Carros Próximos</h2>
        </div>
        {hasSearched && (
          <button 
            onClick={handleClear}
            className="text-xs font-semibold text-rose-500 hover:underline"
          >
            Limpar Resultados
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Latitude</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="number" 
              step="any"
              value={params.lat}
              onChange={e => setParams({...params, lat: parseFloat(e.target.value)})}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5" 
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Longitude</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="number" 
              step="any"
              value={params.lon}
              onChange={e => setParams({...params, lon: parseFloat(e.target.value)})}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5" 
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Raio (KM)</label>
          <input 
            type="number" 
            value={params.radius_km}
            onChange={e => setParams({...params, radius_km: parseFloat(e.target.value)})}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5" 
          />
        </div>
        <div className="flex items-end">
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition text-sm h-[40px] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Buscar Proximidade
          </button>
        </div>
      </div>
    </div>
  );
}
