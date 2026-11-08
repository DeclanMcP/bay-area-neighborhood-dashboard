// App wiring: tabs from the dimension registry, map, panel, finder, checks.
// Geography comes from the data file (fitBounds on load), so wider coverage
// later needs no code change — only a new tracts.geojson.

import {
  DIMENSIONS, DIMENSION_BY_KEY, FORMATTERS, GROUPS,
  PROJECTED_DIMENSIONS, PROJECTED_GROUPS,
} from "./dimensions.js";
import { loadTracts, median, values } from "./data.js";
import { Choropleth, createMap } from "./map.js";
import { renderPanel } from "./panel.js";
import { buildFinder } from "./finder.js";
import { buildRankings } from "./rankings.js";
import { renderChecks } from "./checks.js";

const state = {
  features: [],
  mode: "current",
  horizon: 5,
  entry: DIMENSION_BY_KEY.home_value,
  dim: DIMENSION_BY_KEY.home_value,
  choro: null,
};

function registry() {
  return state.mode === "current"
    ? { dims: DIMENSIONS, groups: GROUPS }
    : { dims: PROJECTED_DIMENSIONS, groups: PROJECTED_GROUPS };
}

// In projected mode the active dimension is the registry entry with its
// GeoJSON keys resolved for the chosen horizon. The MAP key is the change
// property where the dimension defines one (valueKey holds the level).
function effectiveDim(entry) {
  if (state.mode === "current") return entry;
  const eff = {
    ...entry,
    key: entry.keyFor(state.horizon),
    valueKey: entry.valueKeyFor(state.horizon),
    changeKey: entry.changeKeyFor ? entry.changeKeyFor(state.horizon) : null,
    loKey: entry.loFor ? entry.loFor(state.horizon) : null,
    hiKey: entry.hiFor ? entry.hiFor(state.horizon) : null,
    horizon: state.horizon,
  };
  if (entry.mapFormat) {
    eff.format = entry.mapFormat;
    eff.legendFormat = entry.mapFormat;
  }
  eff.levelFormat = entry.format;
  eff.changeFormat = entry.mapFormat ?? null;
  eff.valueLabel = entry.valueLabel ?? entry.label;
  return eff;
}

function buildTabs() {
  const nav = document.getElementById("dimension-tabs");
  nav.innerHTML = "";
  const { dims, groups } = registry();
  for (const group of groups) {
    const wrap = document.createElement("div");
    wrap.className = "tab-group";
    const head = document.createElement("h3");
    head.textContent = group;
    const buttons = document.createElement("div");
    buttons.className = "tab-buttons";
    for (const dim of dims.filter((d) => d.group === group)) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab-btn" + (dim === state.entry ? " active" : "");
      btn.textContent = dim.label;
      btn.dataset.key = dim.id ?? dim.key;
      btn.addEventListener("click", () => selectDimension(dim));
      buttons.appendChild(btn);
    }
    wrap.append(head, buttons);
    nav.appendChild(wrap);
  }
}

function selectDimension(entry) {
  state.entry = entry;
  state.dim = effectiveDim(entry);
  document.querySelectorAll(".tab-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.key === (entry.id ?? entry.key)));
  state.choro.setDimension(state.dim);
  const about = document.getElementById("dimension-about");
  about.textContent = state.mode === "projected"
    ? `${entry.about} Showing the ${state.horizon}-year horizon (to ${2026 + state.horizon}).`
    : entry.about;
  renderCountyTable();
  renderSpotlight();
}

// Projected-mode spotlight banner: the regional median of the active
// projected dimension, level and change together, so the headline number
// is visible without clicking a tract.
function renderSpotlight() {
  const el = document.getElementById("spotlight");
  if (state.mode !== "projected") {
    el.hidden = true;
    el.innerHTML = "";
    return;
  }
  const entry = state.entry;
  const dim = state.dim;
  const levelVals = dim.valueKey ? values(state.features, dim.valueKey) : [];
  if (!levelVals.length) {
    el.hidden = true;
    return;
  }
  const year = 2026 + state.horizon;
  const kicker = entry.changeBase
    ? `Regional median · ${entry.valueLabel} ${year}`
    : `Regional median · ${entry.valueLabel ?? entry.label}`;
  let detail = "";
  if (dim.changeKey) {
    const chg = median(values(state.features, dim.changeKey));
    detail = `<span>${FORMATTERS[entry.mapFormat](chg)} vs today</span>`;
  } else if (entry.id === "proj_water") {
    detail = "<span>carried forward from today (persistence)</span>";
  } else if (entry.id === "proj_pressure") {
    detail = "<span>scenario index, not a forecast</span>";
  } else if (entry.id === "proj_crime_v" || entry.id === "proj_crime_p") {
    detail = "<span>SF persistence; Oakland/Sonoma level-only</span>";
  }
  const unit = entry.unit ? `<small>${entry.unit}</small>` : "";
  el.innerHTML =
    `<span class="spot-kicker">${kicker}</span>` +
    `<strong>${FORMATTERS[entry.format](median(levelVals))}</strong>` +
    detail +
    `<small>${levelVals.length.toLocaleString("en-US")} tracts</small>` + unit;
  el.hidden = false;
}

function setMode(mode) {
  if (!mode || state.mode === mode) return;
  state.mode = mode;
  document.querySelectorAll(".mode-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.mode === mode));
  document.getElementById("horizon-toggle").hidden = mode !== "projected";
  const { dims } = registry();
  buildTabs();
  selectDimension(dims[0]);
}

function setHorizon(h) {
  if (state.mode !== "projected" || state.horizon === h) return;
  state.horizon = h;
  document.querySelectorAll(".horizon-btn").forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.horizon) === h));
  selectDimension(state.entry);
}

function renderCountyTable() {
  const dim = state.dim;
  // Projected change dimensions pair each county's projected LEVEL median
  // with its CHANGE median; a change-only table hides the actual values.
  const paired = state.mode === "projected" && dim.valueKey && dim.changeKey;
  const byCounty = new Map();
  for (const f of state.features) {
    const c = f.properties.county;
    if (!byCounty.has(c)) byCounty.set(c, { map: [], level: [], change: [] });
    const bucket = byCounty.get(c);
    const v = f.properties[dim.key];
    if (typeof v === "number") bucket.map.push(v);
    if (paired) {
      const lv = f.properties[dim.valueKey];
      if (typeof lv === "number") bucket.level.push(lv);
      const cv = f.properties[dim.changeKey];
      if (typeof cv === "number") bucket.change.push(cv);
    }
  }
  const counties = [...byCounty.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  if (paired) {
    const levelFmt = FORMATTERS[state.entry.format];
    const changeFmt = FORMATTERS[state.entry.mapFormat];
    const head =
      `<tr><th>County</th><th class="num">${state.entry.valueLabel}</th>` +
      `<th class="num">Change</th><th class="num">Tracts</th></tr>`;
    const rows = counties
      .map(([county, b]) =>
        `<tr><th>${county}</th>` +
        `<td>${b.level.length ? levelFmt(median(b.level)) : "no data"}</td>` +
        `<td>${b.change.length ? changeFmt(median(b.change)) : "no data"}</td>` +
        `<td>${b.level.length} tracts</td></tr>`)
      .join("");
    document.getElementById("county-table").innerHTML =
      `<table><caption>County medians: ${state.entry.label} (${2026 + state.horizon})</caption>${head}${rows}</table>`;
    return;
  }
  const fmt = FORMATTERS[dim.format];
  const rows = counties
    .map(([county, b]) =>
      `<tr><th>${county}</th><td>${b.map.length ? fmt(median(b.map)) : "no data"}</td><td>${b.map.length} tracts</td></tr>`)
    .join("");
  document.getElementById("county-table").innerHTML =
    `<table><caption>County medians: ${dim.label}</caption>${rows}</table>`;
}

function selectTract(feature, zoom = false) {
  renderPanel(document.getElementById("tract-panel"), feature, state.dim);
  state.choro.highlight(feature);
  if (zoom) state.choro.zoomTo([feature]);
}

function wireToggles() {
  // Mode buttons carry data-mode; horizon buttons share the .mode-btn
  // styling class but must never be treated as mode switches.
  document.querySelectorAll(".mode-btn[data-mode]").forEach((b) =>
    b.addEventListener("click", () => setMode(b.dataset.mode)));
  document.querySelectorAll(".horizon-btn").forEach((b) =>
    b.addEventListener("click", () => setHorizon(Number(b.dataset.horizon))));
}

async function main() {
  buildTabs();
  wireToggles();
  let features;
  try {
    features = await loadTracts();
  } catch (err) {
    document.querySelector(".panel-empty").textContent =
      "Could not load tracts.geojson. Serve this folder over HTTP " +
      "(e.g. python3 -m http.server in dashboard/) rather than opening the file directly.";
    throw err;
  }
  state.features = features;
  const map = createMap("map");
  state.choro = new Choropleth(map, features, (f) => selectTract(f));
  buildFinder({
    features,
    onJump: (list, tract) => {
      state.choro.zoomTo(list);
      selectTract(tract);
    },
    onSelect: (f, zoom) => selectTract(f, zoom),
  });
  buildRankings({
    features,
    onSelect: (f, zoom) => selectTract(f, zoom),
  });
  renderChecks(document.getElementById("dataset-checks"), features);
  selectDimension(state.entry);
}

main();
