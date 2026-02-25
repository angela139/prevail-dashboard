"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import WeekSelector from "./WeekSelector";
import MapVisualization from "./MapVisualization";
import CrewDetailsGrid from "./CrewDetailsGrid";
import { HexMapData } from "../types/hexData";
import { loadPredictionsData } from "../lib/hexUtils";

export default function DashboardContainer() {
  const selectedWeek = 1; // Default week index (not actively used, kept for compatibility)
  const [hexData, setHexData] = useState<HexMapData[]>([]);
  const [weekStarts, setWeekStarts] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHexId, setSelectedHexId] = useState<string | null>(null);

  // Load hex data
  useEffect(() => {
    // Load predictions data only
    loadPredictionsData()
      .then((data) => {
        setHexData(data);

        // Extract unique time periods from outagestartdatetime
        const weeks = new Set<string>();
        data.forEach((hex) => {
          Object.keys(hex.weekData).forEach((week) => weeks.add(week));
        });
        const sortedWeeks = Array.from(weeks).sort();
        setWeekStarts(sortedWeeks);

        // Set initial date to first available
        if (sortedWeeks.length > 0) {
          setSelectedDate(sortedWeeks[0]);
        }
      })
      .catch((err) => {
        console.error("Error loading predictions data:", err);
      });
  }, []);

  // Calculate total crew from hex data for selected week
  // Use selectedDate if available, otherwise use selectedWeek
  const timeKey = selectedDate || weekStarts[selectedWeek - 1];
  const totalCrewForWeek = hexData.reduce((sum, hex) => {
    const weekData = hex.weekData[timeKey];
    const crewCount = weekData?.crew_size || 0;
    return sum + crewCount;
  }, 0);

  // Calculate average weather data for the selected week
  const weatherData = React.useMemo(() => {
    if (!timeKey || hexData.length === 0) return undefined;

    let temp_max_f = 0;
    let temp_mean_f = 0;
    let wind_max_mph = 0;
    let gust_max_mph = 0;
    let humidity_mean = 0;
    let count = 0;

    hexData.forEach((hex) => {
      const weekData = hex.weekData[timeKey];
      if (weekData) {
        temp_max_f = Math.max(temp_max_f, weekData.temp_max_f);
        temp_mean_f += weekData.temp_mean_f;
        wind_max_mph = Math.max(wind_max_mph, weekData.wind_max_mph);
        gust_max_mph = Math.max(gust_max_mph, weekData.gust_max_mph);
        humidity_mean += weekData.humidity_mean;
        count++;
      }
    });

    if (count === 0) return undefined;

    return {
      temp_max_f,
      temp_mean_f: temp_mean_f / count,
      wind_max_mph,
      gust_max_mph,
      humidity_mean: humidity_mean / count,
    };
  }, [timeKey, hexData]);

  return (
    <>
      <WeekSelector
        totalCrew={totalCrewForWeek}
        weekStarts={weekStarts}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        weatherData={weatherData}
      />

      <MapVisualization
        selectedWeek={selectedWeek}
        hexData={hexData}
        selectedDate={timeKey}
        selectedHexId={selectedHexId}
      />
      <CrewDetailsGrid
        hexData={hexData}
        selectedWeek={selectedWeek}
        weekStarts={weekStarts}
        selectedDate={timeKey}
        onHexSelect={setSelectedHexId}
      />
    </>
  );
}
