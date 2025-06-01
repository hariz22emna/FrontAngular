export interface Prediction {
  id: number;
  real_wait_time: number;
  predicted_wait_time: number;
  time_to_registration: number;
  time_to_triage: number;
  available_beds_percent: number;
  time_of_day: number;
  urgency_level: number;
  nurse_to_patient_ratio: number;
  specialist_availability: number;
  queue_size: number;
  is_weekend: boolean;
  region_urban: boolean;
  region_rural: boolean;
  season_spring: boolean;
  season_summer: boolean;
  season_fall: boolean;
  season_winter: boolean;
  day_of_week_monday: boolean;
  day_of_week_tuesday: boolean;
  day_of_week_wednesday: boolean;
  day_of_week_thursday: boolean;
  day_of_week_friday: boolean;
  day_of_week_saturday: boolean;
  day_of_week_sunday: boolean;
}