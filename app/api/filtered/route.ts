import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const radiusM = Number(searchParams.get("radiusM") ?? 800);
  const minApts = Number(searchParams.get("minApts") ?? 1);
  const includeNonMatching = searchParams.get("includeNonMatching") === "1";

  // Find Taco Bells with proximities within radius
  const proximities = await prisma.apartmentProximity.findMany({
    where: { distanceM: { lte: radiusM } },
    include: { tacoBell: true, apartment: true },
  });

  const tacoIdToApts = new Map<number, typeof proximities>();
  for (const p of proximities) {
    const arr = tacoIdToApts.get(p.tacoBellId) ?? [];
    arr.push(p);
    tacoIdToApts.set(p.tacoBellId, arr);
  }

  const allTacos = await prisma.tacoBell.findMany({});
  const filtered = allTacos
    .map((t) => ({ taco: t, apts: tacoIdToApts.get(t.id) ?? [] }))
    .filter((x) => (includeNonMatching ? true : x.apts.length >= minApts));

  return Response.json(
    filtered.map(({ taco, apts }) => ({
      taco: {
        id: taco.id,
        name: taco.name,
        brand: taco.brand,
        lat: taco.lat,
        lon: taco.lon,
        street: taco.street,
        city: taco.city,
        state: taco.state,
        postcode: taco.postcode,
        phone: taco.phone,
        drive_thru: taco.drive_thru,
        open_late: taco.open_late,
        delivery: taco.delivery,
        breakfast: taco.breakfast,
      },
      apartments: apts
        .sort((a, b) => a.distanceM - b.distanceM)
        .map((p) => ({
          id: p.apartment.id,
          name: p.apartment.name,
          lat: p.apartment.lat,
          lon: p.apartment.lon,
          distanceM: p.distanceM,
          street: p.apartment.street,
          city: p.apartment.city,
          state: p.apartment.state,
          postcode: p.apartment.postcode,
        })),
    }))
  );
}


