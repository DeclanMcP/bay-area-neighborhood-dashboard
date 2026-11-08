// App wiring: tabs from the dimension registry, map, panel, finder, checks.
// Geography comes from the data file (fitBounds on load), so wider coverage
// later needs no code change — only a new tracts.geojson.

import {
  DIMENSIONS, DIMENSION_BY_KEY, FORMATTERS, GROUPS,
  PROJECTED_DIMENSIONS, PROJECTED_GROUPS,
} from "./dimensions.js";
import { loadTracts, median } from "./data.js";
import { Choropleth, createMap } from "./map.js";
import { renderPanel } from "./panel.js";
import { buildFinder } from "./finder.js";
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
  const byCounty = new Map();
  for (const f of state.features) {
    const c = f.properties.county;
    if (!byCounty.has(c)) byCounty.set(c, []);
    const v = f.properties[dim.key];
    if (typeof v === "number") byCounty.get(c).push(v);
  }
  const fmt = FORMATTERS[dim.format];
  const rows = [...byCounty.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([county, vals]) =>
      `<tr><th>${county}</th><td>${vals.length ? fmt(median(vals)) : "no data"}</td><td>${vals.length} tracts</td></tr>`)
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
  renderChecks(document.getElementById("dataset-checks"), features);
  selectDimension(state.entry);
}

main();
