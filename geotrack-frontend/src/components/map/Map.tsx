'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Car, NearbySearchParams } from '../../types';

// Fix for default marker icons in Leaflet with React
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  cars: Car[];
  searchParams?: NearbySearchParams;
}

export default function Map({ cars, searchParams }: MapProps) {
  const center: [number, number] = [-27.5954, -48.5480]; // SC Center

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
      <MapContainer 
        center={center} 
        zoom={8} 
        scrollWheelZoom={false} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {searchParams && (
          <Circle 
            center={[searchParams.lat, searchParams.lon]}
            radius={searchParams.radius_km * 1000}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
          />
        )}

        {cars.map((car) => (
          <Marker 
            key={car.id} 
            position={[car.location.lat, car.location.lon]}
            icon={car.status === 'WORKING' ? greenIcon : redIcon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-slate-900">{car.name}</h3>
                <p className="text-sm text-slate-600">{car.plate} - {car.city}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${car.status === 'WORKING' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-medium uppercase">{car.status}</span>
                </div>
                {car.last_weather_temperature !== undefined && (
                  <p className="mt-1 text-xs text-slate-500">
                    🌡️ {car.last_weather_temperature}°C | 💧 {car.last_weather_humidity}%
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
