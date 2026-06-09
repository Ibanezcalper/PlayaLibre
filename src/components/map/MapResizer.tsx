import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapResizerProps {
  /** Re-run invalidateSize when this value changes (tab switch, modal open, etc.) */
  watchKey?: string | number | boolean;
}

export function MapResizer({ watchKey }: MapResizerProps) {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      map.invalidateSize({ animate: false });
    };

    invalidate();

    const timers = [100, 300, 600].map((ms) => setTimeout(invalidate, ms));

    const container = map.getContainer();
    const sizeTarget = container.parentElement ?? container;
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => invalidate())
        : null;

    resizeObserver?.observe(sizeTarget);

    return () => {
      timers.forEach(clearTimeout);
      resizeObserver?.disconnect();
    };
  }, [map, watchKey]);

  return null;
}
