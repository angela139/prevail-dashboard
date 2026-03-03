"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection } from "geojson";
import { HexMapData } from "../types/hexData";
import {
  getDistrictName,
  buildHexGeoJson,
  buildHexPopupHtml,
  formatWeekRange,
} from "../lib/mapUtils";

interface MapVisualizationProps {
  selectedWeek: number;
  hexData: HexMapData[];
  selectedDate?: string;
  selectedHexId?: string | null;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function MapVisualization({
  selectedWeek,
  hexData,
  selectedDate,
  selectedHexId,
}: MapVisualizationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const currentPopup = useRef<mapboxgl.Popup | null>(null);
  const districtsGeoJson = useRef<FeatureCollection | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showDistricts, setShowDistricts] = useState(true);

  const weekStarts = useMemo(() => {
    if (!hexData || hexData.length === 0) return [];
    const weeks = new Set<string>();
    hexData.forEach((hex) =>
      Object.keys(hex.weekData).forEach((week) => weeks.add(week)),
    );
    return Array.from(weeks).sort();
  }, [hexData]);

  const loading = hexData.length === 0;

  // ─── Initialize map ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      center: [-117.1611, 32.7157],
      zoom: 10,
    });
    map.current.on("load", () => setMapLoaded(true));
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // ─── Load service districts overlay ─────────────────────────────────────────
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const addDistrictsLayer = async () => {
      try {
        const basePath =
          process.env.NODE_ENV === "production" ? "/prevail-dashboard" : "";
        const res = await fetch(`${basePath}/data/service_districts.geojson`);
        const geojson = await res.json();

        if (map.current!.getSource("service-districts")) return;
        districtsGeoJson.current = geojson;

        map.current!.addSource("service-districts", {
          type: "geojson",
          data: geojson,
        });

        map.current!.addLayer({
          id: "service-districts-fill",
          type: "fill",
          source: "service-districts",
          paint: { "fill-color": "#3b82f6", "fill-opacity": 0.05 },
        });

        map.current!.addLayer({
          id: "service-districts-border",
          type: "line",
          source: "service-districts",
          paint: {
            "line-color": "#1d4ed8",
            "line-width": 1.5,
            "line-dasharray": [3, 2],
          },
        });

        map.current!.addLayer({
          id: "service-districts-label",
          type: "symbol",
          source: "service-districts",
          layout: {
            "text-field": ["get", "Name"],
            "text-size": 11,
            "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
            "text-anchor": "center",
            "text-max-width": 8,
            "symbol-placement": "point",
          },
          paint: {
            "text-color": "#dc2626",
            "text-halo-color": "rgba(255,255,255,0.85)",
            "text-halo-width": 1.5,
          },
        });
      } catch (err) {
        console.error("Failed to load service districts:", err);
      }
    };

    addDistrictsLayer();
  }, [mapLoaded]);

  // ─── Toggle district layer visibility ────────────────────────────────────────
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    if (!map.current.getLayer("service-districts-fill")) return;
    const visibility = showDistricts ? "visible" : "none";
    [
      "service-districts-fill",
      "service-districts-border",
      "service-districts-label",
    ].forEach((id) => {
      if (map.current!.getLayer(id)) {
        map.current!.setLayoutProperty(id, "visibility", visibility);
      }
    });
  }, [showDistricts, mapLoaded]);

  // ─── Visualize hex data ───────────────────────────────────────────────────────
  useEffect(() => {
    if (
      !map.current ||
      !mapLoaded ||
      hexData.length === 0 ||
      weekStarts.length === 0
    )
      return;

    const timeKey = selectedDate || weekStarts[selectedWeek - 1];
    if (!timeKey) return;

    if (map.current.getLayer("hex-fill")) map.current.removeLayer("hex-fill");
    if (map.current.getLayer("hex-border"))
      map.current.removeLayer("hex-border");
    if (map.current.getSource("hex-data")) map.current.removeSource("hex-data");

    map.current.addSource("hex-data", {
      type: "geojson",
      data: buildHexGeoJson(hexData, timeKey),
    });

    map.current.addLayer({
      id: "hex-fill",
      type: "fill",
      source: "hex-data",
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "crew_size"],
          2,
          "#fee5d9",
          4,
          "#fcae91",
          6,
          "#fb6a4a",
          8,
          "#de2d26",
          10,
          "#a50f15",
        ],
        "fill-opacity": 0.6,
      },
    });

    map.current.addLayer({
      id: "hex-border",
      type: "line",
      source: "hex-data",
      paint: { "line-color": "#666666", "line-width": 0.5 },
    });

    map.current.on("click", "hex-fill", (e) => {
      if (!e.features?.length) return;
      currentPopup.current?.remove();

      const props = e.features[0].properties ?? {};
      const districtName = districtsGeoJson.current
        ? getDistrictName(districtsGeoJson.current, e.lngLat.lng, e.lngLat.lat)
        : null;

      currentPopup.current = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(buildHexPopupHtml(props, districtName))
        .addTo(map.current!);

      currentPopup.current.on("close", () => {
        currentPopup.current = null;
      });
    });

    map.current.on("mouseenter", "hex-fill", () => {
      if (map.current) map.current.getCanvas().style.cursor = "pointer";
    });
    map.current.on("mouseleave", "hex-fill", () => {
      if (map.current) map.current.getCanvas().style.cursor = "";
    });
  }, [hexData, selectedWeek, mapLoaded, weekStarts, selectedDate]);

  // ─── Fly to & popup for selected hex ─────────────────────────────────────────
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedHexId) return;

    const selectedHex = hexData.find((hex) => hex.hex_id === selectedHexId);
    if (!selectedHex) return;

    map.current.flyTo({
      center: [selectedHex.lng, selectedHex.lat],
      zoom: 10,
      duration: 1000,
    });

    const timeKey = selectedDate || weekStarts[selectedWeek - 1];
    const weekData = selectedHex.weekData[timeKey];
    if (!weekData) return;

    currentPopup.current?.remove();

    map.current.once("moveend", () => {
      if (!map.current) return;
      const districtName = districtsGeoJson.current
        ? getDistrictName(
            districtsGeoJson.current,
            selectedHex.lng,
            selectedHex.lat,
          )
        : null;

      currentPopup.current = new mapboxgl.Popup()
        .setLngLat([selectedHex.lng, selectedHex.lat])
        .setHTML(buildHexPopupHtml(weekData, districtName))
        .addTo(map.current);

      currentPopup.current.on("close", () => {
        currentPopup.current = null;
      });
    });
  }, [
    selectedHexId,
    mapLoaded,
    hexData,
    selectedDate,
    weekStarts,
    selectedWeek,
  ]);

  // ─── Render ───────────────────────────────────────────────────────────────────
  const dateStr = selectedDate || weekStarts[selectedWeek - 1];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Crew Allocations
          {dateStr && formatWeekRange(dateStr)}
        </h2>
        <button
          onClick={() => setShowDistricts((v) => !v)}
          className={`shrink-0 px-3 py-1.5 text-sm rounded cursor-pointer border transition-colors ${
            showDistricts
              ? "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
              : "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100"
          }`}
        >
          {showDistricts ? "Hide" : "Show"} Districts
        </button>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-600">
          Loading hex data...
        </div>
      )}

      <div
        ref={mapContainer}
        style={{ width: "100%", height: "600px" }}
        className="rounded border border-gray-200"
      />

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Legend:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <p className="font-semibold mb-1">Hexagons (Crew Size):</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {[
                ["#fee5d9", "2 crew members"],
                ["#fcae91", "4 crew members"],
                ["#fb6a4a", "6 crew members"],
                ["#de2d26", "8 crew members"],
                ["#a50f15", "10 crew members"],
              ].map(([color, label]) => (
                <li key={color}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      backgroundColor: color,
                      marginRight: "4px",
                    }}
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Service Districts:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    border: "2px dashed #1d4ed8",
                    backgroundColor: "rgba(59,130,246,0.15)",
                    marginRight: "4px",
                  }}
                />
                SDG&E service district boundary
              </li>
              <li>District names are labeled on the map</li>
              <li>Toggle visibility with the Districts button</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Information:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                Click on the hexagon(s) to see crew, outage, and weather
                details.
              </li>
              <li>Each hexagon represents a geographic area in San Diego.</li>
              <li>
                Data on the number of outages, outage duration, and weather
                conditions is shown.
              </li>
              <li>Use the week selector to view different time periods.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
