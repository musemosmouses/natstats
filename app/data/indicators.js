// Nusantara Data — national indicators, 2019-2024.
//
// Every value below is a published BPS (Statistics Indonesia) figure for the
// year shown. Population is the mid-year estimate; GDP is nominal GDP at
// current prices; inflation is the December year-on-year CPI change;
// unemployment is the August open unemployment rate; poverty is the March
// rate; HDI is the Human Development Index. Exports and imports are the
// annual totals in US dollars. Figures are rounded as BPS publishes them.
//
// Sources (all figures): BPS — Statistics Indonesia, "Statistik Indonesia"
// 2020-2025 and the BPS indicator releases for each year. The Sources page
// of the site lists the publication behind every series.

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

// Population, millions of people (mid-year estimate).
export const POPULATION = [266.9, 270.2, 272.7, 275.8, 278.7, 281.6];

// Nominal GDP, rupiah trillion (current prices).
export const GDP_NOMINAL = [15833, 15434, 16971, 19588, 20892, 22139];

// Real GDP growth, percent year on year.
export const GDP_GROWTH = [5.02, -2.07, 3.7, 5.31, 5.05, 5.03];

// GDP per capita, rupiah million.
export const GDP_PER_CAPITA = [59.3, 57.3, 62.2, 71.1, 75.0, 78.6];

// Inflation, percent (December, year on year).
export const INFLATION = [2.72, 1.68, 1.87, 5.51, 2.61, 1.57];

// Open unemployment rate, percent (August).
export const UNEMPLOYMENT = [5.28, 7.07, 6.49, 5.86, 5.32, 4.91];

// Poverty rate, percent (March).
export const POVERTY = [9.41, 9.78, 10.14, 9.54, 9.36, 9.03];

// Human Development Index (0-100).
export const HDI = [71.92, 71.94, 72.29, 73.86, 74.39, 75.02];

// Exports, US$ billion.
export const EXPORTS = [167.7, 163.2, 231.6, 291.9, 258.8, 264.7];

// Imports, US$ billion.
export const IMPORTS = [171.3, 141.6, 196.2, 237.4, 221.9, 233.7];

// Trade balance, US$ billion (exports minus imports), computed from the two
// series above so the table can never disagree with the chart.
export const TRADE_BALANCE = EXPORTS.map((x, i) => +(x - IMPORTS[i]).toFixed(1));

// GDP by sector, 2024, percent of GDP. "Other" covers the remaining
// sectors (real estate, education, health, public administration and more).
export const SECTORS_2024 = [
  { name: 'Manufacturing', share: 18.7 },
  { name: 'Wholesale & retail trade', share: 12.9 },
  { name: 'Agriculture, forestry & fishing', share: 12.5 },
  { name: 'Construction', share: 9.8 },
  { name: 'Mining & quarrying', share: 8.4 },
  { name: 'Information & communication', share: 4.3 },
  { name: 'Financial & insurance services', share: 4.3 },
  { name: 'Other sectors', share: 29.1 },
];

// Age structure, 2024, percent of population (BPS population projection).
export const AGE_GROUPS_2024 = [
  { label: '0–14 years', share: 25.0, note: 'Children' },
  { label: '15–64 years', share: 68.6, note: 'Working age' },
  { label: '65+ years', share: 6.4, note: 'Older people' },
];

// Fixed reference facts shown on the People page.
export const PEOPLE_FACTS_2024 = {
  medianAge: 30.1,
  urbanShare: 59.0,
  lifeExpectancy: 73.9,
  lifeExpectancyYear: 2023,
  meanSchooling: 8.95,
  meanSchoolingYear: 2023,
  literacy: 97.9,
  literacyYear: 2023,
  gini: 0.379,
  giniYear: 'March 2024',
};

// Look up one indicator for one year. Returns null for an unknown year so a
// bad year picker can never print a wrong number.
export function indicatorAt(series, year) {
  const i = YEARS.indexOf(year);
  return i === -1 ? null : series[i];
}

