import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export function MapResizer() {
  const map = useMap();
  useEffect(() => {
    // Invalidate size immediately on mount
    map.invalidateSize();
    
    // Also invalidate size after a short delay to allow browser layout reflow to finish
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}
