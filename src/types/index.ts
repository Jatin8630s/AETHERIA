export interface CityAQIData {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number; // 0-500 US AQI
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2: number; // µg/m³
  o3: number; // µg/m³
  co: number; // µg/m³
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2' | 'O3' | 'CO';
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
  temp?: number;
  humidity?: number;
  windSpeed?: number;
  updatedAt?: string;
}

export interface UserLifestyle {
  city: string;
  dwellingType: 'apartment' | 'suburban_house' | 'dense_urban_studio' | 'rural_home';
  commuteMode: 'gas_car' | 'ev' | 'public_transit' | 'bicycle_walk' | 'remote_work';
  commuteDistanceKm: number;
  hasAirPurifier: boolean;
  dietPreference: 'omnivore' | 'flexitarian' | 'vegetarian' | 'plant_based';
  hvacType: 'central_ac' | 'natural_ventilation' | 'heat_pump' | 'window_units';
}

export interface RoutineTask {
  id: string;
  timeSlot: string; // e.g. "07:30 AM"
  period: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
  title: string;
  description: string;
  co2SavedKg: number;
  pm25AvoidedUg: number;
  category: 'commute' | 'energy' | 'ventilation' | 'diet' | 'wellness';
  completed: boolean;
  aiTip: string;
}

export interface IAQHack {
  id: string;
  title: string;
  room: 'living_room' | 'bedroom' | 'kitchen' | 'home_office' | 'whole_home';
  difficulty: 'Quick (1 min)' | 'Moderate (10 mins)' | 'Hardware/DIY';
  impactLevel: 'High' | 'Medium' | 'Critical';
  summary: string;
  actionSteps: string[];
  scientificReason: string;
  outdoorAqiCondition: 'all' | 'high_pollution' | 'clean_day';
}

export interface DirectImpactStats {
  totalCo2AvoidedKg: number;
  totalPm25AvoidedUg: number;
  carKmEquivalent: number;
  treesPlantedEquivalent: number;
  cleanAirHoursGained: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  metricsBadge?: {
    label: string;
    value: string;
    type: 'positive' | 'warning' | 'info';
  };
}
