// Leaflet map + choropleth rendering.
// Basemap: Esri World Light Gray (keyless). The reference/labels layer sits
// in a pane ABOVE the tract fills so town names stay readable — the earlier
// CARTO basemap began returning "API KEY REQUIRED" watermark tiles, which
// is why this dashboard no longer uses it.

import { FORMATTERS } from "./dimensions.js";
import { quantileBreaks, values } from "./data.js";

const NO_DATA = "#d9d9d9";
const FLAG_COLOR = "#d97706";

export function createMap(elementId) {
  const map = L.map(elementId, { scrollWheelZoom: true });
  map.createPane("basemap");
  map.getPane("basemap").style.zIndex = 200;
  map.createPane("labels");
  map.getPane("labels").style.zIndex = 650;
  map.getPane("labels").style.pointerEvents = "none";

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    { pane: "basemap", attribution: "Esri, HERE, Garmin, OpenStreetMap contributors" }
  ).addTo(map);
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    { pane: "labels" }
  ).addTo(map);
  return map;
}

export function paletteFor(dim) {
  // `reverse: true` flips the ramp so the darkest color marks the LOWEST
  // values — e.g. Winter Lows, where dark blue must mean coldest.
  return dim.reverse ? [...dim.palette].reverse() : dim.palette;
}

export class Choropleth {
  constructor(map, features, onSelect) {
    this.map = map;
    this.features = features;
    this.onSelect = onSelect;
    this.dim = null;
    this.breaks = [];
    this.layer = L.geoJSON(
      { type: "FeatureCollection", features },
      {
        style: () => ({ color: "#ffffff", weight: 0.4, fillColor: NO_DATA, fillOpacity: 0.6 }),
        onEachFeature: (feature, layer) => {
          layer.on("click", () => this.onSelect(feature));
          layer.bindTooltip("", { sticky: true, className: "tract-tip-wrap" });
        },
      }
    ).addTo(map);
    map.fitBounds(this.layer.getBounds(), { padding: [10, 10] });
  }

  colorFor(v) {
    if (v == null || !Number.isFinite(v)) return NO_DATA;
    const pal = paletteFor(this.dim);
    let idx = this.breaks.filter((b) => v >= b).length;
    return pal[Math.min(idx, pal.length - 1)];
  }

  setDimension(dim) {
    this.dim = dim;
    // A dimension may pin its own breaks (PM2.5 is anchored to the federal
    // 9 µg/m³ standard); everything else uses data quantiles.
    this.breaks = dim.breaks ? [...dim.breaks] : quantileBreaks(values(this.features, dim.key), dim.palette.length);
    const fmt = FORMATTERS[dim.format];
    this.layer.eachLayer((layer) => {
      const p = layer.feature.properties;
      const v = p[dim.key];
      const flagged = dim.key === "home_value" && p.value_flag === "acs_zhvi_diverge";
      const muted = dim.muteFlag && p[dim.muteFlag] != null;
      layer.setStyle({
        fillColor: this.colorFor(v),
        fillOpacity: v == null ? 0.45 : muted ? 0.3 : 0.78,
        color: flagged ? FLAG_COLOR : "#ffffff",
        weight: flagged ? 2 : 0.4,
      });
      const src = dim.key === "home_value" && p.value_source === "zhvi" ? " (Zillow est.)" : "";
      layer.setTooltipContent(
        `<div class="tract-tip"><span class="place">${p.place ?? "Unknown area"}</span><br>` +
          `${dim.label}: <b>${v == null ? "no data" : fmt(v)}${src}</b></div>`
      );
    });
    this.renderLegend();
  }

  renderLegend() {
    const el = document.getElementById("legend");
    const dim = this.dim;
    const fmt = FORMATTERS[dim.legendFormat || dim.format];
    const vals = values(this.features, dim.key);
    if (!vals.length) {
      el.innerHTML = "<span>No data for this dimension.</span>";
      return;
    }
    const edges = [Math.min(...vals), ...this.breaks, Math.max(...vals)];
    const pal = paletteFor(dim);
    let html = "";
    for (let i = 0; i < edges.length - 1; i++) {
      html += `<span><span class="swatch" style="background:${pal[Math.min(i, pal.length - 1)]}"></span>` +
        `${fmt(edges[i])} – ${fmt(edges[i + 1])}</span>`;
    }
    html += `<span><span class="swatch" style="background:${NO_DATA}"></span>No data</span>`;
    if (dim.key === "home_value") {
      html += `<span><span class="swatch" style="background:transparent;border:2px solid ${FLAG_COLOR}"></span>ACS vs Zillow disagree &gt;2x</span>`;
    }
    if (dim.muteFlag) {
      html += `<span>Faded = change within survey margin of error</span>`;
    }
    el.innerHTML = html;
  }

  zoomTo(features) {
    const tmp = L.geoJSON({ type: "FeatureCollection", features });
    this.map.fitBounds(tmp.getBounds(), { padding: [20, 20] });
  }

  highlight(feature) {
    this.layer.eachLayer((layer) => {
      if (layer.feature === feature) {
        layer.setStyle({ color: "#111827", weight: 2.5 });
        layer.bringToFront();
      }
    });
  }
}
