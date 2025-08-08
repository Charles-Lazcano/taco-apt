import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "data-cache");

function ensureDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function keyToPath(key: string): string {
  const safe = key.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(CACHE_DIR, `${safe}.json`);
}

export function getCache<T>(key: string, maxAgeMs: number): T | null {
  try {
    ensureDir();
    const p = keyToPath(key);
    if (!fs.existsSync(p)) return null;
    const stat = fs.statSync(p);
    const age = Date.now() - stat.mtimeMs;
    if (age > maxAgeMs) return null;
    const data = fs.readFileSync(p, "utf-8");
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, value: T): void {
  try {
    ensureDir();
    const p = keyToPath(key);
    fs.writeFileSync(p, JSON.stringify(value));
  } catch {
    // ignore
  }
}


