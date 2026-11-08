// Rankings: one standardized scoring engine for every searcher profile.
//
// Every profile - the named demographics now, Custom later - is just a
// set of answers to the same questions:
//   Gates:     minimum population, and the median-home-value band the
//              searcher can reach.
//   Weights:   how much each measurable dimension matters (0 = ignore).
//   Required:  dimensions a tract must be scorable on to be ranked at
//              all (the ones the searcher will not compromise on).
// Dimensions are scored as 0-100 percentiles among the gated tracts, in
// the direction the searcher wants (e.g. Safety inverts crime, Quiet
// inverts noise). A tract that cannot be scored on a weighted dimension
// (no crime feed is the common case) has the remaining weights
// re-spread, the gap is badged, and the breakdown names it - nothing is
// silently assumed. A tract is ranked only if its scored dimensions
// cover at least 70% of the profile's total weight.
//
// Profile defaults (weights sum to 100 within each profile):
//   Young family: schools and safety dominate; affordability and price
//   performance next; families nearby, walkability, quiet, clean air and
//   a younger age profile count a little. The $500k-$1.35M band is the
//   original "young family with $500k saved" framing.
//   Retirees: safety, quiet, low disaster risk, walkability, clean air
//   and water; schools and price momentum do not matter.
//   First-time buyer: affordability dominates, then price performance,
//   safety, walkability/transit; a wider, cheaper band.
//   Investor: price performance and gross rental yield dominate, then
//   population growth; yield = median rent x 12 / median home value.

import { FORMATTERS } from "./dimensions.js";
import { median } from "./data.js";
import { ZILLOW_PICKS, PLACE_ALIASES, PICKS_NOTE } from "./zillow_picks.js";

const usd = FORMATTERS.usd;

// --- Dimension registry -------------------------------------------------
// measure(p) returns the raw value for a tract, or null when it cannot be
// measured there. invert: a high percentile of the raw value is BAD, so
// the subscore flips it. compute(eligible) serves the two composite
// dimensions (schools, price performance) built from several percentiles.
const DIMS = {
  schools: {
    label: "Schools", short: "schools",
    compute(eligible) {
      const level = pctMap(eligible, "school_prof_area");
      const changeVals = eligible.map((f) => f.properties.school_change_area)
        .filter((v) => typeof v === "number");
      const fill = changeVals.length ? median(changeVals) : 0;
      const recent = pctMap(eligible, "school_change_area", fill);
      const proj = pctMap(eligible, "proj_school_chg_5y");
      const out = new Map();
      for (const f of eligible) {
        if (!level.has(f) || !proj.has(f)) continue;
        out.set(f, 0.5 * level.get(f) + 0.5 * ((recent.get(f) + proj.get(f)) / 2));
      }
      return out;
    },
    inputs: (p) => {
      const chg = typeof p.school_change_area === "number"
        ? `${FORMATTERS.ppChange(p.school_change_area)} 2019→2025`
        : "2019→2025 change n/a (ranked at the median)";
      return `${Math.round(p.school_prof_area)}% proficient (ZIP area) · ${chg} · ` +
        `${FORMATTERS.ppChange(p.proj_school_chg_5y)} projected 5y`;
    },
  },
  pricePerf: {
    label: "Price performance", short: "price perf.",
    compute(eligible) {
      const cagr = pctMap(eligible, "zhvi_cagr5");
      const proj = pctMap(eligible, "proj_value_chg_5y");
      const out = new Map();
      for (const f of eligible) {
        if (!cagr.has(f) || !proj.has(f)) continue;
        out.set(f, (cagr.get(f) + proj.get(f)) / 2);
      }
      return out;
    },
    inputs: (p) => `value growth ${FORMATTERS.pctChange(p.zhvi_cagr5)}/yr (Zillow 5y) · ` +
      `${FORMATTERS.pctChange(p.proj_value_chg_5y)} projected 5y`,
  },
  afford: {
    label: "Affordability", short: "affordability", invert: true,
    measure: (p) => p.home_value,
    inputs: (p) => `typical home value ${usd(p.home_value)} (Zillow ZHVI)`,
  },
  safety: {
    label: "Safety", short: "safety", invert: true,
    measure: (p) => (typeof p.crime_violent === "number" && typeof p.crime_property === "number")
      ? p.crime_property + 3 * p.crime_violent : null,
    inputs: (p) => `violent ${p.crime_violent}/1k/yr · property ${p.crime_property}/1k/yr`,
  },
  walk: {
    label: "Walkability", short: "walkability",
    measure: (p) => p.walk_index,
    inputs: (p) => `EPA walkability index ${p.walk_index} of 20`,
  },
  transit: {
    label: "Transit", short: "transit",
    measure: (p) => p.transit_freq,
    inputs: (p) => `${p.transit_freq} services/hr at PM peak (EPA)`,
  },
  quiet: {
    label: "Quiet (low traffic noise)", short: "quiet", invert: true,
    measure: (p) => p.noise_share55,
    inputs: (p) => `${Math.round(p.noise_share55 * 100)}% of the tract's area is ≥55 dBA (transport noise, BTS 2020)`,
  },
  air: {
    label: "Air quality", short: "air quality", invert: true,
    measure: (p) => p.air_pollution,
    inputs: (p) => `PM2.5 ${p.pm25} µg/m³ · air composite ${Math.round(p.air_pollution)}th statewide percentile (lower is cleaner)`,
  },
  water: {
    label: "Water quality", short: "water quality", invert: true,
    measure: (p) => p.water_pctile,
    inputs: (p) => `drinking-water ${Math.round(p.water_pctile)}th statewide percentile (lower is cleaner)`,
  },
  disaster: {
    label: "Disaster safety", short: "disaster safety", invert: true,
    measure: (p) => p.risk_score,
    inputs: (p) => `FEMA overall risk score ${p.risk_score} of 100 (lower is safer)`,
  },
  families: {
    label: "Families nearby", short: "families nearby",
    measure: (p) => p.hh_kids_share,
    inputs: (p) => `${Math.round(p.hh_kids_share * 100)}% of households have children under 18 (ACS B11005)`,
  },
  younger: {
    label: "Younger area", short: "younger area", invert: true,
    measure: (p) => p.median_age,
    inputs: (p) => `median age ${p.median_age}`,
  },
  peers: {
    label: "Older peers", short: "older peers",
    measure: (p) => p.median_age,
    inputs: (p) => `median age ${p.median_age}`,
  },
  education: {
    label: "Education", short: "education",
    measure: (p) => p.bach_share,
    inputs: (p) => `${Math.round(p.bach_share * 100)}% hold a bachelor's degree or higher`,
  },
  growth: {
    label: "Population growth", short: "pop. growth",
    measure: (p) => p.pop_growth,
    inputs: (p) => `population ${FORMATTERS.pctChange(p.pop_growth)} from the 2020 Census to ACS 2023`,
  },
  yield_: {
    label: "Rental yield", short: "rental yield",
    measure: (p) => (typeof p.rent === "number" && typeof p.home_value === "number" && p.home_value > 0)
      ? (p.rent * 12) / p.home_value : null,
    inputs: (p) => `median rent ${usd(p.rent)}/mo → ${(((p.rent * 12) / p.home_value) * 100).toFixed(1)}% gross yield`,
  },
  lowHeat: {
    label: "Low heat", short: "low heat", invert: true,
    measure: (p) => p.temp_heat_days,
    inputs: (p) => `${p.temp_heat_days} days/yr reach 90°F+ (2016-2025 average)`,
  },
};

// --- Profiles -------------------------------------------------------------
export const PROFILES = {
  young_family: {
    label: "Young family",
    blurb: "Young family with $500k saved. Schools and safety lead; " +
      "affordability and price performance next; families nearby, " +
      "walkability, quiet streets, clean air and a younger age mix count " +
      "for a little. Schools and price performance are required.",
    gates: { minPop: 500, minValue: 500_000, maxValue: 1_350_000 },
    require: ["schools", "pricePerf"],
    weights: { schools: 30, safety: 18, afford: 14, pricePerf: 12, families: 8, walk: 6, quiet: 5, air: 4, younger: 3 },
  },
  retirees: {
    label: "Retirees",
    blurb: "Retirees: safety, quiet, low disaster risk and walkability " +
      "lead, with clean air and water and older peers counting too. " +
      "Schools and price momentum do not matter here.",
    gates: { minPop: 500, minValue: 350_000, maxValue: 1_250_000 },
    require: [],
    weights: { safety: 18, quiet: 14, disaster: 12, walk: 12, afford: 10, air: 8, water: 8, transit: 6, peers: 6, lowHeat: 6 },
  },
  first_time: {
    label: "First-time buyer",
    blurb: "First-time buyer: affordability dominates a cheaper band, " +
      "then price performance, safety, walkability and transit.",
    gates: { minPop: 500, minValue: 400_000, maxValue: 1_000_000 },
    require: ["pricePerf"],
    weights: { afford: 30, pricePerf: 16, safety: 12, walk: 10, transit: 8, schools: 8, quiet: 4, air: 4, families: 4, growth: 4 },
  },
  investor: {
    label: "Investor",
    blurb: "Investor: price performance and gross rental yield " +
      "(median rent x 12 / median value) dominate, then population " +
      "growth and affordability. Yield and price performance are required.",
    gates: { minPop: 500, minValue: 450_000, maxValue: 1_350_000 },
    require: ["pricePerf", "yield_"],
    weights: { pricePerf: 26, yield_: 22, growth: 14, afford: 10, transit: 8, walk: 8, schools: 6, safety: 6 },
  },
};
// Backwards-compatible name for the persona registry.
export const PERSONAS = PROFILES;

const MIN_COVERAGE = 0.7;

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

function dimScores(dim, eligible) {
  if (dim.compute) return dim.compute(eligible);
  const entries = [];
  for (const f of eligible) {
    const v = dim.measure(f.properties);
    if (typeof v === "number" && Number.isFinite(v)) entries.push({ feature: f, value: v });
  }
  const pcts = percentiles(entries);
  if (!dim.invert) return pcts;
  const out = new Map();
  for (const [f, v] of pcts) out.set(f, 100 - v);
  return out;
}

export function rankTracts(features, profileKey = "young_family") {
  const profile = PROFILES[profileKey];
  const g = profile.gates;
  const eligible = features.filter((f) => {
    const p = f.properties;
    return (p.pop ?? 0) >= g.minPop
      && typeof p.home_value === "number"
      && p.home_value >= g.minValue && p.home_value <= g.maxValue;
  });

  const active = Object.entries(profile.weights).filter(([, w]) => w > 0);
  const totalWeight = active.reduce((s, [, w]) => s + w, 0);
  const scoreMaps = new Map(active.map(([id]) => [id, dimScores(DIMS[id], eligible)]));

  const scored = [];
  for (const f of eligible) {
    const comps = {};
    let num = 0, scoredWeight = 0, ok = true;
    for (const [id, w] of active) {
      const m = scoreMaps.get(id);
      const v = m.has(f) ? m.get(f) : null;
      comps[id] = v;
      if (v === null) {
        if (profile.require.includes(id)) ok = false;
      } else {
        num += w * v;
        scoredWeight += w;
      }
    }
    if (!ok || scoredWeight / totalWeight < MIN_COVERAGE) continue;
    scored.push({ feature: f, score: num / scoredWeight, comps, scoredWeight, totalWeight });
  }
  // A NaN score would scramble Array.sort (NaN comparisons are unordered).
  const finite = scored.filter((r) => Number.isFinite(r.score));
  finite.sort((a, b) => b.score - a.score);
  return finite;
}

const TYPE_LABELS = {
  House: "single-family", Townhouse: "townhouse", Condo: "condo", Land: "land/lot",
};

function unscoredIds(r, profile) {
  return Object.keys(profile.weights).filter((id) => r.comps[id] === null || r.comps[id] === undefined);
}

// Expandable breakdown of a place's top-tract score under the active
// profile: every weighted dimension's 0-100 subscore (a percentile among
// the ranked tracts), its effective weight after any re-spreading, and
// the points it contributes - the points sum to the overall score.
// Dimensions that cannot be measured for the tract are named, never
// silently dropped.
function breakdownHtml(r, rankedCount, profile) {
  const p = r.feature.properties;
  const active = Object.entries(profile.weights)
    .filter(([, w]) => w > 0)
    .sort((a, b) => b[1] - a[1]);
  const missing = unscoredIds(r, profile);
  const rows = active
    .filter(([id]) => r.comps[id] !== null && r.comps[id] !== undefined)
    .map(([id, w]) => {
      const comp = r.comps[id];
      const eff = w / r.scoredWeight;
      return `<tr><td>${DIMS[id].label}<span class="bd-inputs">${DIMS[id].inputs(p)}</span></td>` +
        `<td class="bd-num">${Math.round(comp)}</td>` +
        `<td class="bd-num">${Math.round(eff * 100)}%</td>` +
        `<td class="bd-num">${(comp * eff).toFixed(1)}</td></tr>`;
    }).join("");
  const missingNote = missing.length
    ? `<p class="bd-note">Not scored for this tract: ${missing.map((id) => DIMS[id].label).join(", ")} ` +
      `(${missing.includes("safety") ? "no geocoded crime feed covers it; " : ""}the data does not ` +
      `measure it there), so the other weights are scaled up to 100%.</p>`
    : "";
  return `<details class="pick-breakdown"><summary>Score breakdown</summary>` +
    `<p class="bd-tract">For ${p.place ?? "Unknown area"}'s top tract (${p.county} ` +
    `County · tract ${p.tract}) · ${profile.label} score ${Math.round(r.score)} of 100</p>` +
    `<table class="bd-table"><thead><tr><th>Dimension</th><th>Score</th>` +
    `<th>Weight</th><th>Points</th></tr></thead><tbody>${rows}</tbody></table>` +
    missingNote +
    `<p class="bd-note">Dimension scores are 0-100 percentiles among the ` +
    `${rankedCount.toLocaleString("en-US")} ranked tracts. Points = score × weight, ` +
    `and the points add up to the overall score (rounding aside).</p></details>`;
}

function renderPicks(ranked, profile, type = "all") {
  const el = document.getElementById("picks-list");
  if (!el) return;
  // Place leaders: the first (highest-scoring) tract per place, top 6 places.
  const seen = new Set();
  const leaders = [];
  for (const r of ranked) {
    const place = r.feature.properties.place ?? "Unknown area";
    if (seen.has(place)) continue;
    seen.add(place);
    leaders.push({ place, r });
    if (leaders.length >= 6) break;
  }
  // Any place with Zillow picks on file always shows, even when its best
  // tract ranks below the leaders.
  for (const place of Object.keys(ZILLOW_PICKS)) {
    if (seen.has(place)) continue;
    const best = ranked.find((r) => (r.feature.properties.place ?? "") === place);
    if (best) {
      seen.add(place);
      leaders.push({ place, r: best });
    }
  }
  el.innerHTML = leaders.map(({ place, r }) => {
    const city = PLACE_ALIASES[place] ?? place;
    const label = city !== place ? `${place} · ${city}` : place;
    const head =
      `<h3 class="pick-place">${label} <span class="pick-score">top tract score ${Math.round(r.score)}</span></h3>` +
      breakdownHtml(r, ranked.length, profile);
    const all = ZILLOW_PICKS[city];
    if (!all || !all.length) {
      return head + `<p class="pick-none">No Zillow picks on file for this area yet.</p>`;
    }
    const picks = type === "all" ? all : all.filter((p) => p.type === type);
    if (!picks.length) {
      return head +
        `<p class="pick-none">No ${TYPE_LABELS[type] ?? type} picks for this area in the current pull.</p>`;
    }
    return head + picks.map((p) => {
      const spec = [
        p.type,
        p.beds ? `${p.beds} bd` : null,
        p.baths ? `${p.baths} ba` : null,
        p.sqft ? `${p.sqft.toLocaleString("en-US")} sqft` : null,
        p.lot || null,
        p.days != null ? `${p.days} days on Zillow` : null,
      ].filter(Boolean).join(" · ");
      return `<div class="pick-row">` +
        `<a class="pick-addr" href="${p.url}" target="_blank" rel="noopener">${p.address} ↗</a>` +
        `<span class="pick-price">${usd(p.price)}</span>` +
        (spec ? `<span class="pick-meta">${spec}</span>` : "") +
        (p.note ? `<span class="pick-note">${p.note}</span>` : "") +
        `<span class="pick-src">Live on Zillow · checked Nov 7</span></div>`;
    }).join("");
  }).join("");
}

export function buildRankings({ features, onSelect, limit = 12 }) {
  const listEl = document.getElementById("ranking-list");
  const selectEl = document.getElementById("persona-select");
  if (!listEl) return;
  const noteEl = document.getElementById("picks-note");
  if (noteEl) noteEl.textContent = PICKS_NOTE;
  const profileNoteEl = document.getElementById("profile-note");

  let currentType = "all";
  let currentRanked = [];
  let currentProfile = PROFILES.young_family;
  const typeEl = document.getElementById("ptype-select");
  if (typeEl) {
    typeEl.addEventListener("change", () => {
      currentType = typeEl.value;
      renderPicks(currentRanked, currentProfile, currentType);
    });
  }

  function render(profileKey) {
    const profile = PROFILES[profileKey] ?? PROFILES.young_family;
    currentProfile = profile;
    const ranked = rankTracts(features, profileKey);
    currentRanked = ranked;
    renderPicks(ranked, profile, currentType);
    if (profileNoteEl) {
      const g = profile.gates;
      profileNoteEl.textContent =
        `${profile.blurb} Tracts are gated to ${usd(g.minValue)}-${usd(g.maxValue)} ` +
        `typical value (Zillow ZHVI) and population ${g.minPop}+; ${ranked.length.toLocaleString("en-US")} ` +
        `tracts ranked. Dimensions a tract cannot be scored on re-weight and are ` +
        `badged. Click a row to inspect that tract on the map.`;
    }
    listEl.innerHTML = "";
    ranked.slice(0, limit).forEach((r, i) => {
      const p = r.feature.properties;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rank-row";
      const missing = unscoredIds(r, profile);
      const badge = missing.length
        ? `<span class="rank-badge">not scored: ${missing.map((id) => DIMS[id].short).join(", ")}</span>`
        : '<span class="rank-badge scored">all dimensions scored</span>';
      const topDims = Object.entries(profile.weights)
        .filter(([, w]) => w > 0)
        .sort((a, b) => b[1] - a[1])
        .filter(([id]) => r.comps[id] !== null && r.comps[id] !== undefined)
        .slice(0, 3)
        .map(([id]) => `${DIMS[id].short} ${Math.round(r.comps[id])}`)
        .join(" · ");
      btn.innerHTML =
        `<span class="rank-n">${i + 1}</span>` +
        `<span class="rank-main"><span class="rank-place">${p.place ?? "Unknown area"} <span class="rank-county">${p.county} County</span></span>` +
        `<span class="rank-stats">${usd(p.home_value)} · ${topDims}</span></span>` +
        `<span class="rank-score">${Math.round(r.score)}</span>` +
        badge;
      btn.addEventListener("click", () => onSelect(r.feature, true));
      listEl.appendChild(btn);
    });
  }

  if (selectEl) {
    selectEl.addEventListener("change", () => render(selectEl.value));
    render(selectEl.value in PROFILES ? selectEl.value : "young_family");
  } else {
    render("young_family");
  }
}
