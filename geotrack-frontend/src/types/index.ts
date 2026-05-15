export type CarStatus = 'WORKING' | 'PROBLEM';

export interface Location {
  lat: number;
  lon: number;
}

export interface Car {
  id: string;
  name: string;
  plate: string;
  city: string;
  status: CarStatus;
  location: Location;
  last_weather_temperature?: number;
  last_weather_humidity?: number;
  last_weather_code?: number;
  last_weather_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CarCreateUpdate {
  name: string;
  plate: string;
  city: string;
  status: CarStatus;
  lat: number;
  lon: number;
}

export interface NearbySearchParams {
  lat: number;
  lon: number;
  radius_km: number;
}
