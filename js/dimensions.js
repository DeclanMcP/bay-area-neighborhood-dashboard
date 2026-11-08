// Dimension registry: every map view is one entry here.
// Adding a dimension = one entry + the field present in tracts.geojson.
// `format` names a formatter in FORMATTERS. `scale` is "seq" (low->high)
// or "div" (diverging around 0). Palettes are 7-stop ColorBrewer-style ramps.

export const FORMATTERS = {
  usd: (v) => "$" + Math.round(v).toLocaleString("en-US"),
  usdCompact: (v) =>
    Math.abs(v) >= 1e6 ? "$" + (v / 1e6).toFixed(2) + "M" : "$" + Math.round(v / 1e3) + "k",
  pctChange: (v) => (v >= 0 ? "+" : "") + (v * 100).toFixed(1) + "%",
  pctPoints: (v) => Math.round(v) + "%",
  pctShare: (v) => (v * 100).toFixed(1) + "%",
  num0: (v) => Math.round(v).toLocaleString("en-US"),
  num1: (v) => v.toFixed(1),
  years: (v) => v.toFixed(1) + " yrs",
  degF: (v) => Math.round(v) + "°F",
  ppChange: (v) => (v >= 0 ? "+" : "") + v.toFixed(1) + " pts",
  sharePointChange: (v) => (v >= 0 ? "+" : "") + (v * 100).toFixed(1) + " pts",
};

const MONEY = ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"];
const TEAL = ["#f7fcfd", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac"];
const GREEN = ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"];
const REDS = ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"];
const YLORD = ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#b10026"];
const PURPLE = ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3"];
const DIVERGE = ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"];

export const DIMENSIONS = [
  // --- Housing & value -------------------------------------------------
  {
    key: "home_value", label: "Median Home Value", group: "Housing & value",
    format: "usd", legendFormat: "usdCompact", scale: "seq", palette: MONEY,
    about: "Median home value per tract. Census ACS 2023 where it exists; where ACS " +
      "publishes no median (tracts with almost no owner-occupied homes), the tract's " +
      "Zillow ZHVI value is used and labeled as a Zillow estimate in the panel. " +
      "Tracts outlined in amber disagree between ACS and Zillow by more than 2x; " +
      "click one to see both numbers.",
  },
  {
    key: "zhvi_cagr5", label: "Value Growth (Zillow 5y)", group: "Housing & value",
    format: "pctChange", scale: "div", palette: DIVERGE,
    about: "Five-year annual growth of Zillow's ZHVI typical value (ZIP level, mapped " +
      "to tracts by land share), the single consistent growth measure at 99%+ coverage. " +
      "The FHFA repeat-sales index covers only 42% of tracts and uses a different " +
      "window; it is kept in each tract panel as a cross-check, not blended in.",
  },
  {
    key: "zhvi", label: "Zillow Typical Value", group: "Housing & value",
    format: "usd", legendFormat: "usdCompact", scale: "seq", palette: MONEY,
    about: "Zillow ZHVI typical home value for the tract's ZIP area (Sep 2026), mapped " +
      "to tracts by land share. Smoothed, all-homes measure; complements the Census median.",
  },
  // --- People ----------------------------------------------------------
  {
    key: "income", label: "Household Income", group: "People",
    format: "usd", legendFormat: "usdCompact", scale: "seq", palette: TEAL,
    about: "Median household income, Census ACS 2023 5-year.",
  },
  {
    key: "median_age", label: "Median Age", group: "People",
    format: "years", scale: "seq", palette: PURPLE,
    about: "Median age of residents, Census ACS 2023 5-year (table B01002). Low values " +
      "cluster around universities; high values in retirement-heavy and rural tracts.",
  },
  {
    key: "pop_growth", label: "Population Growth", group: "People",
    format: "pctChange", scale: "div", palette: DIVERGE, muteFlag: "pop_flag",
    about: "Population change from the 2020 Census count to the Census ACS 2023 " +
      "estimate, same tract boundaries. Tracts drawn faded have a change smaller than " +
      "the ACS margin of error, so their growth or decline is not statistically " +
      "distinguishable from flat; the region overall is about -1.8% over the period. " +
      "Rates are suppressed where the 2020 population was under 500.",
  },
  // --- Schools ---------------------------------------------------------
  {
    key: "school_prof_area", label: "Schools (ZIP area)", group: "Schools",
    format: "pctPoints", scale: "seq", palette: GREEN,
    about: "Share of tested students meeting or exceeding standards (ELA + math, " +
      "CAASPP 2025) at schools in the tract's ZIP area, weighted by students tested. " +
      "Describes nearby schools, NOT school attendance assignments.",
  },
  {
    key: "school_prof", label: "Schools (in tract)", group: "Schools",
    format: "pctPoints", scale: "seq", palette: GREEN,
    about: "Same CAASPP 2025 proficiency measure, but only schools physically inside " +
      "the tract. Covers 58% of tracts; the ZIP-area view covers the rest.",
  },
  // --- Crime -----------------------------------------------------------
  {
    key: "crime_violent", label: "Violent Crime", group: "Crime",
    format: "num1", scale: "seq", palette: REDS, unit: "per 1k residents / yr",
    about: "Reported violent offenses per 1,000 residents per year, from three " +
      "geocoded feeds: SFPD (2023-2025 average), Oakland PD (latest 90 days, " +
      "annualized, an estimate), Sonoma County Sheriff (latest 12 months, sheriff " +
      "jurisdiction only). Each tract panel names its feed. Most Bay Area cities " +
      "publish no geocoded offense data and stay gray. Rates are suppressed where " +
      "residents number under 500.",
  },
  {
    key: "crime_property", label: "Property Crime", group: "Crime",
    format: "num1", scale: "seq", palette: REDS, unit: "per 1k residents / yr",
    about: "Reported property offenses per 1,000 residents per year. Same feeds, " +
      "windows, and suppression rule as Violent Crime.",
  },
  // --- Disaster risk (split by hazard, per the request) ----------------
  {
    key: "risk_score", label: "Disaster: Overall", group: "Disaster risk",
    format: "num0", scale: "seq", palette: YLORD,
    about: "FEMA National Risk Index overall score (national percentile). The Bay " +
      "Area median tract sits near the 88th national percentile, driven by earthquake.",
  },
  {
    key: "risk_eq", label: "Disaster: Earthquake", group: "Disaster risk",
    format: "num0", scale: "seq", palette: YLORD,
    about: "Earthquake risk, ranked as a percentile within the Bay Area (FEMA NRI hazard values).",
  },
  {
    key: "risk_fire", label: "Disaster: Wildfire", group: "Disaster risk",
    format: "num0", scale: "seq", palette: YLORD,
    about: "Wildfire risk, ranked as a percentile within the Bay Area (FEMA NRI hazard values).",
  },
  {
    key: "risk_flood", label: "Disaster: Flood", group: "Disaster risk",
    format: "num0", scale: "seq", palette: YLORD,
    about: "Riverine plus coastal flood risk combined, ranked as a percentile within the Bay Area (FEMA NRI).",
  },
  {
    key: "risk_tsunami", label: "Disaster: Tsunami", group: "Disaster risk",
    format: "num0", scale: "seq", palette: YLORD,
    about: "Tsunami risk, ranked as a percentile within the Bay Area (FEMA NRI). " +
      "Only 248 coastal tracts carry a value; inland tracts are not exposed and stay gray.",
  },
  {
    key: "risk_landslide", label: "Disaster: Landslide", group: "Disaster risk",
    format: "num0", scale: "seq", palette: YLORD,
    about: "Landslide risk, ranked as a percentile within the Bay Area (FEMA NRI hazard values).",
  },
  // --- Environment & insurance -----------------------------------------
  {
    key: "water_pctile", label: "Water Quality", group: "Environment & insurance",
    format: "num0", scale: "seq", palette: YLORD,
    about: "CalEnviroScreen 4.0 drinking-water contaminant index, statewide percentile. " +
      "Higher = worse water. Most Bay Area tracts score low; Napa's small upvalley " +
      "systems are the regional outlier.",
  },
  {
    key: "air_pollution", label: "Air Pollution", group: "Environment & insurance",
    format: "num0", scale: "seq", palette: YLORD,
    about: "Air pollution average: the mean of the three CalEnviroScreen 4.0 statewide " +
      "percentiles for PM2.5, ozone, and diesel particulate matter (monitoring window " +
      "2017-2019). Higher = worse air. The tract panel carries the actual annual-average " +
      "concentrations: PM2.5 runs 5.5-10.5 ug/m3 across the region (the federal annual " +
      "standard is 9), ozone peaks inland, and diesel PM concentrates near ports, " +
      "freeways, and dense traffic.",
  },
  {
    key: "fair_share", label: "FAIR Plan Share", group: "Environment & insurance",
    format: "pctShare", scale: "seq", palette: PURPLE,
    about: "CA FAIR Plan dwelling policies (2026) as a share of housing units, by ZIP " +
      "mapped to tracts. The FAIR Plan is the insurer of last resort; a rising share " +
      "signals private insurers pulling back. Bay Area policies grew 4.6x from 2022 to 2026.",
  },
  // --- Climate (seasonal extremes, not just the mean) -------------------
  {
    key: "temp_summer_high", label: "Summer Highs", group: "Climate",
    format: "degF", scale: "seq", palette: YLORD,
    about: "Mean daily high temperature, June to August, averaged over 2016-2025 " +
      "(Open-Meteo ERA5 reanalysis grid, interpolated to tracts). The Bay Area's " +
      "summer split is the story: fog-belt tracts average in the 60s while inland " +
      "valleys average near 90. Microclimates finer than the ~13 km grid are smoothed.",
  },
  {
    key: "temp_winter_low", label: "Winter Lows", group: "Climate",
    format: "degF", scale: "seq", palette: TEAL, reverse: true,
    about: "Mean daily low temperature, December to February, 2016-2025 average. " +
      "Colors run cold-dark to warm-pale: the darkest blue tracts are the COLDEST. " +
      "Coastal tracts stay in the upper 40s; inland valley floors drop to the " +
      "upper 30s with regular frost. Paired with Summer Highs, this is the region's " +
      "temperature variance, which an annual mean would hide.",
  },
  {
    key: "temp_heat_days", label: "Heat Days", group: "Climate",
    format: "num1", scale: "seq", palette: REDS, unit: "days/yr at 90°F+",
    about: "Average number of days per year reaching 90°F or higher, 2016-2025. " +
      "Zero along the coast; 30-85 in the inland valleys. The tract panel also " +
      "carries heat spikes (95th-percentile summer high), cold snaps (5th-percentile " +
      "winter low), and frost nights.",
  },
];

export const DIMENSION_BY_KEY = Object.fromEntries(DIMENSIONS.map((d) => [d.key, d]));

export const GROUPS = [...new Set(DIMENSIONS.map((d) => d.group))];

// Projected dimensions: same registry shape, but the GeoJSON property is
// horizon-suffixed (proj_value_5y / proj_value_10y, with _lo/_hi interval
// properties). The MAP colors the CHANGE vs today (proj_value_chg_5y etc.)
// for dimensions where change is the interesting signal; the tract panel
// shows the projected level and the change together. keyFor resolves the
// map key for the active horizon; valueKeyFor the level key. Every method
// here survived a backtest against its naive benchmark; the scores and the
// rejected alternatives are documented in docs/PROJECTIONS.md.
function projected(entry) {
  const base = entry.base;
  return {
    ...entry,
    keyFor: entry.fixedKey
      ? () => entry.fixedKey
      : entry.changeBase
        ? (h) => `${entry.changeBase}_${h}y`
        : (h) => `${base}_${h}y`,
    valueKeyFor: entry.fixedKey
      ? () => entry.fixedKey
      : (h) => `${base}_${h}y`,
    changeKeyFor: entry.changeBase
      ? (h) => `${entry.changeBase}_${h}y`
      : null,
    loFor: entry.noRange
      ? null
      : (h) => `${base}_${h}y_lo`,
    hiFor: entry.noRange
      ? null
      : (h) => `${base}_${h}y_hi`,
  };
}

export const PROJECTED_DIMENSIONS = [
  projected({
    base: "proj_value", id: "proj_value", label: "Home Value Change",
    valueLabel: "Projected home value",
    changeBase: "proj_value_chg", mapFormat: "pctChange",
    group: "Housing & value", format: "usd", legendFormat: "usdCompact",
    scale: "div", palette: DIVERGE,
    about: "Projected change in Zillow typical value; the map colors the CHANGE, " +
      "and each tract panel shows the projected value itself alongside it. Method: " +
      "damped trend per ZIP with the slope shrunk toward the county trend (the only " +
      "variant that beat the naive benchmark in both backtest windows; median error " +
      "14-25% at 5-6 years). Regional median: about +17% at 5 years, +23% at 10.",
  }),
  projected({
    base: "proj_school", id: "proj_school", label: "Proficiency Change",
    valueLabel: "Projected proficiency",
    changeBase: "proj_school_chg", mapFormat: "ppChange",
    group: "Schools", format: "pctPoints",
    scale: "div", palette: DIVERGE,
    about: "Projected change in ZIP-area proficiency, in points; the map colors the " +
      "change and the panel shows the projected level. Backtests say proficiency is " +
      "close to a random walk and pre-COVID trends fail outright, so this is " +
      "near-persistence: fit on 2022-2025 only, heavily shrunk toward the county " +
      "drift. Treat as a weak signal with wide ranges.",
  }),
  projected({
    base: "proj_crime_v", id: "proj_crime_v", label: "Projected Violent Crime",
    group: "Crime", format: "num1", scale: "seq", palette: REDS,
    unit: "per 1k residents / yr", noRange: true,
    about: "Projected violent crime rate. San Francisco tracts: their own trailing " +
      "3-year rate carried forward; shrinkage toward the city rate and trend models " +
      "both lost to that benchmark in backtests (tract levels differ 50-100x and " +
      "persist). Oakland and Sonoma are level-only: current level, no trend claimed.",
  }),
  projected({
    base: "proj_crime_p", id: "proj_crime_p", label: "Projected Property Crime",
    group: "Crime", format: "num1", scale: "seq", palette: REDS,
    unit: "per 1k residents / yr", noRange: true,
    about: "Projected property crime rate. Same persistence method as violent crime; " +
      "property volumes are larger, so SF backtest error is lower (12-23%).",
  }),
  projected({
    base: "proj_eal", id: "proj_eal", label: "Disaster Loss Change",
    valueLabel: "Projected expected annual loss",
    changeBase: "proj_eal_chg", mapFormat: "pctChange",
    group: "Disaster risk", format: "usd", legendFormat: "usdCompact",
    scale: "div", palette: DIVERGE,
    about: "Projected change in expected annual loss (FEMA NRI dollars); the map " +
      "colors the change and the panel shows the projected loss level. A scenario, " +
      "not a trend forecast: the hazard itself is held at today's snapshot and loss " +
      "scales with exposure, building loss with projected home values and population " +
      "loss with county population growth.",
  }),
  projected({
    base: "proj_fair", id: "proj_fair", label: "FAIR Share Change",
    valueLabel: "Projected FAIR Plan share",
    changeBase: "proj_fair_chg", mapFormat: "sharePointChange",
    group: "Environment & insurance", format: "pctShare",
    scale: "div", palette: DIVERGE,
    about: "Projected change in the FAIR Plan share of housing units, in points; " +
      "the map colors the change and the panel shows the projected share. From a " +
      "strongly damped trend on 2022-2026 enrollment (the raw trend explodes; " +
      "damping is what survived the backtest). Regional policies grew 4.6x in " +
      "four years; the projection roughly doubles the median share at 5 years, " +
      "then flattens as damping bites.",
  }),
  projected({
    fixedKey: "proj_pressure", id: "proj_pressure",
    label: "Insurance Pressure Index", group: "Environment & insurance",
    format: "num0", scale: "seq", palette: PURPLE, noRange: true,
    about: "Scenario index (0-100) of premium pressure: wildfire and flood exposure " +
      "percentiles plus FAIR Plan enrollment growth. Directional only, read against " +
      "the approved FAIR Plan filing (+29.1% average, Oct 2026). It is not a premium " +
      "quote and not a forecast.",
  }),
  projected({
    fixedKey: "water_pctile", id: "proj_water", label: "Projected Water Quality",
    group: "Environment & insurance", format: "num0", scale: "seq",
    palette: YLORD, noRange: true,
    about: "Projected drinking-water percentile = today's, carried forward " +
      "(persistence). The honest error bar is measured: between CalEnviroScreen " +
      "releases (2018 to 2021) tract percentiles moved a median of 7 points, 80% " +
      "within plus or minus 28. A trend model needs violation-history data that " +
      "does not exist yet at tract level.",
  }),
];

export const PROJECTED_BY_ID = Object.fromEntries(
  PROJECTED_DIMENSIONS.map((d) => [d.id, d]));

export const PROJECTED_GROUPS = [...new Set(PROJECTED_DIMENSIONS.map((d) => d.group))];
