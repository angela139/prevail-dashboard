"use client";

interface WeekSelectorProps {
  totalCrew: number;
  weekStarts?: string[];
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  weatherData?: {
    temp_max_f: number;
    temp_mean_f: number;
    wind_max_mph: number;
    gust_max_mph: number;
    humidity_mean: number;
  };
}

export default function WeekSelector({
  totalCrew,
  weekStarts = [],
  selectedDate,
  onDateChange,
  weatherData,
}: WeekSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex-1 min-w-75">
          <label
            htmlFor="week-selector"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Time Period
          </label>

          {/* Date Picker for specific week selection */}
          {weekStarts.length > 0 && onDateChange && (
            <div className="mb-4">
              <select
                value={selectedDate || ""}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a week...</option>
                {weekStarts.map((date) => {
                  const weekStart = new Date(date);
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekStart.getDate() + 6);
                  return (
                    <option key={date} value={date}>
                      Week of{" "}
                      {weekStart.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {weekEnd.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Weather Information Boxes */}
          {weatherData && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="text-xs font-medium text-orange-700 mb-1">
                  Maximum Temperature
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {weatherData.temp_max_f.toFixed(1)}°F
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  Average: {weatherData.temp_mean_f.toFixed(1)}°F
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="text-xs font-medium text-blue-700 mb-1">
                  Wind Speed
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {weatherData.wind_max_mph.toFixed(1)} MPH
                </div>
                <div className="text-xs text-blue-600 mt-1">Maximum</div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
                <div className="text-xs font-medium text-cyan-700 mb-1">
                  Wind Gust
                </div>
                <div className="text-2xl font-bold text-cyan-900">
                  {weatherData.gust_max_mph.toFixed(1)} MPH
                </div>
                <div className="text-xs text-cyan-600 mt-1">Maximum</div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
                <div className="text-xs font-medium text-teal-700 mb-1">
                  Humidity
                </div>
                <div className="text-2xl font-bold text-teal-900">
                  {weatherData.humidity_mean.toFixed(1)}%
                </div>
                <div className="text-xs text-teal-600 mt-1">Average</div>
              </div>
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-gray-700">
            Total Crew Members
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {typeof totalCrew === "number" && totalCrew % 1 !== 0
              ? totalCrew.toFixed(2)
              : totalCrew}
          </div>
        </div>
      </div>
    </div>
  );
}
