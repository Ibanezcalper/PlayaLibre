import { MEXICAN_STATES, STATE_COASTAL_COORDINATES } from '../constants';

// Haversine formula to compute distance in km between coordinates
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Centroid of a polygon (simple average of vertices). */
export function polygonCentroid(points: [number, number][]): [number, number] {
  if (points.length === 0) return [0, 0];
  let totalLat = 0;
  let totalLng = 0;
  for (const [lat, lng] of points) {
    totalLat += lat;
    totalLng += lng;
  }
  return [
    Number((totalLat / points.length).toFixed(6)),
    Number((totalLng / points.length).toFixed(6)),
  ];
}

/** Nearest coastal Mexican state by centroid distance to reference coastal point. */
export function detectCoastalState(lat: number, lng: number): string {
  let closest = MEXICAN_STATES[0];
  let minDist = Infinity;
  for (const state of MEXICAN_STATES) {
    const coords = STATE_COASTAL_COORDINATES[state];
    if (!coords) continue;
    const dist = calculateDistance(lat, lng, coords[0], coords[1]);
    if (dist < minDist) {
      minDist = dist;
      closest = state;
    }
  }
  return closest;
}
