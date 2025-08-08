import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const radiusM = Number(searchParams.get("radiusM") ?? 800);
  const minApts = Number(searchParams.get("minApts") ?? 1);

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
  const rows: string[] = [];
  rows.push(
    [
      "taco_id",
      "taco_name",
      "taco_lat",
      "taco_lon",
      "taco_street",
      "taco_city",
      "taco_state",
      "taco_postcode",
      "apartment_id",
      "apartment_name",
      "apartment_lat",
      "apartment_lon",
      "distance_m",
    ].join(",")
  );

  for (const taco of allTacos) {
    const apts = (tacoIdToApts.get(taco.id) ?? []).sort((a, b) => a.distanceM - b.distanceM);
    if (apts.length < minApts) continue;
    if (apts.length === 0) {
      rows.push([
        taco.id,
        taco.name ?? "",
        taco.lat,
        taco.lon,
        taco.street ?? "",
        taco.city ?? "",
        taco.state ?? "",
        taco.postcode ?? "",
        "",
        "",
        "",
        "",
        "",
      ].join(","));
    } else {
      for (const p of apts) {
        rows.push([
          taco.id,
          taco.name ?? "",
          taco.lat,
          taco.lon,
          taco.street ?? "",
          taco.city ?? "",
          taco.state ?? "",
          taco.postcode ?? "",
          p.apartment.id,
          p.apartment.name ?? "",
          p.apartment.lat,
          p.apartment.lon,
          p.distanceM.toFixed(1),
        ].join(","));
      }
    }
  }

  const csv = rows.join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=filtered_tacobell_apartments.csv",
    },
  });
}


