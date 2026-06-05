import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface ChangeMapViewProps {
  center: [number, number];
  zoom: number;
}

export function ChangeMapView({ center, zoom }: ChangeMapViewProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}
