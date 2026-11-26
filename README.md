# Nusantara Data — Indonesia in Numbers

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/musemosmouses/natstats/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/musemosmouses/natstats/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

A national statistics site for Indonesia: population, economy, work, poverty,
health, education, and all 38 provinces — with real figures from BPS
(Statistics Indonesia), each labelled with its source and year.

Built for the make.fun bounty **"Make the best national statistics site"**
(`best-national-statistics-site-20261126-0539`).

## What it is

- **Overview** — key figures for 2019–2024 with a year picker, population
  trend, GDP-by-sector donut, biggest provinces, and the year in one table.
- **Population** — growth, age structure, island groups, top-10 provinces.
- **Economy** — GDP, growth, GDP per capita, inflation, trade (exports,
  imports, balance) with a bar/line chart toggle.
- **People** — unemployment, poverty, HDI, education and health facts.
- **Regions** — all 38 provinces in a sortable, searchable, filterable table.
- **Compare** — any two provinces side by side, with a swap button.
- **Sources** — methodology and the publication behind every series.

## How it runs

Static files under `app/` — no build step, no network request at run time.
Every figure is bundled with the site in `app/data/`; charts are hand-rolled
SVG in `app/js/charts.js`. Open it with any static server:

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

or serve `app/` with any static HTTP server and open `index.html`.

`main.ts` (Node 22, standard library only) hands the site in: it copies
`app/` and `screenshots/` to `/output` and writes `/output/dossier.json`
with the vendored `vendor/makefun-frontend.ts` library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Data

All figures are published BPS — Statistics Indonesia figures (2019–2024),
listed per series on the site's Sources page. Provincial populations are
BPS mid-2024 estimates; the 38 add to 281,623 thousand (281.6 million).
This site is an independent project and is not affiliated with BPS.

## Layout

```
repo/
  main.ts                  entrypoint: copy app/ + screenshots/ -> /output, write dossier.json
  LICENSE                  MIT
  README.md                this file
  app/
    index.html             shell: header, nav, #view, footer
    style.css              all styling, responsive
    data/
      indicators.js        national indicators 2019-2024 (BPS)
      provinces.js         38 provinces, 2024 population (BPS)
    js/
      format.js            number formatting
      charts.js            SVG chart builders (line, bar, horizontal bar, donut)
      views.js             one render function per route
      main.js              hash router + control wiring
  vendor/
    makefun-frontend.ts    kit library, unchanged
  screenshots/             real renders of the site (cover first by name)
```

## License

MIT — see `LICENSE`.
