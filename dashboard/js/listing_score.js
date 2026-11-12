// Listing-level scoring: a specific home is more than its tract.
//
// Two layers, blended 50/50 (Declan's call, 2026-11-08):
//   Area (50%): the score of the listing's OWN tract under the active
//     ranking profile - the neighbourhood engine acting as a prior.
//     A listing whose tract is outside the profile's gates, or whose
//     address could not be tract-matched, has no area score: the home
//     score is then the listing layer alone, and the row is badged.
//   Listing (50%): what can be measured about this specific home -
//     value for money vs the tract's Zillow typical value, fit to the
//     profile (type, beds, size, lot), and freshness (days on market,
//     with a bonus for a recorded price cut). Inside the layer the
//     weights are value 50 / fit 30 / freshness 20; a component that
//     cannot be measured (land has no ZHVI comparison) drops out and
//     the rest re-spread, the same rule the tract engine uses.
//
// What is deliberately NOT scored: interior condition, photos, HOA,
// taxes, exact school attendance boundaries. The data does not carry
// them, so the score does not pretend to.

export function zpidOf(pick) {
  return pick.url?.match(/(\d+)_zpid/)?.[1] ?? null;
}

export function parseLotAcres(lot) {
  if (!lot) return null;
  const m = String(lot).replace(/,/g, "").match(/([\d.]+)\s*-?\s*acres?/i);
  if (m) return parseFloat(m[1]);
  const s = String(lot).replace(/,/g, "").match(/([\d.]+)\s*sqft/i);
  if (s) return parseFloat(s[1]) / 43560;
  return null;
}

export function parsePriceCut(note) {
  if (!note) return 0;
  const m = String(note).match(/cut (?:from )?\$([\d,]+)/i);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}

// Piecewise-linear value score from price / tract typical value.
const VALUE_ANCHORS = [
  [0.80, 100], [0.90, 85], [1.00, 65], [1.10, 45], [1.20, 25], [1.35, 0],
];
function valueScore(pick, tractProps) {
  if (pick.type === "Land") return null; // no ZHVI comparison for a lot
  const typical = tractProps?.home_value;
  if (typeof typical !== "number" || typical <= 0 || typeof pick.price !== "number") return null;
  const ratio = pick.price / typical;
  if (ratio <= VALUE_ANCHORS[0][0]) return 100;
  for (let i = 1; i < VALUE_ANCHORS.length; i++) {
    const [x1, y1] = VALUE_ANCHORS[i];
    const [x0, y0] = VALUE_ANCHORS[i - 1];
    if (ratio <= x1) return y0 + ((ratio - x0) / (x1 - x0)) * (y1 - y0);
  }
  return 0;
}

const TYPE_SCORES = {
  young_family: { House: 100, Townhouse: 70, Condo: 45, Land: 30 },
  first_time: { House: 100, Townhouse: 85, Condo: 70, Land: 15 },
  retirees: { House: 100, Townhouse: 80, Condo: 75, Land: 10 },
  investor: { House: 90, Townhouse: 100, Condo: 100, Land: 40 },
};
function bedScore(beds, profileKey) {
  if (typeof beds !== "number") return 40; // unknown (land, undisclosed)
  if (profileKey === "retirees") return beds >= 5 ? 60 : beds === 4 ? 80 : beds === 3 ? 100 : beds === 2 ? 90 : 60;
  if (profileKey === "investor") return beds >= 4 ? 100 : beds === 3 ? 90 : beds === 2 ? 70 : 50;
  return beds >= 4 ? 100 : beds === 3 ? 85 : beds === 2 ? 50 : 25; // young family / first-time
}
function sizeScore(sqft) {
  if (typeof sqft !== "number") return 50;
  return sqft >= 2000 ? 100 : sqft >= 1600 ? 85 : sqft >= 1300 ? 70 : sqft >= 1100 ? 55 : sqft >= 900 ? 40 : 25;
}
function lotScore(acres) {
  if (typeof acres !== "number") return 45;
  return acres >= 0.25 ? 100 : acres >= 0.15 ? 80 : acres >= 0.10 ? 65 : acres >= 0.05 ? 45 : 30;
}
function fitScore(pick, profileKey) {
  const type = TYPE_SCORES[profileKey]?.[pick.type] ?? 50;
  const beds = bedScore(pick.beds, profileKey);
  const size = sizeScore(pick.sqft);
  if (profileKey === "young_family") {
    return 0.35 * type + 0.30 * beds + 0.15 * size + 0.20 * lotScore(parseLotAcres(pick.lot));
  }
  if (profileKey === "first_time") return 0.40 * type + 0.30 * beds + 0.30 * size;
  if (profileKey === "retirees") return 0.50 * type + 0.30 * beds + 0.20 * size;
  return 0.60 * type + 0.40 * beds; // investor
}

const FRESH_ANCHORS = [
  [0, 100], [2, 100], [5, 90], [10, 80], [20, 65], [35, 50], [60, 35], [100, 22], [150, 12],
];
function freshScore(pick) {
  let base = 50; // days unknown
  if (typeof pick.days === "number") {
    const d = pick.days;
    if (d >= FRESH_ANCHORS[FRESH_ANCHORS.length - 1][0]) {
      base = FRESH_ANCHORS[FRESH_ANCHORS.length - 1][1];
    } else {
      for (let i = 1; i < FRESH_ANCHORS.length; i++) {
        const [x1, y1] = FRESH_ANCHORS[i];
        const [x0, y0] = FRESH_ANCHORS[i - 1];
        if (d <= x1) { base = y0 + ((d - x0) / (x1 - x0)) * (y1 - y0); break; }
      }
    }
  }
  const cut = parsePriceCut(pick.note);
  if (cut > 0 && typeof pick.price === "number") {
    const share = cut / (pick.price + cut);
    base += share >= 0.05 ? 12 : share >= 0.02 ? 8 : 5;
  }
  return Math.min(100, base);
}

// Score one listing. tractEntry: the ranked entry for the listing's own
// tract under the active profile, or null. tractProps: the tract's
// GeoJSON properties (for the ZHVI typical value), or null.
export function scoreListing(pick, tractEntry, tractProps, profileKey = "young_family") {
  const area = tractEntry ? tractEntry.score : null;
  const value = valueScore(pick, tractProps);
  const fit = fitScore(pick, profileKey);
  const fresh = freshScore(pick);
  const comps = [
    { id: "value", w: 0.5, v: value },
    { id: "fit", w: 0.3, v: fit },
    { id: "fresh", w: 0.2, v: fresh },
  ].filter((c) => c.v !== null && Number.isFinite(c.v));
  const wsum = comps.reduce((s, c) => s + c.w, 0);
  const layer = comps.reduce((s, c) => s + c.w * c.v, 0) / wsum;
  const home = area !== null ? 0.5 * area + 0.5 * layer : layer;
  return {
    home, area, layer,
    value: comps.find((c) => c.id === "value")?.v ?? null,
    fit, fresh,
    priceRatio: tractProps && typeof tractProps.home_value === "number" && tractProps.home_value > 0
      ? pick.price / tractProps.home_value : null,
    cut: parsePriceCut(pick.note),
    acres: parseLotAcres(pick.lot),
  };
}
