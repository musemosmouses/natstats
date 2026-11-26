// Nusantara Data — SVG chart builders.
//
// Every chart on the site is a plain SVG string built from the bundled data.
// No chart library, no canvas, no network: the strings are deterministic
// (same data in, same markup out) and they render identically on desktop
// and on a phone because SVG scales. Colours come from the site palette so
// a chart never clashes with the page around it.

import { fmtAxis } from './format.js';

const TEAL = '#0f766e';
const TEAL_SOFT = '#14b8a6';
const AMBER = '#d97706';
const AMBER_SOFT = '#f59e0b';
const INK = '#14201d';
const MUTED = '#5b6b66';
const GRID = '#d9e2de';
const DONUT_COLORS = ['#0f766e', '#14b8a6', '#d97706', '#f59e0b', '#0e7490', '#65a30d', '#7c3aed', '#94a3b8'];

// Escape text that goes inside an SVG element or attribute.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Nice round axis steps: pick a step from 1/2/5 x 10^n that gives 3-5 ticks.
function niceStep(max, count) {
  const raw = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * mag;
}

// Line chart with labelled points. labels: year strings, values: numbers.
export function lineChart(labels, values, opts) {
  const o = Object.assign({ width: 640, height: 260, color: TEAL, unit: '', decimals: 1 }, opts || {});
  const padL = 52, padR = 14, padT = 16, padB = 30;
  const w = o.width, h = o.height;
  const iw = w - padL - padR, ih = h - padT - padB;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = min < 0 ? Math.min(0, min * 1.08) : Math.max(0, min - (max - min) * 0.15);
  const hi = max * 1.06 + (max - min) * 0.04;
  const x = (i) => padL + (iw * i) / (labels.length - 1);
  const y = (v) => padT + ih - ((v - lo) / (hi - lo)) * ih;
  const step = niceStep(hi - lo, 4);
  let ticks = '';
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) {
    ticks += '<line x1="' + padL + '" y1="' + y(v).toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y(v).toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>'
      + '<text x="' + (padL - 8) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + MUTED + '">' + fmtAxis(v) + '</text>';
  }
  let pts = '';
  let dots = '';
  values.forEach((v, i) => {
    pts += (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(v).toFixed(1) + ' ';
    dots += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4" fill="' + o.color + '"/>'
      + '<text x="' + x(i).toFixed(1) + '" y="' + (y(v) - 10).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + INK + '">' + v.toFixed(o.decimals) + o.unit + '</text>';
  });
  let years = '';
  labels.forEach((lb, i) => {
    years += '<text x="' + x(i).toFixed(1) + '" y="' + (h - 8) + '" text-anchor="middle" font-size="11" fill="' + MUTED + '">' + esc(lb) + '</text>';
  });
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Line chart">'
    + ticks
    + '<path d="' + pts.trim() + '" fill="none" stroke="' + o.color + '" stroke-width="2.5" stroke-linejoin="round"/>'
    + dots + years + '</svg>';
}

// Vertical bar chart. values may be negative; the zero line is drawn.
export function barChart(labels, values, opts) {
  const o = Object.assign({ width: 640, height: 260, color: TEAL, negative: '#b91c1c', unit: '', decimals: 0 }, opts || {});
  const padL = 52, padR = 14, padT = 22, padB = 30;
  const w = o.width, h = o.height;
  const iw = w - padL - padR, ih = h - padT - padB;
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const y = (v) => padT + ih - ((v - min) / span) * ih;
  const step = niceStep(span, 4);
  let ticks = '';
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) {
    ticks += '<line x1="' + padL + '" y1="' + y(v).toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y(v).toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>'
      + '<text x="' + (padL - 8) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + MUTED + '">' + fmtAxis(v) + '</text>';
  }
  const slot = iw / labels.length;
  const bw = Math.min(54, slot * 0.62);
  let bars = '';
  values.forEach((v, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = Math.min(y(v), y(0));
    const ht = Math.max(1, Math.abs(y(v) - y(0)));
    bars += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + ht.toFixed(1) + '" rx="3" fill="' + (v < 0 ? o.negative : o.color) + '"/>'
      + '<text x="' + cx.toFixed(1) + '" y="' + (top - 6).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + INK + '">' + v.toFixed(o.decimals) + o.unit + '</text>'
      + '<text x="' + cx.toFixed(1) + '" y="' + (h - 8) + '" text-anchor="middle" font-size="11" fill="' + MUTED + '">' + esc(labels[i]) + '</text>';
  });
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Bar chart">'
    + ticks + bars + '</svg>';
}

// Horizontal bar list: label on the left, bar, value on the right. Used for
// top provinces and age groups, where names are long and bars read better.
export function hbarChart(rows, opts) {
  const o = Object.assign({ width: 640, barHeight: 26, gap: 10, color: TEAL, unit: '', decimals: 1, maxLabel: 170 }, opts || {});
  const max = Math.max(...rows.map((r) => r.value));
  const rowH = o.barHeight + o.gap;
  const h = rows.length * rowH + 8;
  const valueW = 64;
  const barX = o.maxLabel + 10;
  const barW = o.width - barX - valueW - 8;
  let out = '';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const bw = Math.max(2, (r.value / max) * barW);
    const col = r.color || o.color;
    out += '<text x="0" y="' + (y + o.barHeight / 2 + 4) + '" font-size="12" fill="' + INK + '">' + esc(r.label) + '</text>'
      + '<rect x="' + barX + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="' + o.barHeight + '" rx="4" fill="' + col + '"/>'
      + '<text x="' + (barX + bw + 8).toFixed(1) + '" y="' + (y + o.barHeight / 2 + 4) + '" font-size="12" font-weight="700" fill="' + INK + '">' + r.value.toFixed(o.decimals) + o.unit + '</text>';
  });
  return '<svg viewBox="0 0 ' + o.width + ' ' + h + '" role="img" aria-label="Horizontal bar chart">' + out + '</svg>';
}

// Donut chart with a centre label. segments: [{name, share}].
export function donutChart(segments, centreLabel, centreValue) {
  const size = 240, cx = 120, cy = 120, r = 92, hole = 58;
  const total = segments.reduce((s, g) => s + g.share, 0);
  let angle = -90;
  let slices = '';
  segments.forEach((g, i) => {
    const frac = g.share / total;
    const a0 = (angle * Math.PI) / 180;
    const a1 = ((angle + frac * 360) * Math.PI) / 180;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + hole * Math.cos(a1), yi1 = cy + hole * Math.sin(a1);
    const xi0 = cx + hole * Math.cos(a0), yi0 = cy + hole * Math.sin(a0);
    slices += '<path d="M' + x0.toFixed(1) + ',' + y0.toFixed(1) + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ',' + y1.toFixed(1)
      + ' L' + xi1.toFixed(1) + ',' + yi1.toFixed(1) + ' A' + hole + ',' + hole + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ',' + yi0.toFixed(1)
      + ' Z" fill="' + DONUT_COLORS[i % DONUT_COLORS.length] + '"/>';
    angle += frac * 360;
  });
  return '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Donut chart">'
    + slices
    + '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="20" font-weight="800" fill="' + INK + '">' + esc(centreValue) + '</text>'
    + '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="11" fill="' + MUTED + '">' + esc(centreLabel) + '</text></svg>';
}

// Legend chips for a donut: coloured dot + name + share.
export function donutLegend(segments) {
  return '<ul class="legend">' + segments.map((g, i) =>
    '<li><span class="dot" style="background:' + DONUT_COLORS[i % DONUT_COLORS.length] + '"></span>'
    + esc(g.name) + ' — <strong>' + g.share.toFixed(1) + '%</strong></li>').join('') + '</ul>';
}

