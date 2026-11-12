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
  num2: (v) => v.toFixed(2),
  years: (v) => v.toFixed(1) + " yrs",
  degF: (v) => Math.round(v) + "°F",
  degF1: (v) => v.toFixed(1) + "°F",
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
    key: "home_value", label: "Home Value (Zillow ZHVI)", group: "Housing & value",
    format: "usd", legendFormat: "usdCompact", scale: "seq", palette: MONEY,
    about: "Typical home value per tract from Zillow's ZHVI (ZIP level, mapped " +
      "to tracts). This is the price basis for the map and the rankings. It " +
      "replaced Census ACS medians as the primary measure on 2026-11-08: ACS " +
      "medians cover only a tract's owner-occupied stock and read far too low " +
      "in condo and apartment tracts (one Mountain View tract: ACS $433k vs " +
      "Zillow $2.25M). Where Zillow publishes no value, the ACS median is the " +
      "fallback and the panel says so. Tracts outlined in amber disagree " +
      "between the two sources by more than 2x; click one to see both numbers.",
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
  {
    key: "rent", label: "Median Rent", group: "Housing & value",
    format: "usd", legendFormat: "usdCompact", scale: "seq", palette: MONEY,
    about: "Median gross rent, Census ACS 2023 5-year (table B25064). This field was " +
      "in the feature table from the first ACS pull; it only lacked a map view. " +
      "Bay Area median tract: about $2,600/mo. The ACS top-codes very high rents, " +
      "so the top of the scale compresses around $3,500.",
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
  {
    key: "bach_share", label: "Bachelor's Degree or Higher", group: "People",
    format: "pctShare", scale: "seq", palette: TEAL,
    about: "Share of residents age 25+ holding a bachelor's degree or higher, " +
      "Census ACS 2023 5-year. Was already in every tract panel; now mappable.",
  },
  {
    key: "hh_kids_share", label: "Households With Children", group: "People",
    format: "pctShare", scale: "seq", palette: PURPLE,
    about: "Share of households with one or more people under 18, Census ACS " +
      "2023 5-year, table B11005. The family-presence measure: higher means " +
      "more households here are raising children. Regional share is about " +
      "31%; tracts with very few households are noisy.",
  },
  // --- Getting around & noise ------------------------------------------
  {
    key: "walk_index", label: "Walkability (EPA index)", group: "Getting around & noise",
    format: "num1", scale: "seq", palette: GREEN, unit: "of 20",
    about: "EPA National Walkability Index, 1 (least walkable) to 20 (most), a " +
      "national ranking of block groups from intersection density, distance to " +
      "the nearest transit stop, employment mix, and jobs-housing mix (EPA Smart " +
      "Location Database), population-weighted to tracts. This is EPA's public " +
      "index, not Walk Score: Walk Score is proprietary, API-keyed, and its terms " +
      "bar bulk caching, so it cannot be mapped at tract scale. Darker green = " +
      "more walkable. Downtown cores score 17-20; rural tracts 1-7.",
  },
  {
    key: "transit_freq", label: "Transit Frequency", group: "Getting around & noise",
    format: "num1", scale: "seq", palette: TEAL, unit: "services/hr, PM peak",
    about: "Aggregate transit service frequency within a quarter mile, per hour " +
      "during the evening peak (EPA Smart Location Database D4C, from GTFS feeds). " +
      "Tracts with no transit service are a real 0, not missing: about a quarter " +
      "of block groups sit outside transit coverage. The tract panel also carries " +
      "distance to the nearest stop and jobs reachable in 45 minutes.",
  },
  {
    key: "commute_menlo_min", label: "Commute to Menlo Park", group: "Getting around & noise",
    format: "num0", scale: "seq", palette: TEAL, unit: "min drive, free-flow",
    about: "Drive time from the tract centroid to Meta's Menlo Park campus " +
      "(1 Hacker Way), routed on the OpenStreetMap road network with OSRM at " +
      "free-flow speeds: no live traffic, so peak-hour drives run longer, " +
      "especially across the bay crossings. Peninsula tracts run 10-25 " +
      "minutes; San Francisco about 44; the far North Bay over 90. Darker = " +
      "longer drive.",
  },
  {
    key: "noise_share55", label: "Transport Noise · Area ≥55 dB", group: "Getting around & noise",
    format: "pctShare", scale: "seq", palette: REDS,
    about: "Share of the tract's area where modeled transportation noise reaches " +
      "55 dBA or more (24-hour average). Source: US DOT Bureau of Transportation " +
      "Statistics National Transportation Noise Map 2020 - road, rail, and aviation " +
      "modeled together on a 30 m grid; road traffic dominates away from airports " +
      "and rail lines. 55 dBA is roughly busy-street level. This share is the " +
      "robust headline: it is unaffected by the model's 45 dBA floor. The tract " +
      "panel also carries the tract's average level and its ≥60 dB share.",
  },
  {
    key: "noise_db", label: "Transport Noise · Average dB", group: "Getting around & noise",
    format: "num1", scale: "seq", palette: REDS, unit: "dBA, 24h average",
    about: "Average transportation noise level per tract (same BTS 2020 model as " +
      "the ≥55 dB view), computed as an energy mean over the tract's 30 m pixels " +
      "with pixel values capped at 90 dBA so a few near-runway pixels cannot " +
      "dominate a tract. Read with the floor in mind: BTS models nothing below " +
      "45 dBA, so 45 means 'at or below the model floor', and quiet tracts read " +
      "a little high. A tract crossed by one freeway will average much louder " +
      "than its quietest streets - check the ≥55 dB area share alongside.",
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
    key: "water_pctile", label: "Water Quality", group: "Air, water & insurance",
    format: "num0", scale: "seq", palette: YLORD,
    about: "CalEnviroScreen 4.0 drinking-water contaminant index, statewide percentile. " +
      "Higher = worse water. Most Bay Area tracts score low; Napa's small upvalley " +
      "systems are the regional outlier.",
  },
  {
    key: "air_pollution", label: "Air Pollution · Average", group: "Air, water & insurance",
    format: "num0", scale: "seq", palette: YLORD,
    about: "Air pollution average: the mean of the three CalEnviroScreen 4.0 statewide " +
      "percentiles for PM2.5, ozone, and diesel particulate matter (monitoring window " +
      "2017-2019). Higher = worse air. The three ingredients also have their own tabs: " +
      "PM2.5 runs 5.5-10.5 ug/m3 across the region (the federal annual standard is 9), " +
      "ozone peaks inland, and diesel PM concentrates near ports, freeways, and dense traffic.",
  },
  {
    key: "pm25", label: "Air · PM2.5 Average", group: "Air, water & insurance",
    format: "num1", scale: "seq", palette: YLORD, unit: "µg/m³ annual mean",
    breaks: [6.5, 7.5, 8.0, 8.5, 9.0, 9.5],
    about: "PM2.5 annual-average concentration (CalEnviroScreen 4.0, 2017-2019). The " +
      "color bands are anchored to the federal annual standard of 9 µg/m³: 211 tracts " +
      "sit above it, mostly along the eastern shore and the South Bay freeway corridors. " +
      "The tract panel also carries each tract's statewide percentile for this pollutant.",
  },
  {
    key: "ozone", label: "Air · Ozone Average", group: "Air, water & insurance",
    format: "num0", scale: "seq", palette: YLORD, unit: "ppb",
    about: "Ozone: summer-season mean of the daily maximum 8-hour concentration " +
      "(CalEnviroScreen 4.0, 2017-2019; stored in ppm by the source and shown here in " +
      "ppb). Ozone forms downwind on hot days, so it peaks inland (Solano, Contra Costa, " +
      "inland Santa Clara) and stays lowest in San Francisco and along the coast.",
  },
  {
    key: "diesel_pm", label: "Air · Diesel PM Average", group: "Air, water & insurance",
    format: "num2", scale: "seq", palette: YLORD, unit: "µg/m³",
    about: "Diesel particulate matter, annual-average concentration (CalEnviroScreen 4.0, " +
      "2017-2019 emissions-based estimates). The regional median is about 0.20 µg/m³; " +
      "the highest values concentrate near the Port of Oakland, freight corridors, and " +
      "dense downtown traffic, and the statewide percentile reaches 100 in the worst tract.",
  },
  {
    key: "fair_share", label: "FAIR Plan Share", group: "Air, water & insurance",
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
    format: "degF", legendFormat: "degF1", scale: "seq", palette: TEAL, reverse: true,
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
