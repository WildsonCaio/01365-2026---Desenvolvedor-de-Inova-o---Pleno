import { useState, useEffect, useCallback } from 'react';
import { Car } from '../types';
import { carService } from '../services/api';

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async (status?: string) => {
    setLoading(true);
    try {
      const data = await carService.getAll(status);
      setCars(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar veículos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, loading, error, fetchCars, setCars };
};
