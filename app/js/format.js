// Nusantara Data — number formatting helpers.
//
// Every figure on the site passes through here so the tables, the cards and
// the charts always spell a number the same way. All formatting is plain
// string work on fixed data: no clock, no randomness, no network.

const GROUP = new Intl.NumberFormat('en-US');
const ONE_DEC = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const TWO_DEC = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// 281600 -> "281,600". Used for headcounts given in thousands or persons.
export function fmtInt(n) {
  return GROUP.format(Math.round(n));
}

// 5.03 -> "5.03", -2.07 -> "-2.07". Two decimals, kept even for whole values.
export function fmtPct(n) {
  return TWO_DEC.format(n);
}

// 281.6 -> "281.6". One decimal, for millions of people and similar.
export function fmtOne(n) {
  return ONE_DEC.format(n);
}

// Millions of people: 281.6 -> "281.6 million".
export function fmtMillions(n) {
  return ONE_DEC.format(n) + ' million';
}

// Rupiah trillions: 22139 -> "Rp 22,139 trillion".
export function fmtRpTrillion(n) {
  return 'Rp ' + GROUP.format(n) + ' trillion';
}

// US dollars in billions: 264.7 -> "US$264.7 billion".
export function fmtUsdBillion(n) {
  return 'US$' + ONE_DEC.format(n) + ' billion';
}

// Share of the national total: 49.997 of 281.6 -> "17.8%".
export function fmtShare(part, whole) {
  return ONE_DEC.format((100 * part) / whole) + '%';
}

// Signed change with a + or - in front: 3.7 -> "+3.7%", -2.07 -> "-2.07%".
export function fmtSignedPct(n) {
  return (n >= 0 ? '+' : '') + TWO_DEC.format(n) + '%';
}

// Short axis label for chart ticks: 22000 -> "22k", 1500 -> "1.5k".
export function fmtAxis(n) {
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
  return String(n);
}

