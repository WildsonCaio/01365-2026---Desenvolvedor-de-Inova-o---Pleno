'use client';

import { useState, useEffect } from 'react';
import { Car, CarCreateUpdate, CarStatus } from '@/types';
import { carService } from '@/services/api';
import { X, Loader2, Trash2 } from 'lucide-react';

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  car?: Car;
  onSuccess: () => void;
}

export default function CarModal({ isOpen, onClose, car, onSuccess }: CarModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CarCreateUpdate>({
    name: '',
    plate: '',
    city: '',
    status: 'WORKING',
    lat: -27.5954,
    lon: -48.5480,
  });

  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name,
        plate: car.plate,
        city: car.city,
        status: car.status,
        lat: car.location.lat,
        lon: car.location.lon,
      });
    } else {
      setFormData({
        name: '',
        plate: '',
        city: '',
        status: 'WORKING',
        lat: -27.5954,
        lon: -48.5480,
      });
    }
  }, [car, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (car) {
        await carService.update(car.id, formData);
      } else {
        await carService.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert('Erro ao salvar veículo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!car || !confirm('Deseja realmente excluir este veículo?')) return;
    setLoading(true);
    try {
      await carService.delete(car.id);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Erro ao excluir veículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {car ? 'Editar Veículo' : 'Novo Veículo'}
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Nome do Veículo</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Tesla Model S"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Placa</label>
              <input 
                required
                value={formData.plate}
                onChange={e => setFormData({...formData, plate: e.target.value})}
                placeholder="ABC-1234"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Cidade</label>
              <input 
                required
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                placeholder="Florianópolis"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Latitude</label>
              <input 
                required
                type="number"
                step="any"
                value={formData.lat}
                onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Longitude</label>
              <input 
                required
                type="number"
                step="any"
                value={formData.lon}
                onChange={e => setFormData({...formData, lon: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5" 
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as CarStatus})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
              >
                <option value="WORKING">Funcionando</option>
                <option value="PROBLEM">Com Problema</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            {car && (
              <button 
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition text-sm"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition text-sm flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {car ? 'Salvar Alterações' : 'Criar Veículo'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
