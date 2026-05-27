/**
 * Loads the anonymized customer density grid for the heatmap layer.
 *
 * Returns an empty result if customer-density.json hasn't been generated yet
 * (i.e. scripts/geocode-customers.ts has not been run with --execute).
 *
 * The JSON file is the only artifact from the customer registry that lives
 * in the repo — and only as k-anonymous cell counts, never individual
 * addresses or coordinates.
 */

import type { DensityCell } from "@/components/ProjektKarta";

interface DensityFile {
  generatedAt: string;
  totalCustomersGeocoded: number;
  kAnonymityThreshold: number;
  gridResolutionDeg: { lat: number; lng: number };
  cells: DensityCell[];
}

export function getCustomerDensity(): {
  cells: DensityCell[];
  totalCustomers: number;
  generatedAt: string | null;
} {
  try {
    // Dynamic require so missing file at build time doesn't break compile
    const data = require("./customer-density.json") as DensityFile;
    return {
      cells: data.cells,
      totalCustomers: data.totalCustomersGeocoded,
      generatedAt: data.generatedAt,
    };
  } catch {
    return { cells: [], totalCustomers: 0, generatedAt: null };
  }
}
