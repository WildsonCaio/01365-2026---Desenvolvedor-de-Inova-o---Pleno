import axios from 'axios';
import { Car, CarCreateUpdate, NearbySearchParams } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const carService = {
  getAll: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await api.get<Car[]>('/cars/', { params });
    return response.data;
  },

  getNearby: async (params: NearbySearchParams) => {
    const response = await api.get<Car[]>('/cars/nearby/', { params });
    return response.data;
  },

  create: async (data: CarCreateUpdate) => {
    const response = await api.post<Car>('/cars/', data);
    return response.data;
  },

  update: async (id: string, data: CarCreateUpdate) => {
    const response = await api.put<Car>(`/cars/${id}/`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/cars/${id}/`);
  },
};
