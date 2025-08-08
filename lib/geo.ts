export type Coordinate = { lat: number; lon: number };

export function haversineDistanceMeters(a: Coordinate, b: Coordinate): number {
  const R = 6371000; // meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);

  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export const DEFAULT_RADIUS_M = 800;

// California bbox to constrain Overpass query
export const CALIFORNIA_BBOX = {
  south: 32.5121,
  west: -124.4820,
  north: 42.0126,
  east: -114.1315,
};


