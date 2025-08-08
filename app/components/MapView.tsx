"use client";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";

type Apartment = {
  id: number;
  name?: string | null;
  lat: number;
  lon: number;
  distanceM: number;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
};

type Taco = {
  id: number;
  name?: string | null;
  brand?: string | null;
  lat: number;
  lon: number;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
};

type Result = {
  taco: Taco;
  apartments: Apartment[];
};

export default function MapView() {
  const [radiusM, setRadiusM] = useState<number>(800);
  const [minApts, setMinApts] = useState<number>(1);
  const [includeNonMatching, setIncludeNonMatching] = useState<boolean>(false);
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fix default marker icons in bundlers
  useEffect(() => {
    const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
    const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
    const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
    L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const qs = new URLSearchParams({
        radiusM: String(radiusM),
        minApts: String(minApts),
        includeNonMatching: includeNonMatching ? "1" : "0",
      });
      const res = await fetch(`/api/filtered?${qs.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!cancelled) setResults(json);
      setIsLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [radiusM, minApts, includeNonMatching]);

  const center = useMemo(() => ({ lat: 36.7783, lon: -119.4179 }), []); // California center

  const matchingCount = useMemo(
    () => results.filter((r) => r.apartments.length >= minApts).length,
    [results, minApts]
  );

  return (
    <div className="w-full h-[calc(100vh-0px)] grid grid-rows-[auto_1fr]">
      <div className="p-3 bg-white/80 backdrop-blur flex flex-wrap gap-4 items-center z-[1000]">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Radius: {radiusM} m</label>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={radiusM}
            onChange={(e) => setRadiusM(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Min apartments: {minApts}</label>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={minApts}
            onChange={(e) => setMinApts(Number(e.target.value))}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeNonMatching}
            onChange={(e) => setIncludeNonMatching(e.target.checked)}
          />
          Show non-matching Taco Bells
        </label>
        <a
          className="ml-auto text-sm px-3 py-1 rounded bg-black text-white hover:bg-gray-800"
          href={`/api/export?radiusM=${radiusM}&minApts=${minApts}`}
        >
          Export CSV
        </a>
        <span className="text-sm text-gray-600">{isLoading ? "Loading…" : `${matchingCount} matching / ${results.length} total`}</span>
      </div>
      <div className="w-full h-full">
        <MapContainer
          center={[center.lat, center.lon]}
          zoom={6}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {results.map((r) => (
            <Marker key={r.taco.id} position={[r.taco.lat, r.taco.lon]}>
              <Popup>
                <div className="space-y-2">
                  <div className="font-semibold">{r.taco.name ?? "Taco Bell"}</div>
                  <div className="text-xs text-gray-600">
                    {[r.taco.street, r.taco.city, r.taco.state, r.taco.postcode].filter(Boolean).join(", ")}
                  </div>
                  <div className="text-sm">Nearby apartments within {radiusM} m: {r.apartments.length}</div>
                  <ul className="max-h-40 overflow-auto text-sm list-disc pl-5">
                    {r.apartments.map((a) => (
                      <li key={a.id}>
                        {(a.name || "Apartments")} — {(a.distanceM).toFixed(0)} m
                      </li>
                    ))}
                  </ul>
                </div>
              </Popup>
              {radiusM > 0 && (
                <Circle
                  center={[r.taco.lat, r.taco.lon]}
                  radius={radiusM}
                  pathOptions={{ color: r.apartments.length ? "#10b981" : "#ef4444", opacity: 0.6 }}
                />
              )}
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}


