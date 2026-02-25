import { HexMapData } from "../types/hexData";

interface CrewDetailsGridProps {
  hexData: HexMapData[];
  selectedWeek: number;
  weekStarts: string[];
  selectedDate?: string;
  onHexSelect?: (hexId: string) => void;
}

export default function CrewDetailsGrid({
  hexData,
  selectedWeek,
  weekStarts,
  selectedDate,
  onHexSelect,
}: CrewDetailsGridProps) {
  const selectedWeekStart = selectedDate || weekStarts[selectedWeek - 1];

  // Filter and sort hexes that have data for the selected week
  const hexesWithData = hexData
    .filter((hex) => hex.weekData[selectedWeekStart])
    .map((hex) => ({
      ...hex,
      weekData: hex.weekData[selectedWeekStart],
    }))
    .sort((a, b) => {
      return (b.weekData.crew_size || 0) - (a.weekData.crew_size || 0);
    });

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Crew Allocation Details - Week {selectedWeek}
        {selectedWeekStart &&
          ` (${new Date(selectedWeekStart).toLocaleDateString()})`}
      </h3>
      <div className="mb-4 text-sm text-gray-600">
        Showing {hexesWithData.length} hexagons with crew assignments
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {hexesWithData.map((hex) => (
          <div
            key={hex.hex_id}
            onClick={() => onHexSelect?.(hex.hex_id)}
            className="border border-gray-200 rounded p-3 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
          >
            <div
              className="font-mono text-xs text-gray-500 mb-2 truncate"
              title={hex.hex_id}
            >
              {hex.hex_id.substring(0, 12)}...
            </div>
            <div className="text-xs text-gray-600">
              Lat: {hex.lat.toFixed(4)}, Lng: {hex.lng.toFixed(4)}
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-2 mb-1">
              {hex.weekData.crew_size} crew members
            </div>
            <div className="text-sm text-gray-600">
              Predicted: {(hex.weekData.predicted_crew_size || 0)}
            </div>
            <div className="text-xs text-gray-600 border-t pt-2 mt-2 space-y-1">
              {hex.weekData.outage_count > 0 && (
                <div>
                  <span className="font-semibold">Outages:</span>{" "}
                  {hex.weekData.outage_count}
                </div>
              )}
              <div>
                <span className="font-semibold">Temp:</span>{" "}
                {hex.weekData.temp_mean_f.toFixed(1)}°F
              </div>
              <div>
                <span className="font-semibold">Humidity:</span>{" "}
                {hex.weekData.humidity_mean.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      {hexesWithData.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No crew data available for this week
        </div>
      )}
    </div>
  );
}
