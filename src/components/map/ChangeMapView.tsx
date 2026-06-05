import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface ChangeMapViewProps {
  center: [number, number];
  zoom: number;
}

export function ChangeMapView({ center, zoom }: ChangeMapViewProps) {
  const map = useMap();
  useEffect(() => {
    if (
      !center ||
      typeof center[0] !== 'number' ||
      isNaN(center[0]) ||
      typeof center[1] !== 'number' ||
      isNaN(center[1])
    ) {
      return;
    }
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}
