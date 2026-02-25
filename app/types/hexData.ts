export interface HexMapData {
  hex_id: string;
  lat: number;
  lng: number;
  weekData: {
    [weekStart: string]: {
      temp_max_f: number;
      temp_mean_f: number;
      wind_max_mph: number;
      gust_max_mph: number;
      humidity_mean: number;
      humidity_min: number;
      outage_count: number;
      crew_size: number;
      predicted_crew_size: number;
    };
  };
}
