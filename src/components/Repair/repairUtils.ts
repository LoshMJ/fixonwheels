// src/components/repair/repairUtils.ts
export const baseIssuePrices: Record<string, number> = {
  "Cracked screen": 120,
  "Battery issue": 70,
  "Charging port": 55,
  "Camera issue": 95,
  "Water damage": 160,
  "Speaker / mic issue": 45,
  "Software issue": 40,
  Other: 30,
};

export const modelMultiplier: Record<string, number> = {
  // iPhone X series
  "iPhone X": 1.0,
  "iPhone XR": 1.05,
  "iPhone XS": 1.1,
  // iPhone 11 series
  "iPhone 11": 1.15,
  "iPhone 11 Pro": 1.2,
  "iPhone 11 Pro Max": 1.25,
  // ... (copy ALL the rest from your original code)
  // iPhone 16 series
  "iPhone 16": 1.65,
  "iPhone 16 Plus": 1.7,
  "iPhone 16 Pro": 1.75,
  "iPhone 16 Pro Max": 1.8,
  // iPhone 17 series (future-proofed)
  "iPhone 17": 1.75,
  "iPhone 17 Air": 1.8,
  "iPhone 17 Pro": 1.85,
  "iPhone 17 Pro Max": 1.9,
};

export const TRAVEL_FEE = 15;

export function computePricing(
  model: string | null,
  issue: string | null
): { repair: number; travel: number; total: number } | null {
  if (!model || !issue) return null;
  const base = baseIssuePrices[issue];
  const multiplier = modelMultiplier[model] ?? 1;
  if (!base) return null;

  const repair = base * multiplier;
  const travel = TRAVEL_FEE;
  const total = repair + travel;
  return { repair, travel, total };
}