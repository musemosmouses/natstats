// Nusantara Data — router and page wiring.
//
// One hash router: #/ is the overview, #/population, #/economy, #/people,
// #/regions, #/compare and #/sources are the other pages. The state lives in
// this file (year, table sort, island filter, search text, compare picks,
// economy chart type) and every view is re-rendered from it, so the back
// button, a bookmarked hash and a fresh load all show the same page.
//
// Controls are wired by delegation on #view: one listener per event type,
// matched on data attributes and element ids, so re-rendering never leaves
// a dead button behind. Nothing here touches the network or the clock.

import { VIEWS } from './views.js';

const viewEl = document.getElementById('view');
const navLinks = Array.from(document.querySelectorAll('.mainnav a'));

// Shared state. The year defaults to the latest year the data covers.
const state = {
  year: 2024,
  sortKey: 'pop',
  sortDir: 'desc',
  island: 'All',
  query: '',
  cmpA: 'West Java',
  cmpB: 'East Java',
  econChart: 'bar',
};

// Read the route from the hash: "#/economy" -> "economy", "" or "#/" -> "".
function currentRoute() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(2).split('?')[0].split('/')[0];
  return Object.prototype.hasOwnProperty.call(VIEWS, path) ? path : '';
}

// Render the current route and mark the matching nav link.
function render() {
  const route = currentRoute();
  viewEl.innerHTML = VIEWS[route === '' ? 'overview' : route](state);
  navLinks.forEach((a) => {
    const on = (a.getAttribute('data-route') || '') === route;
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);

// Year picker (Overview, Economy).
viewEl.addEventListener('change', (ev) => {
  const t = ev.target;
  if (t.id === 'yearPick') {
    const y = Number(t.value);
    if (Number.isInteger(y) && y >= 2019 && y <= 2024) {
      state.year = y;
      render();
    }
  }
  if (t.id === 'cmpA') { state.cmpA = t.value; render(); }
  if (t.id === 'cmpB') { state.cmpB = t.value; render(); }
});

// Clicks: table sort headers, island chips, chart toggle, compare swap.
viewEl.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-sort], [data-island], [data-chart], #cmpSwap');
  if (!t) return;
  if (t.hasAttribute('data-sort')) {
    const k = t.getAttribute('data-sort');
    if (state.sortKey === k) state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
    else { state.sortKey = k; state.sortDir = k === 'name' || k === 'island' ? 'asc' : 'desc'; }
    render();
    return;
  }
  if (t.hasAttribute('data-island')) {
    state.island = t.getAttribute('data-island');
    render();
    return;
  }
  if (t.hasAttribute('data-chart')) {
    state.econChart = t.getAttribute('data-chart');
    render();
    return;
  }
  if (t.id === 'cmpSwap') {
    const a = state.cmpA;
    state.cmpA = state.cmpB;
    state.cmpB = a;
    render();
  }
});

// Province search: re-render on input, keeping the caret usable by
// restoring focus and the caret position after each keystroke.
viewEl.addEventListener('input', (ev) => {
  const t = ev.target;
  if (t.id !== 'provSearch') return;
  state.query = t.value;
  const pos = t.selectionStart;
  render();
  const again = document.getElementById('provSearch');
  if (again) {
    again.focus();
    again.setSelectionRange(pos, pos);
  }
});

render();

