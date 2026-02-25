"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { HexMapData } from "../types/hexData";
import { getHexBoundary } from "../lib/hexUtils";

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
  const [mapLoaded, setMapLoaded] = useState(false);

  // Compute weekStarts from hexData
  const weekStarts = useMemo(() => {
    if (!hexData || hexData.length === 0) return [];
    const weeks = new Set<string>();
    hexData.forEach((hex) => {
      Object.keys(hex.weekData).forEach((week) => weeks.add(week));
    });
    return Array.from(weeks).sort();
  }, [hexData]);

  const loading = hexData.length === 0;

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      center: [-117.1611, 32.7157],
      zoom: 10,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Visualize hex data on the map
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

    // Remove existing hex layers if they exist
    if (map.current.getLayer("hex-fill")) {
      map.current.removeLayer("hex-fill");
    }
    if (map.current.getLayer("hex-border")) {
      map.current.removeLayer("hex-border");
    }
    if (map.current.getSource("hex-data")) {
      map.current.removeSource("hex-data");
    }

    // Create GeoJSON for hex data
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
            coordinates: [[...boundary, boundary[0]]], // Close the polygon
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

    const geoJson = {
      type: "FeatureCollection" as const,
      features,
    };

    // Add hex data source
    map.current.addSource("hex-data", {
      type: "geojson",
      data: geoJson,
    });

    // Add hex fill layer with color based on crew size
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

    // Add hex border layer
    map.current.addLayer({
      id: "hex-border",
      type: "line",
      source: "hex-data",
      paint: {
        "line-color": "#666666",
        "line-width": 0.5,
      },
    });

    // Add click popup for hex data
    map.current.on("click", "hex-fill", (e) => {
      if (e.features && e.features.length > 0) {
        // Close existing popup if any
        if (currentPopup.current) {
          currentPopup.current.remove();
        }

        const props = e.features[0].properties;

        currentPopup.current = new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `<div style="padding: 10px; max-width: 300px;">
              <div style="margin: 4px 0;"><strong>Actual Crew Size:</strong> ${props?.crew_size || 0}</div>
              <div style="margin: 4px 0;"><strong>Predicted Crew Size:</strong> ${(props?.predicted_crew_size || 0)}</div>
              <div style="margin: 4px 0;"><strong>Outage Count:</strong> ${props?.outage_count || 0}</div>
              <hr style="margin: 8px 0; border: 0; border-top: 1px solid #ddd;"/>
              <div style="font-size: 12px; color: #666;">
                <div><strong>Temp Max:</strong> ${props?.temp_max_f?.toFixed(1)}°F</div>
                <div><strong>Temp Mean:</strong> ${props?.temp_mean_f?.toFixed(1)}°F</div>
                <div><strong>Wind Max:</strong> ${props?.wind_max_mph?.toFixed(1)} mph</div>
                <div><strong>Gust Max:</strong> ${props?.gust_max_mph?.toFixed(1)} mph</div>
                <div><strong>Humidity Mean:</strong> ${props?.humidity_mean?.toFixed(1)}%</div>
                <div><strong>Humidity Min:</strong> ${props?.humidity_min?.toFixed(1)}%</div>
              </div>
            </div>`,
          )
          .addTo(map.current!);

        // Clear the reference when popup is closed by user
        currentPopup.current.on("close", () => {
          currentPopup.current = null;
        });
      }
    });

    // Change cursor on hover
    map.current.on("mouseenter", "hex-fill", () => {
      if (map.current) map.current.getCanvas().style.cursor = "pointer";
    });

    map.current.on("mouseleave", "hex-fill", () => {
      if (map.current) map.current.getCanvas().style.cursor = "";
    });
  }, [hexData, selectedWeek, mapLoaded, weekStarts, selectedDate]);

  // Zoom to selected hex when selectedHexId changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedHexId) return;

    const selectedHex = hexData.find((hex) => hex.hex_id === selectedHexId);
    if (!selectedHex) return;

    // Zoom to hex location
    map.current.flyTo({
      center: [selectedHex.lng, selectedHex.lat],
      zoom: 10,
      duration: 1000,
    });

    // Show popup for the selected hex
    const timeKey = selectedDate || weekStarts[selectedWeek - 1];
    const weekData = selectedHex.weekData[timeKey];
    if (weekData) {
      if (currentPopup.current) {
        currentPopup.current.remove();
      }

      currentPopup.current = new mapboxgl.Popup()
        .setLngLat([selectedHex.lng, selectedHex.lat])
        .setHTML(
          `<div style="padding: 10px; max-width: 300px;">
            <div style="margin: 4px 0;"><strong>Actual Crew Size:</strong> ${weekData.crew_size || 0}</div>
            <div style="margin: 4px 0;"><strong>Predicted Crew Size:</strong> ${weekData.predicted_crew_size || 0}</div>
            <div style="margin: 4px 0;"><strong>Outage Count:</strong> ${weekData.outage_count || 0}</div>
            <hr style="margin: 8px 0; border: 0; border-top: 1px solid #ddd;"/>
            <div style="font-size: 12px; color: #666;">
              <div><strong>Temp Max:</strong> ${weekData.temp_max_f?.toFixed(1)}°F</div>
              <div><strong>Temp Mean:</strong> ${weekData.temp_mean_f?.toFixed(1)}°F</div>
              <div><strong>Wind Max:</strong> ${weekData.wind_max_mph?.toFixed(1)} mph</div>
              <div><strong>Gust Max:</strong> ${weekData.gust_max_mph?.toFixed(1)} mph</div>
              <div><strong>Humidity Mean:</strong> ${weekData.humidity_mean?.toFixed(1)}%</div>
              <div><strong>Humidity Min:</strong> ${weekData.humidity_min?.toFixed(1)}%</div>
            </div>
          </div>`,
        )
        .addTo(map.current);

      currentPopup.current.on("close", () => {
        currentPopup.current = null;
      });
    }
  }, [selectedHexId, mapLoaded, hexData, selectedDate, weekStarts, selectedWeek]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          San Diego Outage & Crew Map
          {(selectedDate || weekStarts[selectedWeek - 1]) &&
            (() => {
              const dateStr = selectedDate || weekStarts[selectedWeek - 1];
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
            })()}
        </h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="font-semibold mb-1">Hexagons (Crew Size):</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#fee5d9",
                    marginRight: "4px",
                  }}
                ></span>
                2 Crew Members
              </li>
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#fcae91",
                    marginRight: "4px",
                  }}
                ></span>
                4 Crew Members
              </li>
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#fb6a4a",
                    marginRight: "4px",
                  }}
                ></span>
                6 Crew Members
              </li>
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#de2d26",
                    marginRight: "4px",
                  }}
                ></span>
                8 Crew Members
              </li>
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#a50f15",
                    marginRight: "4px",
                  }}
                ></span>
                10 Crew Members
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Information:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Click on the hexagon(s) to see crew, outage, and weather details.</li>
              <li>Each hexagon represents a geographic area in San Diego.</li>
              <li>
                Data on the number of outages, outage duration, and weather conditions is shown.
              </li>
              <li>Use the week selector to view different time periods.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
