/*
  Refresh script: fetch Taco Bells and Apartments from Overpass, store in SQLite via Prisma,
  compute proximities using Haversine, and persist relations.
*/
import { PrismaClient } from "@prisma/client";
import { DEFAULT_RADIUS_M, haversineDistanceMeters } from "@/lib/geo";
import {
  addressFromTags,
  elementToPoint,
  fetchCaliforniaApartments,
  fetchCaliforniaTacoBells,
} from "@/lib/overpass";

const prisma = new PrismaClient();

async function upsertTacoBells() {
  const elements = await fetchCaliforniaTacoBells();
  let upserted = 0;
  for (const el of elements) {
    const point = elementToPoint(el);
    if (!point) continue;
    const addr = addressFromTags(el.tags);
    const name = el.tags?.name ?? "Taco Bell";
    await prisma.tacoBell.upsert({
      where: { osmId: String(el.id) },
      create: {
        osmId: String(el.id),
        name,
        brand: el.tags?.brand ?? "Taco Bell",
        lat: point.lat,
        lon: point.lon,
        ...addr,
      },
      update: {
        name,
        brand: el.tags?.brand ?? "Taco Bell",
        lat: point.lat,
        lon: point.lon,
        ...addr,
      },
    });
    upserted++;
  }
  return upserted;
}

async function upsertApartments() {
  const elements = await fetchCaliforniaApartments();
  let upserted = 0;
  for (const el of elements) {
    const point = elementToPoint(el);
    if (!point) continue;
    const addr = addressFromTags(el.tags);
    const name = el.tags?.name ?? el.tags?.["addr:housename"] ?? "Apartments";
    await prisma.apartment.upsert({
      where: { osmId: String(el.id) },
      create: {
        osmId: String(el.id),
        name,
        lat: point.lat,
        lon: point.lon,
        ...addr,
      },
      update: {
        name,
        lat: point.lat,
        lon: point.lon,
        ...addr,
      },
    });
    upserted++;
  }
  return upserted;
}

async function computeProximities(radiusM: number) {
  const [tacos, apts] = await Promise.all([
    prisma.tacoBell.findMany({}),
    prisma.apartment.findMany({}),
  ]);

  // Clear old proximities for full recompute
  await prisma.apartmentProximity.deleteMany({});

  let created = 0;
  for (const taco of tacos) {
    for (const apt of apts) {
      const d = haversineDistanceMeters(
        { lat: taco.lat, lon: taco.lon },
        { lat: apt.lat, lon: apt.lon }
      );
      if (d <= radiusM) {
        await prisma.apartmentProximity.create({
          data: { tacoBellId: taco.id, apartmentId: apt.id, distanceM: d },
        });
        created++;
      }
    }
  }
  return created;
}

async function main() {
  const radius = Number(process.env.RADIUS_M ?? DEFAULT_RADIUS_M);
  const [tUp, aUp] = await Promise.all([upsertTacoBells(), upsertApartments()]);
  const prox = await computeProximities(radius);
  console.log(`Upserted Taco Bells: ${tUp}`);
  console.log(`Upserted Apartments: ${aUp}`);
  console.log(`Created proximities (<= ${radius}m): ${prox}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


