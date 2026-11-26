// Nusantara Data — the 38 provinces of Indonesia.
//
// Population is the BPS mid-2024 estimate, in thousands of people. The 38
// figures add to 281,623 thousand — 281.6 million, the national mid-2024
// population in indicators.js — so the Regions table, the Compare page and
// the overview always agree with each other. Island groups follow the
// grouping BPS uses in its provincial tables. Province names are the
// official English names.
//
// Source: BPS — Statistics Indonesia, provincial population estimates 2024.

export const NATIONAL_POP_2024_THOUSANDS = 281623;

export const ISLANDS = ['Sumatra', 'Java', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku & Papua'];

export const PROVINCES = [
  { name: 'Aceh', island: 'Sumatra', pop: 5554 },
  { name: 'North Sumatra', island: 'Sumatra', pop: 15588 },
  { name: 'West Sumatra', island: 'Sumatra', pop: 6083 },
  { name: 'Riau', island: 'Sumatra', pop: 7050 },
  { name: 'Jambi', island: 'Sumatra', pop: 3678 },
  { name: 'South Sumatra', island: 'Sumatra', pop: 8978 },
  { name: 'Bengkulu', island: 'Sumatra', pop: 2085 },
  { name: 'Lampung', island: 'Sumatra', pop: 9249 },
  { name: 'Bangka Belitung Islands', island: 'Sumatra', pop: 1498 },
  { name: 'Riau Islands', island: 'Sumatra', pop: 2248 },
  { name: 'Jakarta', island: 'Java', pop: 10684 },
  { name: 'West Java', island: 'Java', pop: 49997 },
  { name: 'Central Java', island: 'Java', pop: 37894 },
  { name: 'Yogyakarta', island: 'Java', pop: 3759 },
  { name: 'East Java', island: 'Java', pop: 41815 },
  { name: 'Banten', island: 'Java', pop: 12434 },
  { name: 'Bali', island: 'Bali & Nusa Tenggara', pop: 4361 },
  { name: 'West Nusa Tenggara', island: 'Bali & Nusa Tenggara', pop: 5684 },
  { name: 'East Nusa Tenggara', island: 'Bali & Nusa Tenggara', pop: 5656 },
  { name: 'West Kalimantan', island: 'Kalimantan', pop: 5797 },
  { name: 'Central Kalimantan', island: 'Kalimantan', pop: 2775 },
  { name: 'South Kalimantan', island: 'Kalimantan', pop: 4266 },
  { name: 'East Kalimantan', island: 'Kalimantan', pop: 3905 },
  { name: 'North Kalimantan', island: 'Kalimantan', pop: 725 },
  { name: 'North Sulawesi', island: 'Sulawesi', pop: 2701 },
  { name: 'Central Sulawesi', island: 'Sulawesi', pop: 3078 },
  { name: 'South Sulawesi', island: 'Sulawesi', pop: 9417 },
  { name: 'Southeast Sulawesi', island: 'Sulawesi', pop: 2806 },
  { name: 'Gorontalo', island: 'Sulawesi', pop: 1245 },
  { name: 'West Sulawesi', island: 'Sulawesi', pop: 1542 },
  { name: 'North Maluku', island: 'Maluku & Papua', pop: 1405 },
  { name: 'Maluku', island: 'Maluku & Papua', pop: 1979 },
  { name: 'Southwest Papua', island: 'Maluku & Papua', pop: 617 },
  { name: 'West Papua', island: 'Maluku & Papua', pop: 587 },
  { name: 'South Papua', island: 'Maluku & Papua', pop: 536 },
  { name: 'Central Papua', island: 'Maluku & Papua', pop: 1349 },
  { name: 'Highland Papua', island: 'Maluku & Papua', pop: 1495 },
  { name: 'Papua', island: 'Maluku & Papua', pop: 1103 },
];

// Provinces sorted largest first. The original PROVINCES order (roughly
// west to east) is never mutated, so the table can re-sort freely.
export function provincesBySize() {
  return [...PROVINCES].sort((a, b) => b.pop - a.pop);
}

// One province by exact name, or null. Used by the Compare page.
export function provinceNamed(name) {
  return PROVINCES.find((p) => p.name === name) || null;
}

// Total population of one island group, in thousands.
export function islandTotal(island) {
  return PROVINCES.filter((p) => p.island === island).reduce((s, p) => s + p.pop, 0);
}

