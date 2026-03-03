import * as turf from "@turf/turf";
import type {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon,
  Geometry,
} from "geojson";
import { HexMapData } from "../types/hexData";
import { getHexBoundary } from "./hexUtils";

// ─── District lookup ──────────────────────────────────────────────────────────

export function getDistrictName(
  fc: FeatureCollection,
  lng: number,
  lat: number
): string | null {
  const pt = turf.point([lng, lat]);

  for (const feature of fc.features) {
    if (
      feature.geometry.type === "Polygon" ||
      feature.geometry.type === "MultiPolygon"
    ) {
      if (
        turf.booleanPointInPolygon(
          pt,
          feature as Feature<Polygon | MultiPolygon>
        )
      ) {
        return feature.properties?.Name ?? null;
      }
    }
  }

  // Fallback: nearest centroid
  let minDist = Infinity;
  let nearest: string | null = null;
  for (const feature of fc.features) {
    try {
      const centroid = turf.centroid(feature as Feature<Geometry>);
      const d = turf.distance(pt, centroid);
      if (d < minDist) {
        minDist = d;
        nearest = feature.properties?.Name ?? null;
      }
    } catch {
      // skip unparseable geometries
    }
  }
  return nearest;
}

// ─── Hex GeoJSON builder ──────────────────────────────────────────────────────

export function buildHexGeoJson(hexData: HexMapData[], timeKey: string) {
  const features = hexData
    .filter((hex) => hex.weekData[timeKey])
    .map((hex) => {
      const boundary = getHexBoundary(hex.hex_id);
      if (boundary.length === 0) return null;
      const weekData = hex.weekData[timeKey];
      return {
        type: "Feature" as const,
        geometry: {
          type: "Polygon" as const,
          coordinates: [[...boundary, boundary[0]]],
        },
        properties: {
          hex_id: hex.hex_id,
          crew_size: weekData.crew_size,
          predicted_crew_size: weekData.predicted_crew_size || 0,
          outage_count: weekData.outage_count,
          temp_max_f: weekData.temp_max_f,
          temp_mean_f: weekData.temp_mean_f,
          wind_max_mph: weekData.wind_max_mph,
          gust_max_mph: weekData.gust_max_mph,
          humidity_mean: weekData.humidity_mean,
          humidity_min: weekData.humidity_min,
        },
      };
    })
    .filter((f) => f !== null);

  return { type: "FeatureCollection" as const, features };
}

// ─── Popup HTML ───────────────────────────────────────────────────────────────

interface HexProps {
  crew_size?: number;
  predicted_crew_size?: number;
  outage_count?: number;
  temp_max_f?: number;
  temp_mean_f?: number;
  wind_max_mph?: number;
  gust_max_mph?: number;
  humidity_mean?: number;
  humidity_min?: number;
}

export function buildHexPopupHtml(
  props: HexProps,
  districtName: string | null
): string {
  const district = districtName
    ? `<div style="margin:0 0 8px;font-size:12px;color:#dc2626;font-weight:600;letter-spacing:0.02em;">📍 ${districtName}</div>`
    : "";
  return `
    <div style="padding:10px;max-width:300px;">
      ${district}
      <div style="margin:4px 0;"><strong>Actual Crew Size:</strong> ${
        props.crew_size ?? 0
      }</div>
      <div style="margin:4px 0;"><strong>Predicted Crew Size:</strong> ${
        props.predicted_crew_size ?? 0
      }</div>
      <div style="margin:4px 0;"><strong>Outage Count:</strong> ${
        props.outage_count ?? 0
      }</div>
      <hr style="margin:8px 0;border:0;border-top:1px solid #ddd;"/>
      <div style="font-size:12px;color:#666;">
        <div><strong>Temp Max:</strong> ${props.temp_max_f?.toFixed(1)}°F</div>
        <div><strong>Temp Mean:</strong> ${props.temp_mean_f?.toFixed(
          1
        )}°F</div>
        <div><strong>Wind Max:</strong> ${props.wind_max_mph?.toFixed(
          1
        )} mph</div>
        <div><strong>Gust Max:</strong> ${props.gust_max_mph?.toFixed(
          1
        )} mph</div>
        <div><strong>Humidity Mean:</strong> ${props.humidity_mean?.toFixed(
          1
        )}%</div>
        <div><strong>Humidity Min:</strong> ${props.humidity_min?.toFixed(
          1
        )}%</div>
      </div>
    </div>`;
}

// ─── Week range label ─────────────────────────────────────────────────────────

export function formatWeekRange(dateStr: string): string {
  const weekStart = new Date(dateStr);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return ` - Week of ${weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} - ${weekEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}
