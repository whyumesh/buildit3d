// Rough price estimate for an uploaded 3D file.
// Same formula as the shop's quote calculator (pricing.py); the rates are copied from printshop.json.
// Grams and hours are estimated from the model's geometry with coefficients fitted to real Bambu Studio
// slices (PLA, 0.20 mm, default infill): see scripts/calibrate_web_estimate.py in the shop folder.
// The final price is always Soham's, sent on WhatsApp.

export const RATES = {
  rsPerKg: { PLA: 650, PETG: 1100, ABS: 1200 } as Record<string, number>,
  markupPct: { PLA: 0, PETG: 0, ABS: 30 } as Record<string, number>,
  machineRsPerHour: 40,
  handlingRs: 100,
  failurePct: 20,
  minMarginPct: 40,
  roundTo: 50,
};

// Fitted on 34 real slices (2026-11-25) by `py scripts/calibrate_web_estimate.py --fit` in the shop folder.
// With spread 0.30, 32 of 34 real slice prices fell inside the shown range; very detailed models (terrain,
// figurines with fine features) can print slower than their size suggests, so the site says so.
export const FIT = {
  grams: { area: 0.0935, volume: 0.1832, c: -0.55 },   // grams = area*cm2 + volume*cm3 + c
  hours: { lnK: -2.884, gramsExp: 0.6743, heightExp: 0.1883 }, // hours = e^lnK * grams^a * height_mm^b
  spread: 0.3,
};

export type Geometry = { volumeCm3: number; areaCm2: number; size: [number, number, number] };

export function estimate(g: Geometry, material: string, qty: number, scale = 1) {
  const v = g.volumeCm3 * scale ** 3;
  const a = g.areaCm2 * scale ** 2;
  const h = g.size[2] * scale;
  const grams = Math.max(1, FIT.grams.area * a + FIT.grams.volume * v + FIT.grams.c);
  const hours = Math.max(0.1, Math.exp(FIT.hours.lnK) * grams ** FIT.hours.gramsExp * Math.max(h, 1) ** FIT.hours.heightExp);
  const mat = RATES.rsPerKg[material] ? material : "PLA";

  const price = (gr: number, hr: number) => {
    const filament = (gr * qty) / 1000 * RATES.rsPerKg[mat] * (1 + (RATES.markupPct[mat] ?? 0) / 100);
    const machine = hr * qty * RATES.machineRsPerHour;
    const failure = (filament + machine) * RATES.failurePct / 100;
    const cost = filament + machine + RATES.handlingRs + failure;
    return Math.ceil(cost / (1 - RATES.minMarginPct / 100) / RATES.roundTo) * RATES.roundTo;
  };
  const s = FIT.spread;
  return {
    grams: grams * qty,
    hours: hours * qty,
    low: price(grams * (1 - s), hours * (1 - s)),
    high: price(grams * (1 + s), hours * (1 + s)),
  };
}

/** Volume (signed tetrahedra) and surface area of a triangle soup, in mm. */
export function measure(positions: Float32Array): { volumeMm3: number; areaMm2: number } {
  let vol = 0, area = 0;
  for (let i = 0; i < positions.length; i += 9) {
    const ax = positions[i], ay = positions[i + 1], az = positions[i + 2];
    const bx = positions[i + 3], by = positions[i + 4], bz = positions[i + 5];
    const cx = positions[i + 6], cy = positions[i + 7], cz = positions[i + 8];
    vol += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
    const ux = bx - ax, uy = by - ay, uz = bz - az, wx = cx - ax, wy = cy - ay, wz = cz - az;
    const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    area += Math.sqrt(nx * nx + ny * ny + nz * nz) / 2;
  }
  return { volumeMm3: Math.abs(vol), areaMm2: area };
}

export const BED_MM = 256;
