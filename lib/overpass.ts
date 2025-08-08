import { CALIFORNIA_BBOX } from "./geo";
import { getCache, setCache } from "./cache";

export type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

export async function fetchOverpass(query: string): Promise<any> {
  const endpoint = process.env.OVERPASS_ENDPOINT || "https://overpass-api.de/api/interpreter";
  const body = new URLSearchParams({ data: query });
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    // Overpass endpoints may be slow; allow long timeout via AbortController if needed
    // Next.js fetch has a default timeout tied to server runtime; we assume long enough.
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Overpass error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function bboxString(): string {
  const { south, west, north, east } = CALIFORNIA_BBOX;
  return `${south},${west},${north},${east}`;
}

export async function fetchCaliforniaTacoBells(): Promise<OverpassElement[]> {
  const bbox = bboxString();
  const query = `[
    out:json][timeout:120];
    (
      node["brand"="Taco Bell"](${bbox});
      way["brand"="Taco Bell"](${bbox});
      relation["brand"="Taco Bell"](${bbox});
      node["name"~"^Taco Bell$"](${bbox});
      way["name"~"^Taco Bell$"](${bbox});
      relation["name"~"^Taco Bell$"](${bbox});
    );
    out center tags;`;
  const cacheKey = `tacobell_${bbox}`;
  const cached = getCache<any>(cacheKey, 1000 * 60 * 60 * 24); // 24h
  if (cached) return (cached.elements ?? []) as OverpassElement[];
  const json = await fetchOverpass(query);
  setCache(cacheKey, json);
  return (json.elements ?? []) as OverpassElement[];
}

export async function fetchCaliforniaApartments(): Promise<OverpassElement[]> {
  const bbox = bboxString();
  const query = `[
    out:json][timeout:180];
    (
      node["building"="apartments"](${bbox});
      way["building"="apartments"](${bbox});
      relation["building"="apartments"](${bbox});
      node["building"="residential"]["type"="multiplex"](${bbox});
    );
    out center tags;`;
  const cacheKey = `apartments_${bbox}`;
  const cached = getCache<any>(cacheKey, 1000 * 60 * 60 * 24); // 24h
  if (cached) return (cached.elements ?? []) as OverpassElement[];
  const json = await fetchOverpass(query);
  setCache(cacheKey, json);
  return (json.elements ?? []) as OverpassElement[];
}

export function elementToPoint(el: OverpassElement): { lat: number; lon: number } | null {
  if (typeof el.lat === "number" && typeof el.lon === "number") {
    return { lat: el.lat, lon: el.lon };
  }
  if (el.center) return el.center;
  return null;
}

export function addressFromTags(tags: Record<string, string> | undefined): {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
} {
  if (!tags) return {};
  const street = tags["addr:street"] || tags["addr:road"];
  const city = tags["addr:city"];
  const state = tags["addr:state"];
  const postcode = tags["addr:postcode"];
  return { street, city, state, postcode };
}


