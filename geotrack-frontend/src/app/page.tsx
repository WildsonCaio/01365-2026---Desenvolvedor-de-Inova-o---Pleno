'use client';

import { useState, useMemo } from 'react';
import { useCars } from '@/hooks/useCars';
import Map from '@/components/map';
import CarModal from '@/components/CarModal';
import NearbySearch from '@/components/NearbySearch';
import { Car, CarStatus } from '@/types';
import { 
  Car as CarIcon, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Search, 
  RefreshCcw,
  Navigation
} from 'lucide-react';

export default function Dashboard() {
  const { cars, loading, error, fetchCars, setCars } = useCars();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CarStatus | 'ALL'>('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | undefined>(undefined);

  // Nearby State
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [currentSearchParams, setCurrentSearchParams] = useState<NearbySearchParams | undefined>(undefined);

  // Stats
  const stats = useMemo(() => {
    return {
      total: cars.length,
      working: cars.filter(c => c.status === 'WORKING').length,
      problem: cars.filter(c => c.status === 'PROBLEM').length,
    };
  }, [cars]);

  // Filtered cars
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.plate.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || car.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [cars, searchTerm, statusFilter]);

  const handleOpenModal = (car?: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleNearbySearch = (params: NearbySearchParams, results: Car[]) => {
    setCars(results);
    setCurrentSearchParams(params);
    setIsNearbyActive(true);
  };

  const handleClearNearby = () => {
    fetchCars();
    setCurrentSearchParams(undefined);
    setIsNearbyActive(false);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">{error}</h2>
        <button 
          onClick={() => fetchCars()}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">GeoTrack Fleet</h1>
            <p className="text-slate-500">Monitoramento de frota e dados climáticos em tempo real</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fetchCars()}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-50"
              title="Atualizar dados"
            >
              <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Veículo</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total de Veículos" 
            value={stats.total} 
            icon={<CarIcon className="w-6 h-6 text-blue-500" />}
            color="blue"
          />
          <StatCard 
            title="Operacionais" 
            value={stats.working} 
            icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}
            color="emerald"
          />
          <StatCard 
            title="Com Problemas" 
            value={stats.problem} 
            icon={<AlertCircle className="w-6 h-6 text-rose-500" />}
            color="rose"
          />
        </div>

        {/* Map Section */}
        <div className="space-y-4">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <Map cars={filteredCars} searchParams={currentSearchParams} />
          </div>
          
          {/* Nearby Search right below map */}
          <NearbySearch onSearch={handleNearbySearch} onClear={handleClearNearby} />
        </div>

        {/* List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Listagem da Frota</h2>
              {isNearbyActive && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md border border-blue-100">
                  Filtro Proximidade Ativo
                </span>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar por nome ou placa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition text-sm"
                />
              </div>

              {/* Filter */}
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full md:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition text-sm text-slate-600"
              >
                <option value="ALL">Todos Status</option>
                <option value="WORKING">Funcionando</option>
                <option value="PROBLEM">Problema</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Veículo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Localização</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clima Atual</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-10 bg-slate-100 rounded-lg w-full" />
                      </td>
                    </tr>
                  ))
                ) : filteredCars.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Nenhum veículo encontrado
                    </td>
                  </tr>
                ) : (
                  filteredCars.map((car) => (
                    <tr key={car.id} className="hover:bg-slate-50/50 transition group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{car.name}</span>
                          <span className="text-xs text-slate-400 font-mono">{car.plate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600">{car.city}</span>
                          <span className="text-[10px] text-slate-400">Lat: {car.location.lat.toFixed(4)}, Lon: {car.location.lon.toFixed(4)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          car.status === 'WORKING' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${car.status === 'WORKING' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {car.status === 'WORKING' ? 'Funcionando' : 'Problema'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {car.last_weather_temperature !== undefined ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">{car.last_weather_temperature}°C</span>
                            <span className="text-[10px] text-slate-400">Atualizado {new Date(car.last_weather_at!).toLocaleTimeString()}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Sem dados</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenModal(car)}
                          className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}

        {/* Modal */}
        <CarModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          car={selectedCar}
          onSuccess={() => fetchCars()}
        />

      </div>
    </main>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  const colorMap: any = {
    blue: 'bg-blue-50',
    emerald: 'bg-emerald-50',
    rose: 'bg-rose-50',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 group hover:border-slate-300 transition">
      <div className={`p-3 rounded-xl ${colorMap[color]} group-hover:scale-110 transition`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
