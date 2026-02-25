import { cellToBoundary, cellToLatLng } from "h3-js";
import { HexMapData } from "../types/hexData";

/**
 * Get hex boundary coordinates for visualization
 */
export function getHexBoundary(hexId: string): [number, number][] {
  try {
    const boundary = cellToBoundary(hexId);
    return boundary.map(([lat, lng]) => [lng, lat] as [number, number]);
  } catch (error) {
    console.error(`Error getting boundary for ${hexId}:`, error);
    return [];
  }
}

/**
 * Load predictions_final.csv and aggregate by week
 */
export async function loadPredictionsData(): Promise<HexMapData[]> {
  const basePath = process.env.NODE_ENV === "production" ? "/prevail-dashboard" : "";
  const response = await fetch(`${basePath}/data/predictions_final.csv`);
  const csvText = await response.text();
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  const hexMap = new Map<string, HexMapData>();

  lines.slice(1).forEach((line) => {
    const values = line.split(",");
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    const hex_id = row.hex_id;
    if (!hex_id || hex_id.trim() === "") return;

    // Parse outagestartdatetime and calculate week start (Sunday)
    const outageDate = new Date(row.outagestartdatetime);
    if (isNaN(outageDate.getTime())) return;

    // Skip entries without weather data
    const hasWeatherData = row.temp_max_f && row.temp_max_f.trim() !== "";
    if (!hasWeatherData) return;

    // Get the Sunday of the week this outage occurred
    const dayOfWeek = outageDate.getDay();
    const weekStart = new Date(outageDate);
    weekStart.setDate(outageDate.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    const timeKey = weekStart.toISOString().split("T")[0];

    if (!hexMap.has(hex_id)) {
      try {
        const [lat, lng] = cellToLatLng(hex_id);
        hexMap.set(hex_id, {
          hex_id,
          lat,
          lng,
          weekData: {},
        });
      } catch {
        return;
      }
    }

    const hexData = hexMap.get(hex_id)!;
    if (!hexData.weekData[timeKey]) {
      hexData.weekData[timeKey] = {
        temp_max_f: parseFloat(row.temp_max_f) || 0,
        temp_mean_f: parseFloat(row.temp_mean_f) || 0,
        wind_max_mph: parseFloat(row.wind_max_mph) || 0,
        gust_max_mph: parseFloat(row.gust_max_mph) || 0,
        humidity_mean: parseFloat(row.humidity_mean) || 0,
        humidity_min: parseFloat(row.humidity_min) || 0,
        outage_count: 1,
        crew_size: parseFloat(row.actual_crew_size) || 0,
        predicted_crew_size: parseFloat(row.predicted_crew_size) || 0,
      };
    } else {
      const existingData = hexData.weekData[timeKey];
      const count = existingData.outage_count;

      existingData.outage_count += 1;

      existingData.temp_max_f = Math.max(
        existingData.temp_max_f,
        parseFloat(row.temp_max_f) || 0,
      );
      existingData.wind_max_mph = Math.max(
        existingData.wind_max_mph,
        parseFloat(row.wind_max_mph) || 0,
      );
      existingData.gust_max_mph = Math.max(
        existingData.gust_max_mph,
        parseFloat(row.gust_max_mph) || 0,
      );

      existingData.temp_mean_f =
        (existingData.temp_mean_f * count +
          (parseFloat(row.temp_mean_f) || 0)) /
        (count + 1);
      existingData.humidity_mean =
        (existingData.humidity_mean * count +
          (parseFloat(row.humidity_mean) || 0)) /
        (count + 1);
      existingData.humidity_min = Math.min(
        existingData.humidity_min,
        parseFloat(row.humidity_min) || 0,
      );

      existingData.crew_size += parseFloat(row.actual_crew_size) || 0;
      existingData.predicted_crew_size +=
        parseFloat(row.predicted_crew_size) || 0;
    }
  });

  console.log(`Loaded ${hexMap.size} hexagons from predictions_final.csv`);
  return Array.from(hexMap.values());
}
