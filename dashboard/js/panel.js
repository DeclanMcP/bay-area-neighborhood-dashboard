// Tract detail panel: everything measured about the clicked tract,
// grouped, with provenance notes where the data needs them.

import { FORMATTERS } from "./dimensions.js";

const ROWS = [
  ["Population (ACS 2023)", "pop", "num0"],
  ["Population (2020 Census)", "pop_2020", "num0"],
  ["Population growth 2020→2023", "pop_growth", "pctChange"],
  ["Median age", "median_age", "years"],
  ["Median household income", "income", "usd"],
  ["Bachelor's degree or higher", "bach_share", "pctShare"],
  ["Households with children", "hh_kids_share", "pctShare"],
  ["Home value (Zillow ZHVI)", "home_value", "usd"],
  ["Median gross rent", "rent", "usd"],
  ["Walkability, EPA index (of 20)", "walk_index", "num1"],
  ["Transit frequency (services/hr, PM peak)", "transit_freq", "num1"],
  ["Distance to nearest transit stop (m)", "transit_dist", "num0"],
  ["Share of tract with transit service", "transit_served", "pctShare"],
  ["Jobs within 45 min by car", "jobs_auto", "num0"],
  ["Jobs within 45 min by transit", "jobs_transit", "num0"],
  ["Transport noise, average (dBA)", "noise_db", "num1"],
  ["Transport noise, area ≥55 dB", "noise_share55", "pctShare"],
  ["Transport noise, area ≥60 dB", "noise_share60", "pctShare"],
  ["Transport noise, 95th pctile (dBA)", "noise_p95", "num0"],
  ["Median home value (Census ACS)", "acs_value", "usd"],
  ["Value growth, Zillow 5y", "zhvi_cagr5", "pctChange"],
  ["Value growth, FHFA 5y (cross-check)", "fhfa_cagr5", "pctChange"],
  ["Owner-occupied share", "owner_share", "pctShare"],
  ["Owner-occupied units", "owner_units", "num0"],
  ["Schools, ZIP area proficiency", "school_prof_area", "pctPoints"],
  ["Schools, ZIP area change 2019→2025", "school_change_area", "num1"],
  ["Schools in tract, proficiency", "school_prof", "pctPoints"],
  ["Schools in tract, change 2019→2025", "school_change", "num1"],
  ["Violent crime /1k /yr", "crime_violent", "num1"],
  ["Property crime /1k /yr", "crime_property", "num1"],
  ["Disaster risk, overall (national pctile)", "risk_score", "num0"],
  ["Earthquake (Bay Area pctile)", "risk_eq", "num0"],
  ["Wildfire (Bay Area pctile)", "risk_fire", "num0"],
  ["Flood (Bay Area pctile)", "risk_flood", "num0"],
  ["Tsunami (Bay Area pctile)", "risk_tsunami", "num0"],
  ["Landslide (Bay Area pctile)", "risk_landslide", "num0"],
  ["Expected annual loss / resident", "eal_per_capita", "usd"],
  ["Water quality (state pctile, higher=worse)", "water_pctile", "num0"],
  ["Air pollution (avg state pctile, higher=worse)", "air_pollution", "num0"],
  ["PM2.5 annual mean (µg/m³)", "pm25", "num1"],
  ["PM2.5 (state pctile)", "pm25_pctile", "num0"],
  ["Ozone, summer mean of daily max (ppb)", "ozone", "num0"],
  ["Diesel PM (µg/m³)", "diesel_pm", "num2"],
  ["FAIR Plan policies (2026)", "fair_policies", "num0"],
  ["FAIR Plan share of homes", "fair_share", "pctShare"],
  ["Summer high, Jun–Aug mean (°F)", "temp_summer_high", "degF"],
  ["Summer heat spike, 95th pctile (°F)", "temp_summer_p95", "degF"],
  ["Winter low, Dec–Feb mean (°F)", "temp_winter_low", "degF"],
  ["Winter cold snap, 5th pctile (°F)", "temp_winter_p05", "degF"],
  ["Heat days ≥ 90°F per year", "temp_heat_days", "num1"],
  ["Frost nights ≤ 32°F per year", "temp_frost_nights", "num1"],
  ["Annual mean temperature (°F)", "temp_annual_mean", "degF"],
];

const PROJ_ROWS = [
  ["Projected home value 2031", "proj_value_5y", "usd", "proj_value_chg_5y", "pctChange"],
  ["Projected home value 2036", "proj_value_10y", "usd", "proj_value_chg_10y", "pctChange"],
  ["Projected proficiency 2031", "proj_school_5y", "pctPoints", "proj_school_chg_5y", "ppChange"],
  ["Projected proficiency 2036", "proj_school_10y", "pctPoints", "proj_school_chg_10y", "ppChange"],
  ["Projected FAIR share 2031", "proj_fair_5y", "pctShare", "proj_fair_chg_5y", "sharePointChange"],
  ["Projected FAIR share 2036", "proj_fair_10y", "pctShare", "proj_fair_chg_10y", "sharePointChange"],
  ["Insurance pressure index (scenario)", "proj_pressure", "num0", null, null],
  ["Projected disaster loss 2031", "proj_eal_5y", "usd", "proj_eal_chg_5y", "pctChange"],
  ["Projected disaster loss 2036", "proj_eal_10y", "usd", "proj_eal_chg_10y", "pctChange"],
];

const CRIME_SOURCE_TEXT = {
  sfpd_2023_2025_avg: "Crime source: SFPD offense reports, 2023–2025 average.",
  oakland_90d_annualized:
    "Crime source: Oakland PD, latest 90 days annualized. Treat as an estimate; " +
    "the window is short and seasonal, and rates firm up as snapshots accumulate.",
  sonoma_sheriff_12mo:
    "Crime source: Sonoma County Sheriff incidents, latest 12 months. Sheriff " +
    "jurisdiction only (unincorporated county plus contract towns).",
};

function notes(p) {
  const out = [];
  if (p.value_flag === "acs_zhvi_diverge") {
    out.push({
      kind: "warn",
      text:
        `Value check: the two sources disagree by more than 2x for this tract. ` +
        `Zillow's typical value is ${FORMATTERS.usd(p.home_value)}; the Census ACS median is ` +
        `${FORMATTERS.usd(p.acs_value)}, but that median covers only its ` +
        `${FORMATTERS.num0(p.owner_units ?? 0)} owner-occupied units, so it reads far too low ` +
        `in condo and apartment tracts. The map and rankings use the Zillow figure.`,
    });
  } else if (p.value_source === "acs") {
    out.push({
      kind: "info",
      text: "Home value here falls back to the Census ACS median: Zillow " +
        "publishes no ZHVI typical value for this tract.",
    });
  }
  if (p.crime_source && CRIME_SOURCE_TEXT[p.crime_source]) {
    out.push({ kind: "info", text: CRIME_SOURCE_TEXT[p.crime_source] });
  }
  if (p.pop_flag === "within_noise") {
    out.push({
      kind: "info",
      text: "Population change is within the ACS margin of error: this tract's " +
        "growth or decline is not statistically distinguishable from flat.",
    });
  }
  return out;
}

export function renderPanel(el, feature, activeDim = null) {
  if (!feature) return;
  const p = feature.properties;
  const noteItems = notes(p);
  // In projected mode the panel LEADS with a spotlight: the projected level
  // for the active dimension and horizon, its change vs today, and the
  // backtest-calibrated range — not buried in the projections table below.
  let spotlightHtml = "";
  if (activeDim && activeDim.valueKey) {
    const fmt = FORMATTERS[activeDim.levelFormat ?? activeDim.format];
    const point = p[activeDim.valueKey];
    if (typeof point === "number") {
      const showYear = Boolean(activeDim.changeKey);
      const kicker = `${activeDim.valueLabel}${showYear ? " " + (2026 + (activeDim.horizon ?? 5)) : ""}`;
      let main = `<strong>${fmt(point)}</strong>`;
      const chg = activeDim.changeKey ? p[activeDim.changeKey] : null;
      if (typeof chg === "number" && activeDim.changeFormat) {
        main += `<span>${FORMATTERS[activeDim.changeFormat](chg)} vs today</span>`;
      }
      const lo = activeDim.loKey ? p[activeDim.loKey] : null;
      const hi = activeDim.hiKey ? p[activeDim.hiKey] : null;
      let range = "";
      if (typeof lo === "number" && typeof hi === "number") {
        range = `<small>Range ${fmt(lo)} to ${fmt(hi)} (interval calibrated to the method's backtest error)</small>`;
      }
      spotlightHtml =
        `<div class="spotlight panel-spotlight"><span class="spot-kicker">${kicker}</span>${main}${range}</div>`;
    }
  }
  const noteHtml = noteItems
    .map((n) => `<p class="note${n.kind === "info" ? " info" : ""}">${n.text}</p>`)
    .join("");
  const rowHtml = (list) => list.map(([label, key, fmt]) => {
    const v = p[key];
    const shown = v == null ? '<span style="color:#8a97a3">no data</span>' : FORMATTERS[fmt](v);
    return `<tr><td>${label}</td><td class="v">${shown}</td></tr>`;
  }).join("");
  const projRowHtml = PROJ_ROWS.map(([label, key, fmt, chgKey, chgFmt]) => {
    const v = p[key];
    if (v == null) {
      return `<tr><td>${label}</td><td class="v"><span style="color:#8a97a3">no data</span></td></tr>`;
    }
    let shown = FORMATTERS[fmt](v);
    const chg = chgKey ? p[chgKey] : null;
    if (typeof chg === "number") shown += ` (${FORMATTERS[chgFmt](chg)})`;
    return `<tr><td>${label}</td><td class="v">${shown}</td></tr>`;
  }).join("");
  el.innerHTML =
    `<h2>${p.place ?? "Unknown area"}</h2>` +
    `<p class="subtext">${p.county} County · Tract ${p.tract} · ZIP ${p.zip_main ?? "—"}</p>` +
    spotlightHtml +
    noteHtml +
    `<table>${rowHtml(ROWS)}</table>` +
    `<h3 class="panel-subhead">Projections (backtested, docs in repo)</h3>` +
    `<table>${projRowHtml}</table>`;
}
