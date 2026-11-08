// Rankings: composite scores per demographic persona, computed live from
// the loaded GeoJSON. One persona for now (young family); the PERSONAS
// registry is where later demographics slot in.
//
// Young family, $500k saved — method (same computation as the analysis):
//   Gates: population >= 500, median home value $500k-$1.35M (with $500k
//   saved, tracts far above that are out of reach; below it, medians are
//   mostly condo/rental stock), schools + value data present.
//   Schools (35%): half current ZIP-area proficiency level, half momentum
//   (average of the 2019->2025 proficiency change percentile and the
//   projected 5-year change percentile) — "up and coming", not just good.
//   Price performance (25%): half trailing Zillow 5y CAGR percentile,
//   half projected 5-year value-change percentile.
//   Affordability (20%): inverted home-value percentile within the gates.
//   Safety (20%): where a geocoded crime feed covers the tract, inverted
//   percentile of (property + 3x violent) per-1k rates. Where no feed
//   exists the other weights renormalize and the row is badged — safety
//   is NOT assumed. Caveat: Sonoma's feed is sheriff-jurisdiction only,
//   so near-zero rates inside incorporated cities there are a coverage
//   artifact, not measured safety.

import { FORMATTERS } from "./dimensions.js";
import { median } from "./data.js";
import { ZILLOW_PICKS, PICKS_NOTE } from "./zillow_picks.js";

export const PERSONAS = {
  young_family: {
    label: "Young family",
    weights: { schools: 0.35, pricePerf: 0.25, afford: 0.20, safety: 0.20 },
    gates: { minPop: 500, minValue: 500_000, maxValue: 1_350_000 },
  },
};

// Average-rank percentile (0-100), matching pandas rank(pct=True).
function percentiles(entries) {
  const sorted = [...entries].sort((a, b) => a.value - b.value);
  const out = new Map();
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1].value === sorted[i].value) j++;
    const avgRank = (i + j) / 2 + 1; // 1-based average rank
    const pct = (avgRank / sorted.length) * 100;
    for (let k = i; k <= j; k++) out.set(sorted[k].feature, pct);
    i = j + 1;
  }
  return out;
}

function pctMap(features, key, fill = null) {
  const entries = [];
  for (const f of features) {
    let v = f.properties[key];
    if (typeof v !== "number" && fill !== null) v = fill;
    if (typeof v === "number" && Number.isFinite(v)) entries.push({ feature: f, value: v });
  }
  return percentiles(entries);
}

export function rankTracts(features, personaKey = "young_family") {
  const persona = PERSONAS[personaKey];
  const g = persona.gates;
  const eligible = features.filter((f) => {
    const p = f.properties;
    return (p.pop ?? 0) >= g.minPop
      && typeof p.home_value === "number"
      && p.home_value >= g.minValue && p.home_value <= g.maxValue
      && typeof p.school_prof_area === "number"
      && typeof p.proj_school_chg_5y === "number"
      && typeof p.proj_value_chg_5y === "number"
      && typeof p.zhvi_cagr5 === "number";
  });

  const changeVals = eligible.map((f) => f.properties.school_change_area).filter((v) => typeof v === "number");
  const changeFill = changeVals.length ? median(changeVals) : 0;

  const pSchoolLevel = pctMap(eligible, "school_prof_area");
  const pSchoolRecent = pctMap(eligible, "school_change_area", changeFill);
  const pSchoolProj = pctMap(eligible, "proj_school_chg_5y");
  const pCagr = pctMap(eligible, "zhvi_cagr5");
  const pProjVal = pctMap(eligible, "proj_value_chg_5y");
  const pValue = pctMap(eligible, "home_value");

  const crimeEligible = eligible.filter((f) => {
    const p = f.properties;
    return typeof p.crime_violent === "number" && typeof p.crime_property === "number";
  });
  const crimeEntries = crimeEligible.map((f) => ({
    feature: f,
    value: f.properties.crime_property + 3 * f.properties.crime_violent,
  }));
  const pCrime = percentiles(crimeEntries);

  const W = persona.weights;
  const scored = eligible.map((f) => {
    const schools = 0.5 * pSchoolLevel.get(f)
      + 0.5 * ((pSchoolRecent.get(f) + pSchoolProj.get(f)) / 2);
    const pricePerf = (pCagr.get(f) + pProjVal.get(f)) / 2;
    const afford = 100 - pValue.get(f);
    let score = W.schools * schools + W.pricePerf * pricePerf + W.afford * afford;
    let wsum = W.schools + W.pricePerf + W.afford;
    let safety = null;
    if (pCrime.has(f)) {
      safety = 100 - pCrime.get(f);
      score += W.safety * safety;
      wsum += W.safety;
    }
    return { feature: f, score: score / wsum, schools, pricePerf, afford, safety };
  });
  // A NaN score would scramble Array.sort (NaN comparisons are unordered),
  // so drop any tract whose components failed to compute.
  const finite = scored.filter((r) => Number.isFinite(r.score));
  finite.sort((a, b) => b.score - a.score);
  return finite;
}

function renderPicks(ranked) {
  const el = document.getElementById("picks-list");
  if (!el) return;
  // Place leaders: the first (highest-scoring) tract per place, top 6 places.
  const seen = new Set();
  const leaders = [];
  for (const r of ranked) {
    const place = r.feature.properties.place ?? "Unknown area";
    if (seen.has(place)) continue;
    seen.add(place);
    leaders.push({ place, score: r.score });
    if (leaders.length >= 6) break;
  }
  // Any place with Zillow picks on file always shows, even when its best
  // tract ranks below the leaders (Redwood City is the current case).
  for (const place of Object.keys(ZILLOW_PICKS)) {
    if (seen.has(place)) continue;
    const best = ranked.find((r) => (r.feature.properties.place ?? "") === place);
    if (best) {
      seen.add(place);
      leaders.push({ place, score: best.score });
    }
  }
  el.innerHTML = leaders.map(({ place, score }) => {
    const head =
      `<h3 class="pick-place">${place} <span class="pick-score">top tract score ${Math.round(score)}</span></h3>`;
    const picks = ZILLOW_PICKS[place];
    if (!picks || !picks.length) {
      return head + `<p class="pick-none">No Zillow picks on file for this area yet.</p>`;
    }
    return head + picks.map((p) => {
      const spec = [p.beds ? `${p.beds} bd` : null, p.baths ? `${p.baths} ba` : null]
        .filter(Boolean).join(" · ");
      return `<div class="pick-row">` +
        `<span class="pick-addr">${p.address}</span>` +
        `<span class="pick-price">${FORMATTERS.usd(p.price)}</span>` +
        (spec ? `<span class="pick-meta">${spec}</span>` : "") +
        `<span class="pick-note">${p.note}</span>` +
        `<span class="pick-src">${p.source}</span></div>`;
    }).join("");
  }).join("");
}

export function buildRankings({ features, onSelect, limit = 12 }) {
  const listEl = document.getElementById("ranking-list");
  const selectEl = document.getElementById("persona-select");
  if (!listEl) return;
  const noteEl = document.getElementById("picks-note");
  if (noteEl) noteEl.textContent = PICKS_NOTE;

  function render(personaKey) {
    const ranked = rankTracts(features, personaKey);
    renderPicks(ranked);
    listEl.innerHTML = "";
    ranked.slice(0, limit).forEach((r, i) => {
      const p = r.feature.properties;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rank-row";
      const safetyBadge = r.safety === null
        ? '<span class="rank-badge">safety not scored</span>'
        : '<span class="rank-badge scored">safety scored</span>';
      btn.innerHTML =
        `<span class="rank-n">${i + 1}</span>` +
        `<span class="rank-main"><span class="rank-place">${p.place ?? "Unknown area"} <span class="rank-county">${p.county} County</span></span>` +
        `<span class="rank-stats">${FORMATTERS.usd(p.home_value)} · schools ${Math.round(p.school_prof_area)}% ` +
        `(${FORMATTERS.ppChange(p.proj_school_chg_5y)} proj.) · value ${FORMATTERS.pctChange(p.zhvi_cagr5)}/yr, ` +
        `${FORMATTERS.pctChange(p.proj_value_chg_5y)} proj. 5y</span></span>` +
        `<span class="rank-score">${Math.round(r.score)}</span>` +
        safetyBadge;
      btn.addEventListener("click", () => onSelect(r.feature, true));
      listEl.appendChild(btn);
    });
  }

  if (selectEl) {
    selectEl.addEventListener("change", () => render(selectEl.value));
  }
  render("young_family");
}
