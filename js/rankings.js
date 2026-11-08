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
import { PICK_TRACTS } from "./pick_tracts.js";
import { scoreListing, zpidOf } from "./listing_score.js";

const usd = FORMATTERS.usd;

// --- Dimension registry -------------------------------------------------
// measure(p) returns the raw value for a tract, or null when it cannot be
// measured there. invert: a high percentile of the raw value is BAD, so
// the subscore flips it. compute(eligible) serves the two composite
// dimensions (schools, price performance) built from several percentiles.
const DIMS = {
  schools: {
    label: "Schools", short: "schools",
    // Scorer factory: percentiles are looked up in the gated tracts'
    // distributions, so any tract (gated or not) can be scored on the
    // same scale. For gated tracts this reproduces the percentile map
    // exactly (average-rank formula both ways).
    scorer(eligible) {
      const level = sortedValues(eligible, "school_prof_area");
      const changeVals = eligible.map((f) => f.properties.school_change_area)
        .filter((v) => typeof v === "number");
      const fill = changeVals.length ? median(changeVals) : 0;
      const recent = sortedValues(eligible, "school_change_area");
      const proj = sortedValues(eligible, "proj_school_chg_5y");
      return (f) => {
        const p = f.properties;
        if (typeof p.school_prof_area !== "number" || typeof p.proj_school_chg_5y !== "number") return null;
        const lv = pctLookup(level, p.school_prof_area);
        const rc = pctLookup(recent, typeof p.school_change_area === "number" ? p.school_change_area : fill);
        const pj = pctLookup(proj, p.proj_school_chg_5y);
        return 0.5 * lv + 0.5 * ((rc + pj) / 2);
      };
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
    scorer(eligible) {
      const cagr = sortedValues(eligible, "zhvi_cagr5");
      const proj = sortedValues(eligible, "proj_value_chg_5y");
      return (f) => {
        const p = f.properties;
        if (typeof p.zhvi_cagr5 !== "number" || typeof p.proj_value_chg_5y !== "number") return null;
        return (pctLookup(cagr, p.zhvi_cagr5) + pctLookup(proj, p.proj_value_chg_5y)) / 2;
      };
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

function sortedValues(features, key) {
  return features.map((f) => f.properties[key])
    .filter((v) => typeof v === "number" && Number.isFinite(v))
    .sort((a, b) => a - b);
}

// Average-rank percentile of v within a sorted distribution: for a
// member of the distribution this equals percentiles() exactly, and it
// also scores values from outside the distribution (clamped to the
// ends), which is what lets a listing's tract be area-scored even when
// the tract itself sits outside the profile's gates.
function pctLookup(sorted, v) {
  const n = sorted.length;
  if (!n) return null;
  let lo = 0, hi = n;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (sorted[mid] < v) lo = mid + 1; else hi = mid; }
  const less = lo;
  hi = n;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (sorted[mid] <= v) lo = mid + 1; else hi = mid; }
  const equal = lo - less;
  return ((less + (equal + 1) / 2) / n) * 100;
}

function dimScorer(dim, eligible) {
  if (dim.scorer) return dim.scorer(eligible);
  const sorted = eligible.map((f) => dim.measure(f.properties))
    .filter((v) => typeof v === "number" && Number.isFinite(v))
    .sort((a, b) => a - b);
  return (f) => {
    const v = dim.measure(f.properties);
    if (typeof v !== "number" || !Number.isFinite(v)) return null;
    const pct = pctLookup(sorted, v);
    return dim.invert ? 100 - pct : pct;
  };
}

// Build the profile's scorer once: ranked (gated tracts, sorted) plus
// scoreTract, which scores ANY tract against the gated distributions -
// used for listings whose own tract is outside the gates (a $995k home
// in a $1.4M-typical tract is exactly what the daily picks should find;
// its affordability percentile is ~0, which pulls the area score down
// honestly instead of erasing it).
export function buildProfileScorer(features, profileKey = "young_family") {
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
  const scorers = new Map(active.map(([id]) => [id, dimScorer(DIMS[id], eligible)]));

  function scoreTract(f) {
    const comps = {};
    let num = 0, scoredWeight = 0, ok = true;
    for (const [id, w] of active) {
      const v = scorers.get(id)(f);
      comps[id] = v;
      if (v === null || v === undefined) {
        if (profile.require.includes(id)) ok = false;
      } else {
        num += w * v;
        scoredWeight += w;
      }
    }
    if (!ok || scoredWeight / totalWeight < MIN_COVERAGE || !Number.isFinite(num / scoredWeight)) return null;
    return { feature: f, score: num / scoredWeight, comps, scoredWeight, totalWeight };
  }

  const ranked = eligible.map(scoreTract).filter(Boolean);
  ranked.sort((a, b) => b.score - a.score);
  return { profile, ranked, scoreTract };
}

export function rankTracts(features, profileKey = "young_family") {
  return buildProfileScorer(features, profileKey).ranked;
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

// Per-listing breakdown: how this home's score was built - its own
// tract's area score, and the listing layer (value / fit / freshness).
function listingBreakdownHtml(p, s, profile) {
  const areaRow = s.area !== null
    ? `<tr><td>Area (its tract, ${profile.label}${s.areaInBand === false ? " · tract outside the ranked band, scored on the same percentiles" : ""})</td><td class="bd-num">${Math.round(s.area)}</td><td class="bd-num">50%</td><td class="bd-num">${(0.5 * s.area).toFixed(1)}</td></tr>`
    : "";
  const valueTxt = s.value === null
    ? "not scored (land has no typical-value comparison)"
    : `${Math.round(s.priceRatio * 100)}% of its tract's typical value ${usd(p.price / s.priceRatio)}`;
  const fitTxt = [p.type, p.beds ? `${p.beds} bd` : null, p.baths ? `${p.baths} ba` : null,
    p.sqft ? `${p.sqft.toLocaleString("en-US")} sqft` : null, p.lot || null].filter(Boolean).join(" · ");
  const freshTxt = (typeof p.days === "number" ? `${p.days} days on Zillow` : "days on market unknown") +
    (s.cut > 0 ? ` · price cut ${usd(s.cut)} recorded` : "");
  // Listing layer internally weights value 50 / fit 30 / freshness 20,
  // re-spread when value is unscored; the layer is half the home score
  // (or all of it when the area is unscored).
  const layerShare = s.area !== null ? 0.5 : 1;
  const wInLayer = s.value !== null
    ? { value: 0.5, fit: 0.3, fresh: 0.2 }
    : { value: 0, fit: 0.6, fresh: 0.4 };
  const rows = areaRow
    + (s.value !== null ? `<tr><td>Value for money<span class="bd-inputs">${valueTxt}</span></td><td class="bd-num">${Math.round(s.value)}</td><td class="bd-num">${Math.round(layerShare * wInLayer.value * 100)}%</td><td class="bd-num">${(layerShare * wInLayer.value * s.value).toFixed(1)}</td></tr>` : "")
    + `<tr><td>Fit for a ${profile.label.toLowerCase()}<span class="bd-inputs">${fitTxt}</span></td><td class="bd-num">${Math.round(s.fit)}</td><td class="bd-num">${Math.round(layerShare * wInLayer.fit * 100)}%</td><td class="bd-num">${(layerShare * wInLayer.fit * s.fit).toFixed(1)}</td></tr>`
    + `<tr><td>Freshness<span class="bd-inputs">${freshTxt}</span></td><td class="bd-num">${Math.round(s.fresh)}</td><td class="bd-num">${Math.round(layerShare * wInLayer.fresh * 100)}%</td><td class="bd-num">${(layerShare * wInLayer.fresh * s.fresh).toFixed(1)}</td></tr>`;
  const notes = [
    s.area === null
      ? `<p class="bd-note">No area score: this home's tract could not be scored under the ${profile.label} profile (its address could not be tract-matched, or a required dimension is unmeasured there), so the home score is the listing layer alone.</p>` : "",
    s.value === null
      ? `<p class="bd-note">Value for money is not scored for land (no typical-value comparison); fit and freshness re-spread inside the listing layer.</p>` : "",
    `<p class="bd-note">Home score = ${s.area !== null ? "50% area + 50% listing layer" : "listing layer only"}. The listing layer weights value 50%, fit 30%, freshness 20%. Interior condition, HOA and taxes are not scored - the data does not carry them.</p>`,
  ].join("");
  return `<details class="pick-breakdown"><summary>Home score breakdown</summary>` +
    `<table class="bd-table"><thead><tr><th>Component</th><th>Score</th>` +
    `<th>Weight</th><th>Points</th></tr></thead><tbody>${rows}</tbody></table>` + notes + `</details>`;
}

function renderPicks(scorer, profile, profileKey, featureByTract, type = "all") {
  const el = document.getElementById("picks-list");
  if (!el) return;
  const ranked = scorer.ranked;
  const rankedTracts = new Set(ranked.map((r) => r.feature.properties.tract));
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
    // Score every listing against its own tract, best home first.
    const scored = picks.map((p) => {
      const tract = PICK_TRACTS[zpidOf(p)] ?? null;
      const feature = tract ? featureByTract.get(tract) ?? null : null;
      const entry = feature ? scorer.scoreTract(feature) : null;
      const s = scoreListing(p, entry, feature?.properties ?? null, profileKey);
      s.areaInBand = tract ? rankedTracts.has(tract) : false;
      return { p, s };
    }).sort((a, b) => b.s.home - a.s.home);
    return head + scored.map(({ p, s }) => {
      const spec = [
        p.type,
        p.beds ? `${p.beds} bd` : null,
        p.baths ? `${p.baths} ba` : null,
        p.sqft ? `${p.sqft.toLocaleString("en-US")} sqft` : null,
        p.lot || null,
        p.days != null ? `${p.days} days on Zillow` : null,
      ].filter(Boolean).join(" · ");
      const badge = s.area === null ? ` <span class="rank-badge">area not scored</span>` : "";
      return `<div class="pick-row">` +
        `<a class="pick-addr" href="${p.url}" target="_blank" rel="noopener">${p.address} ↗</a>` +
        `<span class="pick-price">${usd(p.price)}</span>` +
        `<span class="pick-home">Home ${Math.round(s.home)}</span>${badge}` +
        (spec ? `<span class="pick-meta">${spec}</span>` : "") +
        (p.note ? `<span class="pick-note">${p.note}</span>` : "") +
        `<span class="pick-src">Live on Zillow · checked Nov 7</span>` +
        listingBreakdownHtml(p, s, profile) +
        `</div>`;
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

  const featureByTract = new Map(features.map((f) => [f.properties.tract, f]));
  let currentType = "all";
  let currentScorer = null;
  let currentProfile = PROFILES.young_family;
  let currentProfileKey = "young_family";
  const typeEl = document.getElementById("ptype-select");
  if (typeEl) {
    typeEl.addEventListener("change", () => {
      currentType = typeEl.value;
      if (currentScorer) renderPicks(currentScorer, currentProfile, currentProfileKey, featureByTract, currentType);
    });
  }

  function render(profileKey) {
    const profile = PROFILES[profileKey] ?? PROFILES.young_family;
    currentProfile = profile;
    currentProfileKey = profileKey;
    const scorer = buildProfileScorer(features, profileKey);
    currentScorer = scorer;
    const ranked = scorer.ranked;
    renderPicks(scorer, profile, profileKey, featureByTract, currentType);
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
