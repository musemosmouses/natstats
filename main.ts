// Nusantara Data — entrypoint (Node 22, standard library only).
//
// The site is this repository's app/ folder: plain static files a browser
// opens at app/index.html (ES modules, CSS, no build step), its content held
// in its own files — nothing it runs, styles or shows loads over the
// network. This program hands the site in: it copies app/ and screenshots/
// from beside this file to /output and writes /output/dossier.json, the
// summary the judge reads (the screenshots, the first load's files and
// bytes, and the source), with the vendored make.fun library.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The program must write the same bytes on both of the grader's runs, so it
// does no clock reads, no random choices and no network: copy, then dossier.
// Dotfiles (a .gitkeep holding an empty directory on GitHub, for example)
// are never copied into /output: the scorer refuses an output path that is
// not a plain relative name, so both copies skip any file whose name starts
// with a dot. The output directory itself is never removed: the grader runs
// on a read-only filesystem and removing /output would fail the run.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Skip dotfiles on every copy into the output tree.
function skipDotfiles(src) {
  return !src.split('/').pop().startsWith('.');
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true, filter: skipDotfiles });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true, filter: skipDotfiles });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse (more than
// 4 screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 16 MiB of app files: app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

