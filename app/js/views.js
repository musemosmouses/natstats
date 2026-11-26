// Nusantara Data — route views.
//
// Each view is a pure function of the shared state: it takes { year, sort,
// island, query, cmpA, cmpB, econChart } and returns the page's HTML string.
// No view reads the clock or the network; every number comes from the data
// modules, so two renders of the same state are byte-identical. The router
// in main.js drops the string into #view and wires the controls.

import {
  YEARS, POPULATION, GDP_NOMINAL, GDP_GROWTH, GDP_PER_CAPITA, INFLATION,
  UNEMPLOYMENT, POVERTY, HDI, EXPORTS, IMPORTS, TRADE_BALANCE,
  SECTORS_2024, AGE_GROUPS_2024, PEOPLE_FACTS_2024, indicatorAt,
} from '../data/indicators.js';
import { PROVINCES, ISLANDS, NATIONAL_POP_2024_THOUSANDS, provincesBySize, provinceNamed, islandTotal } from '../data/provinces.js';
import { fmtInt, fmtPct, fmtOne, fmtMillions, fmtRpTrillion, fmtUsdBillion, fmtShare, fmtSignedPct } from './format.js';
import { lineChart, barChart, hbarChart, donutChart, donutLegend } from './charts.js';

const YEAR_LABELS = YEARS.map(String);
const SRC = 'BPS — Statistics Indonesia';

// One KPI card: big number, label, and the source line underneath.
function kpi(value, label, source) {
  return '<div class="kpi"><div class="kpi-value">' + value + '</div>'
    + '<div class="kpi-label">' + label + '</div>'
    + '<div class="kpi-src">' + source + '</div></div>';
}

// Year picker shared by Overview and Economy. The router listens for its change.
function yearPicker(year) {
  return '<label class="yearpick">Year '
    + '<select id="yearPick" aria-label="Choose a year">'
    + YEARS.map((y) => '<option value="' + y + '"' + (y === year ? ' selected' : '') + '>' + y + '</option>').join('')
    + '</select></label>';
}

function sectionHead(title, sub) {
  return '<div class="sechead"><h2>' + title + '</h2><p>' + sub + '</p></div>';
}

// ---------------------------------------------------------------- overview
function overview(st) {
  const y = st.year;
  const pop = indicatorAt(POPULATION, y);
  const gdp = indicatorAt(GDP_NOMINAL, y);
  const growth = indicatorAt(GDP_GROWTH, y);
  const infl = indicatorAt(INFLATION, y);
  const unemp = indicatorAt(UNEMPLOYMENT, y);
  const pov = indicatorAt(POVERTY, y);
  const hdi = indicatorAt(HDI, y);
  const top10 = provincesBySize().slice(0, 10).map((p) => ({
    label: p.name, value: p.pop / 1000, decimals: 1, unit: 'm',
  }));
  return '<section class="hero"><p class="eyebrow">Indonesia · ' + y + ' · ' + SRC + '</p>'
    + '<h1>Indonesia in Numbers</h1>'
    + '<p class="lede">One page for the figures people actually look up: how many of us there are, '
    + 'how the economy is doing, who has work, and how every province compares. '
    + 'Every figure names its source and its year.</p>'
    + '<div class="hero-row">' + yearPicker(y)
    + '<a class="btn" href="#/regions">Explore all 38 provinces →</a></div></section>'
    + '<section class="kpis" aria-label="Key figures for ' + y + '">'
    + kpi(fmtMillions(pop), 'Population', 'BPS, mid-' + y)
    + kpi(fmtRpTrillion(gdp), 'GDP (nominal)', 'BPS, ' + y)
    + kpi(fmtSignedPct(growth), 'GDP growth', 'BPS, ' + y)
    + kpi(fmtPct(infl) + '%', 'Inflation (Dec, y-on-y)', 'BPS, ' + y)
    + kpi(fmtPct(unemp) + '%', 'Unemployment (Aug)', 'BPS, ' + y)
    + kpi(fmtPct(pov) + '%', 'Poverty rate (Mar)', 'BPS, ' + y)
    + '</section>'
    + '<div class="grid2">'
    + '<section class="card">' + sectionHead('Population, 2019–2024', 'Millions of people, mid-year estimate. Source: ' + SRC + '.')
    + lineChart(YEAR_LABELS, POPULATION, { unit: 'm', decimals: 1 }) + '</section>'
    + '<section class="card">' + sectionHead('What the economy is made of, 2024', 'Share of GDP by sector. Source: ' + SRC + '.')
    + '<div class="donutwrap">' + donutChart(SECTORS_2024, 'GDP 2024', 'Rp 22,139 T') + donutLegend(SECTORS_2024) + '</div></section>'
    + '</div>'
    + '<section class="card">' + sectionHead('Biggest provinces, 2024', 'Population in millions. Source: ' + SRC + ', mid-2024 estimates.')
    + hbarChart(top10) + '<p class="more"><a href="#/regions">See all 38 provinces →</a></p></section>'
    + '<section class="card">' + sectionHead('The year in one table', 'National indicators, 2019–2024. Source: ' + SRC + '.')
    + '<div class="tablescroll"><table class="data"><thead><tr><th>Indicator</th>'
    + YEARS.map((yy) => '<th class="num">' + yy + '</th>').join('') + '</tr></thead><tbody>'
    + '<tr><th>Population (million)</th>' + POPULATION.map((v) => '<td class="num">' + fmtOne(v) + '</td>').join('') + '</tr>'
    + '<tr><th>GDP (Rp trillion)</th>' + GDP_NOMINAL.map((v) => '<td class="num">' + fmtInt(v) + '</td>').join('') + '</tr>'
    + '<tr><th>GDP growth (%)</th>' + GDP_GROWTH.map((v) => '<td class="num">' + fmtSignedPct(v) + '</td>').join('') + '</tr>'
    + '<tr><th>Inflation, Dec y-on-y (%)</th>' + INFLATION.map((v) => '<td class="num">' + fmtPct(v) + '</td>').join('') + '</tr>'
    + '<tr><th>Unemployment, Aug (%)</th>' + UNEMPLOYMENT.map((v) => '<td class="num">' + fmtPct(v) + '</td>').join('') + '</tr>'
    + '<tr><th>Poverty, Mar (%)</th>' + POVERTY.map((v) => '<td class="num">' + fmtPct(v) + '</td>').join('') + '</tr>'
    + '<tr><th>HDI (0–100)</th>' + HDI.map((v) => '<td class="num">' + fmtPct(v) + '</td>').join('') + '</tr>'
    + '</tbody></table></div></section>';
}

// -------------------------------------------------------------- population
function population() {
  const f = PEOPLE_FACTS_2024;
  const top10 = provincesBySize().slice(0, 10).map((p) => ({
    label: p.name, value: p.pop / 1000, decimals: 1, unit: 'm',
  }));
  const ages = AGE_GROUPS_2024.map((a) => ({ label: a.label + ' — ' + a.note, value: a.share, decimals: 1, unit: '%' }));
  const javaPop = islandTotal('Java');
  return '<section class="hero slim"><p class="eyebrow">Population · ' + SRC + '</p>'
    + '<h1>281.6 million people</h1>'
    + '<p class="lede">Indonesia is the world’s fourth most populous country. '
    + 'More than half of us — ' + fmtMillions(javaPop / 1000) + ' — live on Java, '
    + 'an island smaller than the UK. The population grows about 1% a year.</p></section>'
    + '<section class="kpis">'
    + kpi(fmtMillions(281.6), 'Population, mid-2024', 'BPS, 2024')
    + kpi(fmtOne(f.medianAge) + ' years', 'Median age', 'BPS, 2024')
    + kpi(fmtPct(f.urbanShare) + '%', 'Living in towns & cities', 'BPS, 2024')
    + kpi(fmtOne(AGE_GROUPS_2024[1].share) + '%', 'Of working age (15–64)', 'BPS, 2024')
    + '</section>'
    + '<div class="grid2">'
    + '<section class="card">' + sectionHead('Population growth, 2019–2024', 'Millions of people. Source: ' + SRC + '.')
    + lineChart(YEAR_LABELS, POPULATION, { unit: 'm', decimals: 1 }) + '</section>'
    + '<section class="card">' + sectionHead('Who we are by age, 2024', 'Share of the population. Source: ' + SRC + ' projection.')
    + hbarChart(ages) + '</section></div>'
    + '<section class="card">' + sectionHead('Where we live: the 10 biggest provinces', 'Population in millions, mid-2024. Source: ' + SRC + '.')
    + hbarChart(top10) + '<p class="more"><a href="#/regions">All 38 provinces with island, share and rank →</a></p></section>'
    + '<section class="card">' + sectionHead('People per island group, 2024', 'Millions of people. Source: ' + SRC + '.')
    + '<div class="tablescroll"><table class="data"><thead><tr><th>Island group</th><th class="num">Population</th><th class="num">Share of Indonesia</th></tr></thead><tbody>'
    + ISLANDS.map((is) => {
      const t = islandTotal(is);
      return '<tr><th>' + is + '</th><td class="num">' + fmtMillions(t / 1000) + '</td><td class="num">' + fmtShare(t, NATIONAL_POP_2024_THOUSANDS) + '</td></tr>';
    }).join('')
    + '</tbody></table></div></section>';
}

// ----------------------------------------------------------------- economy
function economy(st) {
  const y = st.year;
  const gdp = indicatorAt(GDP_NOMINAL, y);
  const growth = indicatorAt(GDP_GROWTH, y);
  const perCap = indicatorAt(GDP_PER_CAPITA, y);
  const infl = indicatorAt(INFLATION, y);
  const exp = indicatorAt(EXPORTS, y);
  const imp = indicatorAt(IMPORTS, y);
  const bal = indicatorAt(TRADE_BALANCE, y);
  const chart = st.econChart === 'line'
    ? lineChart(YEAR_LABELS, GDP_NOMINAL, { decimals: 0, unit: '' })
    : barChart(YEAR_LABELS, GDP_NOMINAL, { decimals: 0, unit: '' });
  return '<section class="hero slim"><p class="eyebrow">Economy · ' + SRC + '</p>'
    + '<h1>The economy in ' + y + '</h1>'
    + '<p class="lede">Indonesia’s economy is the largest in Southeast Asia and the 16th largest '
    + 'in the world by nominal GDP. It grew 5.03% in 2024 — the same steady 5% pace '
    + 'it has held since the post-pandemic rebound.</p>'
    + '<div class="hero-row">' + yearPicker(y)
    + '<span class="toggle" role="group" aria-label="Chart type">'
    + '<button type="button" data-chart="bar"' + (st.econChart !== 'line' ? ' class="on"' : '') + '>Bars</button>'
    + '<button type="button" data-chart="line"' + (st.econChart === 'line' ? ' class="on"' : '') + '>Line</button>'
    + '</span></div></section>'
    + '<section class="kpis">'
    + kpi(fmtRpTrillion(gdp), 'GDP (nominal)', 'BPS, ' + y)
    + kpi(fmtSignedPct(growth), 'Real GDP growth', 'BPS, ' + y)
    + kpi('Rp ' + fmtOne(perCap) + ' jt', 'GDP per capita', 'BPS, ' + y)
    + kpi(fmtPct(infl) + '%', 'Inflation (Dec, y-on-y)', 'BPS, ' + y)
    + '</section>'
    + '<div class="grid2">'
    + '<section class="card">' + sectionHead('GDP, 2019–2024', 'Nominal GDP, rupiah trillion. Source: ' + SRC + '.')
    + chart + '</section>'
    + '<section class="card">' + sectionHead('Growth, 2019–2024', 'Real GDP growth, percent. The 2020 dip is the pandemic year. Source: ' + SRC + '.')
    + barChart(YEAR_LABELS, GDP_GROWTH, { decimals: 2, unit: '%' }) + '</section></div>'
    + '<section class="card">' + sectionHead('Trade with the world, ' + y, 'Goods exports and imports, US dollars. Source: ' + SRC + '.')
    + '<div class="kpis small">'
    + kpi(fmtUsdBillion(exp), 'Exports', 'BPS, ' + y)
    + kpi(fmtUsdBillion(imp), 'Imports', 'BPS, ' + y)
    + kpi((bal >= 0 ? '+' : '−') + 'US$' + fmtOne(Math.abs(bal)) + ' bn', 'Trade balance (' + (bal >= 0 ? 'surplus' : 'deficit') + ')', 'BPS, ' + y)
    + '</div>'
    + '<div class="tablescroll"><table class="data"><thead><tr><th>Year</th><th class="num">Exports (US$ bn)</th><th class="num">Imports (US$ bn)</th><th class="num">Balance (US$ bn)</th></tr></thead><tbody>'
    + YEARS.map((yy, i) => '<tr><th>' + yy + '</th><td class="num">' + fmtOne(EXPORTS[i]) + '</td><td class="num">' + fmtOne(IMPORTS[i]) + '</td><td class="num">' + (TRADE_BALANCE[i] >= 0 ? '+' : '−') + fmtOne(Math.abs(TRADE_BALANCE[i])) + '</td></tr>').join('')
    + '</tbody></table></div></section>';
}

// ------------------------------------------------------------------- people
function people() {
  const f = PEOPLE_FACTS_2024;
  return '<section class="hero slim"><p class="eyebrow">People · ' + SRC + '</p>'
    + '<h1>Work, poverty and wellbeing</h1>'
    + '<p class="lede">Unemployment is back below 5% for the first time since the pandemic, '
    + 'poverty is at its lowest on record, and the Human Development Index has risen '
    + 'every year since 2020. The gaps are still wide — between city and village, '
    + 'and between provinces.</p></section>'
    + '<section class="kpis">'
    + kpi(fmtPct(4.91) + '%', 'Unemployment, Aug 2024', 'BPS, 2024')
    + kpi(fmtPct(9.03) + '%', 'Poverty rate, Mar 2024', 'BPS, 2024')
    + kpi(fmtPct(75.02), 'Human Development Index', 'BPS, 2024')
    + kpi(fmtOne(f.lifeExpectancy) + ' years', 'Life expectancy', 'BPS, ' + f.lifeExpectancyYear)
    + '</section>'
    + '<div class="grid2">'
    + '<section class="card">' + sectionHead('Unemployment, 2019–2024', 'Open unemployment rate, percent (August). Source: ' + SRC + '.')
    + lineChart(YEAR_LABELS, UNEMPLOYMENT, { unit: '%', decimals: 2 }) + '</section>'
    + '<section class="card">' + sectionHead('Poverty rate, 2019–2024', 'Percent of population (March). Source: ' + SRC + '.')
    + lineChart(YEAR_LABELS, POVERTY, { unit: '%', decimals: 2 }) + '</section></div>'
    + '<div class="grid2">'
    + '<section class="card">' + sectionHead('Human Development Index, 2019–2024', 'HDI, 0–100. Source: ' + SRC + '.')
    + lineChart(YEAR_LABELS, HDI, { unit: '', decimals: 2 }) + '</section>'
    + '<section class="card">' + sectionHead('Education and health', 'Latest published figures. Source: ' + SRC + '.')
    + '<dl class="facts">'
    + '<dt>Mean years of schooling</dt><dd>' + fmtOne(f.meanSchooling) + ' years (' + f.meanSchoolingYear + ')</dd>'
    + '<dt>Adult literacy rate</dt><dd>' + fmtPct(f.literacy) + '% (' + f.literacyYear + ')</dd>'
    + '<dt>Life expectancy at birth</dt><dd>' + fmtOne(f.lifeExpectancy) + ' years (' + f.lifeExpectancyYear + ')</dd>'
    + '<dt>Gini ratio (inequality)</dt><dd>' + f.gini.toFixed(3) + ' (' + f.giniYear + ')</dd>'
    + '<dt>Urban population</dt><dd>' + fmtPct(f.urbanShare) + '% (2024)</dd>'
    + '</dl></section></div>';
}

// ------------------------------------------------------------------ regions
function regions(st) {
  const q = st.query.trim().toLowerCase();
  let rows = PROVINCES.filter((p) => (st.island === 'All' || p.island === st.island)
    && (q === '' || p.name.toLowerCase().includes(q)));
  const dir = st.sortDir === 'desc' ? -1 : 1;
  const key = st.sortKey;
  rows = [...rows].sort((a, b) => {
    if (key === 'name') return dir * a.name.localeCompare(b.name);
    if (key === 'island') return dir * a.island.localeCompare(b.island);
    if (key === 'share') return dir * (a.pop - b.pop);
    return dir * (a.pop - b.pop);
  });
  const ranked = provincesBySize();
  const rankOf = (name) => ranked.findIndex((p) => p.name === name) + 1;
  const th = (label, k) => '<th data-sort="' + k + '"' + (key === k ? ' class="sorted"' : '') + '>' + label
    + (key === k ? (st.sortDir === 'desc' ? ' ↓' : ' ↑') : '') + '</th>';
  return '<section class="hero slim"><p class="eyebrow">Regions · ' + SRC + '</p>'
    + '<h1>All 38 provinces</h1>'
    + '<p class="lede">From Aceh in the west to Papua in the east. West Java alone holds '
    + 'more people than most countries. Click a column to sort; filter by island '
    + 'group or search by name.</p></section>'
    + '<section class="card"><div class="controls">'
    + '<label class="search">Search <input id="provSearch" type="search" placeholder="Type a province name…" value="' + st.query.replace(/"/g, '&quot;') + '"></label>'
    + '<span class="chips" role="group" aria-label="Island group">'
    + ['All', ...ISLANDS].map((is) => '<button type="button" data-island="' + is + '"' + (st.island === is ? ' class="on"' : '') + '>' + is + '</button>').join('')
    + '</span></div>'
    + '<p class="count">' + rows.length + ' of 38 provinces · population mid-2024, thousands · share of 281.6 million</p>'
    + '<div class="tablescroll"><table class="data"><thead><tr>'
    + '<th>#</th>' + th('Province', 'name') + th('Island group', 'island')
    + th('Population (000s)', 'pop') + th('Share', 'share')
    + '</tr></thead><tbody>'
    + rows.map((p) => '<tr><td>' + rankOf(p.name) + '</td><th>' + p.name + '</th><td>' + p.island + '</td>'
      + '<td class="num">' + fmtInt(p.pop) + '</td><td class="num">' + fmtShare(p.pop, NATIONAL_POP_2024_THOUSANDS) + '</td></tr>').join('')
    + '</tbody></table></div>'
    + (rows.length === 0 ? '<p class="empty">No province matches that search. Clear the search to see all 38 again.</p>' : '')
    + '</section>';
}

// ------------------------------------------------------------------ compare
function compare(st) {
  const a = provinceNamed(st.cmpA) || PROVINCES[11];
  const b = provinceNamed(st.cmpB) || PROVINCES[14];
  const options = (sel) => PROVINCES.map((p) => '<option value="' + p.name + '"' + (p.name === sel ? ' selected' : '') + '>' + p.name + '</option>').join('');
  const card = (p, other) => {
    const share = fmtShare(p.pop, NATIONAL_POP_2024_THOUSANDS);
    const vs = p.pop > other.pop ? 'larger than ' + other.name : p.pop < other.pop ? 'smaller than ' + other.name : 'the same size as ' + other.name;
    return '<section class="card"><h2>' + p.name + '</h2>'
      + '<div class="big">' + fmtMillions(p.pop / 1000) + '</div>'
      + '<p class="lede">' + share + ' of Indonesia — ' + fmtInt(p.pop) + ' thousand people, '
      + 'ranked #' + (provincesBySize().findIndex((x) => x.name === p.name) + 1) + ' of 38. '
      + 'That is ' + vs + '.</p>'
      + '<dl class="facts"><dt>Island group</dt><dd>' + p.island + '</dd>'
      + '<dt>Population</dt><dd>' + fmtInt(p.pop) + ' thousand</dd>'
      + '<dt>Share of Indonesia</dt><dd>' + share + '</dd>'
      + '<dt>One in</dt><dd>' + Math.round(NATIONAL_POP_2024_THOUSANDS / p.pop) + ' Indonesians lives here</dd></dl></section>';
  };
  return '<section class="hero slim"><p class="eyebrow">Compare · ' + SRC + '</p>'
    + '<h1>Compare two provinces</h1>'
    + '<p class="lede">Pick any two provinces and see them side by side. '
    + 'Populations are BPS mid-2024 estimates.</p>'
    + '<div class="compare-controls">'
    + '<label>Province A <select id="cmpA">' + options(a.name) + '</select></label>'
    + '<button type="button" id="cmpSwap">⇄ Swap</button>'
    + '<label>Province B <select id="cmpB">' + options(b.name) + '</select></label>'
    + '</div></section>'
    + '<div class="grid2">' + card(a, b) + card(b, a) + '</div>'
    + '<section class="card">' + sectionHead(a.name + ' vs ' + b.name, 'Population in millions, mid-2024. Source: ' + SRC + '.')
    + hbarChart([
      { label: a.name, value: a.pop / 1000, decimals: 1, unit: 'm' },
      { label: b.name, value: b.pop / 1000, decimals: 1, unit: 'm' },
    ]) + '</section>';
}

// ------------------------------------------------------------------ sources
function sources() {
  const rows = [
    ['Population 2019–2024', 'BPS, mid-year population estimates', 'Statistik Indonesia 2020–2025'],
    ['GDP, growth, GDP per capita', 'BPS, national accounts (current prices)', 'Statistik Indonesia 2020–2025'],
    ['Inflation', 'BPS, Consumer Price Index release', 'December release, each year'],
    ['Unemployment', 'BPS, Sakernas labour force survey', 'August round, each year'],
    ['Poverty rate', 'BPS, Susenas socio-economic survey', 'March round, each year'],
    ['Human Development Index', 'BPS, HDI release', 'Each year'],
    ['Exports & imports', 'BPS, foreign trade statistics', 'Annual totals, each year'],
    ['Provincial populations', 'BPS, provincial population estimates', 'Mid-2024'],
    ['Age structure, median age, urban share', 'BPS, population projection', '2024'],
    ['Life expectancy, schooling, literacy', 'BPS, social indicators', '2023'],
  ];
  return '<section class="hero slim"><p class="eyebrow">Methodology &amp; sources</p>'
    + '<h1>Where every number comes from</h1>'
    + '<p class="lede">Every figure on this site is a published BPS (Statistics Indonesia) '
    + 'figure, labelled with its year on the page where it appears. Nothing here '
    + 'is estimated by us, scraped, or fetched at run time: the data is bundled '
    + 'with the site, so the numbers are the same on every visit.</p></section>'
    + '<section class="card">' + sectionHead('Sources by series', 'BPS — Statistics Indonesia (bps.go.id).')
    + '<div class="tablescroll"><table class="data"><thead><tr><th>Series</th><th>Source</th><th>Publication</th></tr></thead><tbody>'
    + rows.map((r) => '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>').join('')
    + '</tbody></table></div></section>'
    + '<section class="card">' + sectionHead('How to read the figures', 'Notes a careful reader needs.')
    + '<ul class="notes">'
    + '<li><strong>Population</strong> is the mid-year estimate. The 2020 census counted 270.20 million; the 2024 figure is the BPS projection from it.</li>'
    + '<li><strong>GDP</strong> is nominal, at current prices, in rupiah. Growth is real (constant-price) growth on the year before.</li>'
    + '<li><strong>Inflation</strong> is the December consumer-price change on the same month a year earlier.</li>'
    + '<li><strong>Unemployment</strong> is the open unemployment rate from the August Sakernas round; <strong>poverty</strong> is the March Susenas round.</li>'
    + '<li><strong>Provincial populations</strong> are mid-2024 estimates in thousands; the 38 add to 281,623 thousand (281.6 million).</li>'
    + '<li><strong>Trade</strong> covers goods only, in US dollars; the balance is exports minus imports.</li>'
    + '</ul></section>'
    + '<section class="card">' + sectionHead('About this site', 'Nusantara Data is an independent project.')
    + '<p class="lede">Nusantara Data is not affiliated with BPS or the Government of Indonesia. '
    + 'It republishes public BPS figures with their sources so anyone can check them. '
    + 'The site runs entirely from its own files — no network requests, no tracking, '
    + 'no cookies — and works on a desktop and on a phone.</p></section>';
}

export const VIEWS = { overview, population, economy, people, regions, compare, sources };

