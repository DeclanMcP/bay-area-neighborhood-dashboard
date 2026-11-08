# Bay Area Neighborhood Dashboard

An interactive map of every census tract in the nine-county San Francisco
Bay Area (1,765 tracts), measured on public data:

- **Housing & value** — Census ACS median home value, Zillow ZHVI typical
  value and 5-year growth
- **People** — household income, median age, population growth 2020 → 2023
- **Schools** — CAASPP proficiency (ZIP-area and in-tract)
- **Crime** — reported violent/property rates where geocoded feeds exist
  (SFPD, Oakland PD, Sonoma County Sheriff)
- **Disaster risk** — FEMA National Risk Index, split by hazard
  (earthquake, wildfire, flood, tsunami, landslide) plus expected annual loss
- **Air, water & insurance** — CalEnviroScreen 4.0 drinking water and air
  pollution (PM2.5, ozone, diesel PM), CA FAIR Plan enrollment share
- **Climate** — seasonal temperature extremes from Open-Meteo ERA5
  (2016–2025): summer highs, winter lows, heat days

A **Current | Projected** toggle switches to backtested 5-year (2031) and
10-year (2036) projections for value, schools, crime, disaster loss, FAIR
Plan share, and water quality. Projected maps color the *change*; tract
panels show the projected level, its change, and a backtest-calibrated
range.

This repository contains only the static dashboard (HTML/CSS/JS + a
GeoJSON data file) so it can be served by GitHub Pages. It is generated
from a larger data-science project that builds the tract dataset from
the public sources above; the dashboard is regenerated and republished
when the underlying data updates.

Live page: https://declanmcp.github.io/bay-area-neighborhood-dashboard/
