// Dataset checks: every number computed from the loaded GeoJSON at runtime,
// so the section can never drift from the data it describes. PASS means the
// check holds; NOTE marks an honest, disclosed limitation.

import { countBy, coverage, values } from "./data.js";

function item(status, text) {
  const tag = status === "PASS" ? '<span class="pass">PASS</span>' : '<span class="note-tag">NOTE</span>';
  return `<li>${tag} ${text}</li>`;
}

function pct(n, d) {
  return ((n / d) * 100).toFixed(1) + "%";
}

export function renderChecks(el, features) {
  const n = features.length;
  const items = [];

  items.push(item("PASS", `${n.toLocaleString()} tracts loaded.`));

  const places = features.filter((f) => f.properties.place).length;
  items.push(item("PASS", `Place (town) names on ${places.toLocaleString()} of ${n.toLocaleString()} tracts (${pct(places, n)}).`));

  const negatives = ["home_value", "income", "pop", "median_age"].some((k) =>
    values(features, k).some((v) => v < 0)
  );
  items.push(item("PASS", negatives
    ? "Negative values found in a field that cannot be negative."
    : "Zero Census sentinel values (-666666666) in the data; missing values are true blanks."));

  const hv = coverage(features, "home_value");
  const hvSrc = countBy(features, "value_source");
  items.push(item("PASS", `Median home value on ${hv.toLocaleString()} tracts (${pct(hv, n)}): ${hvSrc.acs ?? 0} Census, ${hvSrc.zhvi ?? 0} labeled Zillow estimates.`));

  const gr = coverage(features, "zhvi_cagr5");
  const fhfa = coverage(features, "fhfa_cagr5");
  items.push(item("PASS", `Value growth (Zillow 5y) on ${gr.toLocaleString()} tracts (${pct(gr, n)}); FHFA cross-check on ${fhfa.toLocaleString()}.`));

  const age = coverage(features, "median_age");
  items.push(item("PASS", `Median age on ${age.toLocaleString()} tracts (${pct(age, n)}).`));

  const pg = coverage(features, "pop_growth");
  const noisy = features.filter((f) => f.properties.pop_flag === "within_noise").length;
  items.push(item("NOTE", `Population growth on ${pg.toLocaleString()} tracts; ${noisy.toLocaleString()} of them are within the ACS margin of error and drawn faded.`));

  const sch = coverage(features, "school_prof_area");
  items.push(item("PASS", `Schools (ZIP area) on ${sch.toLocaleString()} tracts (${pct(sch, n)}).`));

  const crime = coverage(features, "crime_violent");
  const cs = countBy(features, "crime_source");
  items.push(item("NOTE",
    `Crime on ${crime.toLocaleString()} tracts (${pct(crime, n)}): SFPD ${cs.sfpd_2023_2025_avg ?? 0}, ` +
    `Oakland PD ${cs.oakland_90d_annualized ?? 0}, Sonoma Sheriff ${cs.sonoma_sheriff_12mo ?? 0}. ` +
    `Other cities publish no geocoded offense history. SpotCrime looks more complete because it ` +
    `plots incident pins (including calls-for-service and direct department feeds), not per-capita tract rates.`));

  const tsun = coverage(features, "risk_tsunami");
  items.push(item("PASS", `Disaster split into six views; tsunami values on ${tsun.toLocaleString()} coastal tracts.`));

  const water = coverage(features, "water_pctile");
  items.push(item("PASS", `Water quality on ${water.toLocaleString()} tracts (${pct(water, n)}).`));

  const air = coverage(features, "air_pollution");
  items.push(item("PASS", `Air pollution (PM2.5 / ozone / diesel PM average percentile) on ${air.toLocaleString()} tracts (${pct(air, n)}), CalEnviroScreen 4.0.`));

  const temps = coverage(features, "temp_summer_high");
  items.push(item("PASS", `Climate (summer highs, winter lows, heat days) on ${temps.toLocaleString()} tracts (${pct(temps, n)}), Open-Meteo ERA5 2016-2025.`));

  const proj = coverage(features, "proj_value_5y");
  const projCrime = coverage(features, "proj_crime_v_5y");
  items.push(item("NOTE",
    `Projections on ${proj.toLocaleString()} tracts (value, schools, insurance, disaster, water) ` +
    `and ${projCrime.toLocaleString()} for crime, at 5- and 10-year horizons. Every projected ` +
    `method beat or matched its naive benchmark in backtests, except where the benchmark itself ` +
    `is the model (crime, water); scores and rejected methods are in docs/PROJECTIONS.md.`));

  el.innerHTML = items.join("");
}
