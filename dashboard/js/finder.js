// Place finder: search by town name, quick jumps, and the list of tracts
// whose Census and Zillow home values disagree by more than 2x.

import { FORMATTERS } from "./dimensions.js";

const QUICK_JUMPS = ["Redwood City", "San Jose", "Burlingame", "Oakland"];

export function buildFinder({ features, onJump, onSelect }) {
  const byPlace = new Map();
  for (const f of features) {
    const place = f.properties.place;
    if (!place) continue;
    if (!byPlace.has(place)) byPlace.set(place, []);
    byPlace.get(place).push(f);
  }

  const jumpTo = (name) => {
    const list = byPlace.get(name);
    if (!list || !list.length) return;
    const mostPopulous = list.reduce((a, b) => ((a.properties.pop ?? 0) >= (b.properties.pop ?? 0) ? a : b));
    onJump(list, mostPopulous);
  };

  const quick = document.getElementById("quick-jump-buttons");
  for (const name of QUICK_JUMPS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = name;
    btn.addEventListener("click", () => jumpTo(name));
    quick.appendChild(btn);
  }

  const input = document.getElementById("place-search");
  const results = document.getElementById("place-results");
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = "";
    if (q.length < 2) return;
    const matches = [...byPlace.keys()].filter((n) => n.toLowerCase().includes(q)).slice(0, 8);
    for (const name of matches) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `${name} (${byPlace.get(name).length} tracts)`;
      btn.addEventListener("click", () => {
        results.innerHTML = "";
        input.value = name;
        jumpTo(name);
      });
      results.appendChild(btn);
    }
  });

  // Flagged tracts: ACS vs ZHVI disagree >2x (amber outlines on the value map).
  const flagged = features.filter((f) => f.properties.value_flag === "acs_zhvi_diverge");
  const host = document.getElementById("flagged-list");
  if (flagged.length) {
    const head = document.createElement("h3");
    head.textContent = `Value-check tracts (${flagged.length})`;
    const wrap = document.createElement("div");
    wrap.className = "flag-buttons";
    flagged
      .slice()
      .sort((a, b) => (a.properties.place ?? "").localeCompare(b.properties.place ?? ""))
      .forEach((f) => {
        const p = f.properties;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = `${p.place ?? p.county} — ACS ${FORMATTERS.usdCompact(p.home_value)} vs Zillow ${FORMATTERS.usdCompact(p.zhvi)}`;
        btn.addEventListener("click", () => onSelect(f, true));
        wrap.appendChild(btn);
      });
    host.append(head, wrap);
  }
}
